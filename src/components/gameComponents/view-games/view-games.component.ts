import {Component, OnInit,ViewEncapsulation } from '@angular/core';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {AuthService} from '../../../services/AuthService';
import {UsersService} from '../../../services/Users.service';
import {RouterLink} from '@angular/router';
import {Paginator, PaginatorModule} from 'primeng/paginator';
import {Button} from 'primeng/button';



@Component({
  selector: 'app-view-games',
  standalone: true,
  imports: [
    RouterLink, PaginatorModule
  ],
  templateUrl: './view-games.component.html',
    styleUrl: './view-games.component.css',
    encapsulation: ViewEncapsulation.None
})
export class ViewGamesComponent implements OnInit {
  videojuegos: Videogame[] = [];
  totalRecords: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;


  constructor(private videojuegosService: VideojuegosService,
              private userService: UsersService,
              private authService: AuthService) {
  }



    ngOnInit(): void {
      this.videojuegosService.videogames$.subscribe((data) => {
        this.videojuegos = data;
      });

      this.videojuegosService.pageInfo$.subscribe((pageInfo) => {
        this.totalRecords = pageInfo.totalElements || 0;
        this.currentPage = pageInfo.currentPage || 0;
        this.pageSize = pageInfo.pageSize || 10;
      });

      this.loadVideogames();
    }
  loadVideogames() {
    const { genre, platform, title } = this.videojuegosService.getParams();
    // Llama al método del servicio para obtener los videojuegos con los filtros y la paginación
    this.videojuegosService.get(genre, platform, title, this.currentPage, this.pageSize);
  }

  addVideogame(videogame: Videogame) {
      if(this.authService.isSessionActive()){
      const user = this.authService.getCurrentUser();

      this.userService.addVideogameToLibrary(user!.id,videogame.id ).subscribe({
        next: (data) => {
          alert("Game added to your library");
        },
        error: (error) => {
          if (error.status === 400) {
            alert("Game already in your library");
          }
        }
      });


    }else{
      alert("Debe estar registrado para agregar juegos a la biblioteca.");
    }
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.loadVideogames();
  }

}
