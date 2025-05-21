import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UsersService} from '../../../services/Users.service';
import {FormsModule} from '@angular/forms';
import {UserDTO} from '../../../Model/Interfaces/User';
import {userTitle} from '../../../Model/enums/user-titles';
import {RouterModule} from '@angular/router';
import {AuthService} from '../../../services/AuthService';
import {PaginatorModule} from 'primeng/paginator';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-view-users',
  standalone: true,
  imports: [FormsModule, RouterModule, PaginatorModule, CommonModule],
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ViewUsersComponent  implements OnInit{

  totalRecords: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;

  busqueda:string = '';
  resultados: boolean = true;
  searched: boolean = false;
  loggedUser!: UserDTO | null;

  activeUsers: UserDTO[] = [];


  users: UserDTO[] = [];
  following: UserDTO[] = [];

  constructor(private usersService: UsersService,
              private authService: AuthService,
              private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.loggedUser = this.authService.getCurrentUser();

    this.loadFollowedUsers()
  }

  loadFollowedUsers(){
    this.usersService.getFollowedUsers(this.loggedUser!.id,this.currentPage,this.pageSize).subscribe({
      next: (response) => {
        this.following = response._embedded.userDTOList;
        this.totalRecords = response.page.totalElements;
        this.pageSize = response.page.size;
        this.currentPage = response.page.number;

        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  searchUser(username:string){
    if(username.length > 0){
      this.searched = true;
      this.usersService.getByUsername(username,this.currentPage,this.pageSize,this.loggedUser?.username!).subscribe({
        next: (response) => {

          if (response._embedded){
            const users: UserDTO[] = response._embedded.userDTOList || [];
            // Filtrar el usuario logueado
            this.users = users.filter(user => user.username !== this.loggedUser?.username);

            // Verificar si el usuario logueado es admin
            const isAdmin = this.authService.isAdmin();  // Suponiendo que esta función retorna un booleano

            if (!isAdmin) {
              // Si no es admin, eliminar los usuarios baneados
              this.users = this.users.filter(user => !user.isBanned);
            }
            this.resultados = this.users.length > 0;
            this.totalRecords = response.page.totalElements;
            this.pageSize = response.page.size;
            this.currentPage = response.page.number;

          } else {
            console.log("No hay resultados");
            this.resultados = false;
          }

        },
        error: (error) => {
          console.log(error);
        }
      })
    } else {
      alert("Please enter a username");
    }

    }

  protected readonly userTitle = userTitle;

  followUser(userID: number) {

   this.usersService.isFollowingUser(this.loggedUser!.id, userID).subscribe({
     next: (response) => {
       if (response) {
         alert("You are already following this user.");
         return;
       }
       else {
         this.usersService.followUnfollowUser(this.loggedUser!.id, userID).subscribe({
           next: () => {
             alert("User has been followed.");
             this.loggedUser!.followingCount += 1;
             this.authService.updateSessionUser(this.loggedUser!);
           },
           error: (e: Error) => {
             console.error("Error following user:", e.message);
           }
         });
       }
     },
     error: (error) => {
       console.error("Error connecting to server:", error.message);
     }
   })
    this.cdr.detectChanges();
  }


  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.pageSize = event.rows;

    if (this.searched) {
      // When searching
      this.searchUser(this.busqueda);
    } else {
      // When showing followed users
      this.loadFollowedUsers();
    }
  }

  resetSearch() {
    this.searched = false;
  }
}
