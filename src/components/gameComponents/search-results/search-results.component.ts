import { Component, inject, Input } from '@angular/core';
import { Game } from '../../../Model/Interfaces/game';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {Videogame} from '../../../Model/Interfaces/videogame';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input()
  games: Game[] = [];

  gameService = inject(VideojuegosService);

  postGame(game: Game) {
    this.gameService.post(game).subscribe({
      next: (nuevoJuego: Videogame) => {
        alert("Game added successfully");
      },
      error: (err) => {
       alert("Videogame Already Exists");
       console.log(err)
      }
    });
  }
}
