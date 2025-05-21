import { Component, OnInit } from '@angular/core';
import {User, UserDTO} from '../../../Model/Interfaces/User';
import { FormsModule } from '@angular/forms';
import { AvatarsComponent } from '../avatars/avatars.component';
import { CommonModule } from '@angular/common';
import { Avatar } from '../../../Model/Interfaces/avatar.interface';
import { AuthService } from '../../../services/AuthService';
import { UsersService } from '../../../services/Users.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {userTitle} from '../../../Model/enums/user-titles';
import {LogrosUserComponent} from '../logros-user/logros-user.component';

@Component({
  selector: 'app-info-user',
  standalone: true,
  imports: [AvatarsComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css']
})
export class InfoUserComponent implements OnInit {
  user!: UserDTO;
  imageUrl: string = 'https://via.placeholder.com/150';
  showAvatars: boolean = false; // Para controlar si se muestran los avatares
  isCurrentUser: boolean = false;
  isFollowing: boolean = false;
  isAdmin: boolean = false;
  isBanned: boolean = false;

  title: string = userTitle.Collector.toString();


  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {

    // Obtener el parámetro `userId` de la ruta si existe
    const userId = Number(this.route.snapshot.paramMap.get('userId'));

    this.isAdmin = this.authService.isAdmin();
    console.log(this.isAdmin)

    if (userId) {
      this.getUser(userId);
    }
    if(!userId) {
      // Si no hay `userId`, cargar el usuario actual
      this.user = this.authService.getCurrentUser() as UserDTO;
      this.isCurrentUser = true;
      this.title = this.user.currentTitle.toString();


      if (!this.user) {
        this.initializeDefaultUser(); // Si no hay usuario actual, inicializa el usuario por defecto
      }

      this.imageUrl = this.user.avatarUrl;
    }
  }

  // Método para inicializar un usuario por defecto
  private initializeDefaultUser() {
    // Crea un usuario por defecto aquí
    this.user = {
      id:0,
      username: 'Usuario por Defecto', // Cambia esto al nombre de usuario por defecto
      avatarUrl: "https://via.placeholder.com/150",
      isAdmin: false,
      isActive: true,
      isBanned: false,
      currentTitle: userTitle.Collector,
      followerCount: 0,
      followingCount: 0,
      reviewCount: 0,
      karma: 0,
      email: 'defaultEmail', // Cambia esto a tu correo por defecto
      notifications:[]
    };
  }

  // Método para mostrar/ocultar los avatares
  toggleAvatarSelection() {
    this.showAvatars = !this.showAvatars;
  }

  // Método para seleccionar un avatar
  onAvatarSelected(avatar: Avatar) {
    this.imageUrl = avatar.url;
    localStorage.setItem('profileImage', avatar.url); // Guarda la imagen seleccionada
    this.user.avatarUrl = avatar.url;
    this.userService.updateTitleAvatar(this.user.id, null, this.user.avatarUrl).subscribe();
    this.authService.updateSessionUser(this.user);
    this.showAvatars = false;
  }

  checkIfFollowing(userID: number) {
    const thisUser = this.authService.getCurrentUser();
    this.userService.isFollowingUser(thisUser!.id, userID).subscribe({
      next: (response) => {
        this.isFollowing = response;
      }
    })
  }

  followUnfollowUser() {
    const thisUser = this.authService.getCurrentUser();
    this.userService.followUnfollowUser(thisUser!.id, this.user.id).subscribe({
      next: (response) => {
        this.isFollowing = response;
        this.getUser(this.user.id);
      }
    })
  }

  banUser() {

    if(confirm("Are you sure you want to ban this user?")){
      this.userService.banUser(this.user.id).subscribe({
        next: () => {
          this.isBanned = true;
        }
      })
    }
  }

  unbanUser() {

    if(confirm("Are you sure you want to unban this user?")){
      this.userService.unbanUser(this.user.id).subscribe({
        next: () => {
          this.isBanned = false;
        }
      })
    }
  }

  getUser(userId: number) {
    // Si `userId` está presente, cargar otro usuario
    this.userService.findUserById(userId).subscribe(
      (user) => {
        this.user = user;
        this.isBanned = user.isBanned
        this.imageUrl = user.avatarUrl || this.imageUrl; // Actualiza la imagen después de asignar el usuario
        this.checkIfFollowing(userId)
      },
      (error) => {
        console.error('Error al cargar el usuario:', error);
        this.initializeDefaultUser(); // Llama al método para inicializar el usuario por defecto si falla
      }
    );
  }

  deactivateAccount(){
    if (confirm("Are you sure you want to deactivate your account?")) {
      this.userService.deactivateUser(this.user.id).subscribe({
        next: () => {
          alert("User has been deactivated.");
          this.authService.logout();
          this.router.navigate(['/home']);
        },
        error: (e: Error) => {
          console.error("Error deleting user:", e.message);
        }
      });
    }
  }

  changeTitle(newTitle: userTitle ) {

    const thisUser = this.authService.getCurrentUser();
    thisUser!.currentTitle=newTitle;
    this.authService.updateSessionUser(thisUser!);

    this.userService.updateTitleAvatar(thisUser!.id, newTitle, null).subscribe({
      next: (response) => {
        this.user.currentTitle = newTitle;
      }
    })
  }


  protected readonly userTitle = userTitle;
}
