import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../../services/AuthService';
import {User, UserDTO} from '../../../Model/Interfaces/User';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {UsersService} from '../../../services/Users.service';
import {RouterLink} from '@angular/router';
import {PaginatorModule} from "primeng/paginator";

@Component({
  selector: 'app-user-library',
  standalone: true,
    imports: [
        RouterLink,
        PaginatorModule
    ],
  templateUrl: './user-library.component.html',
  styleUrl: './user-library.component.css',
  encapsulation: ViewEncapsulation.None

})
export class UserLibraryComponent implements OnInit {

  user!: UserDTO | null;
  library: Videogame[] = [];

  totalRecords: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  constructor(private authService: AuthService,
              private userService: UsersService) {
    this.userService.videogames$.subscribe((data) => {
      this.library = data;
    });

    this.userService.pageInfo$.subscribe((pageInfo) => {
      this.totalRecords = pageInfo.totalElements || 0;
      this.currentPage = pageInfo.currentPage || 0;
      this.pageSize = pageInfo.pageSize || 10;
    });
  }

  ngOnInit(): void {
    this.user= this.authService.getCurrentUser();

    this.loadVideogames();

    }

    loadVideogames() {
      this.userService.getLibrary(this.user!.id, this.currentPage, this.pageSize);
    }

  removeVideogame(videogame: Videogame) {
    const gameIndex = this.library.findIndex(game => game.id === videogame.id);

    this.library.splice(gameIndex, 1);

    this.userService.removeVideogameFromLibrary(this.user!.id, videogame.id).subscribe({
      next: () => {
        alert("Game removed from your library");
        this.loadVideogames();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.loadVideogames();
  }
}
