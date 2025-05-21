import {Component, OnInit} from '@angular/core';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {AuthService} from '../../../services/AuthService';
import {UsersService} from '../../../services/Users.service';
import {RouterLink} from '@angular/router';
import {User} from '../../../Model/Interfaces/User';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  videojuegos: Videogame[] = [];
  constructor(private videojuegosService: VideojuegosService,
              private authService: AuthService,
              private userService: UsersService) {
  }

  ngOnInit() {
    this.videojuegosService.get();
    this.videojuegosService.videogames$.subscribe({
      next: (videojuegos) => {
        this.videojuegos = videojuegos;
      }
    })
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
}
