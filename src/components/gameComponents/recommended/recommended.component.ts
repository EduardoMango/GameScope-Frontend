import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterModule} from "@angular/router";
import {AuthService} from '../../../services/AuthService';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {User, UserDTO} from '../../../Model/Interfaces/User';
import {YoutubePlayerComponent} from 'ngx-youtube-player';
import {CommonModule} from '@angular/common';
import {UsersService} from '../../../services/Users.service';

@Component({
  selector: 'app-recommended',
  standalone: true,
  imports: [
    YoutubePlayerComponent,
    CommonModule
  ],
  templateUrl: './recommended.component.html',
  styleUrl: './recommended.component.css'
})
export class RecommendedComponent implements OnInit {

  player!: YT.Player;
  user!: UserDTO;
  recommendedGames: any[] = [];  // Lista de juegos recomendados
  userLibrary: any[] = [];        // Biblioteca de videojuegos del usuario
  currentIndex: number = 0;

  videoKey = true; // Propiedad para controlar el reinicio del componente de video
  constructor(private authService: AuthService,
              private videojuegosService: VideojuegosService,
              private userService: UsersService,
              private router: Router,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser()!;
    if (this.user) {
      this.userLibrary = [] //this.user.library;  // La biblioteca de videojuegos del usuario
      this.loadRecommendedGames();
      console.log(this.recommendedGames);
    }
  }

  loadRecommendedGames() {

    this.userService.getRecommended(this.user.id).subscribe({
      next: (response) => {
        this.recommendedGames = response || [];
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  savePlayer(player: YT.Player) {
    this.player = player;
  }
  onStateChange(event: any) {
    console.log("player state", event.data);
  }

  addToLibrary(gameId: string) {
    this.userService.addVideogameToLibrary(this.user.id, gameId).subscribe({
      next: (response) => {
        alert('Game added to library successfully');
        this.recommendedGames = this.recommendedGames.filter(game => game.id !== gameId);
        this.updateCurrentIndex();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  // Ir a la siguiente recomendación
  nextRecommendation(gameId: string) {

    this.userService.markGameAsUninterested(this.user.id, gameId).subscribe({
      next: () => {
        this.recommendedGames = this.recommendedGames.filter(game => game.id !== gameId);
        this.updateCurrentIndex();
      },
      error: (error) => {
        console.log(error);
      }
    })
    }

  private updateCurrentIndex() {
    if (this.recommendedGames.length > 0) {
      this.currentIndex = Math.min(this.currentIndex, this.recommendedGames.length - 1);

      // Forzar re-renderización del componente de video
      this.videoKey = false;
      setTimeout(() => {
        this.videoKey = true;
      });
    } else {
      console.log('No recommendations left');
    }
  }
  }

