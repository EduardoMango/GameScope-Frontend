import {Component, OnInit} from '@angular/core';
import {YoutubePlayerComponent} from 'ngx-youtube-player';
import {ActivatedRoute, Router, RouterLink, RouterModule} from '@angular/router';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {FormsModule} from '@angular/forms';
import {KnobModule} from 'primeng/knob';
import {CardModule} from 'primeng/card';
import { ListReviewComponent } from "../../list-review/list-review.component";
import {AuthService} from '../../../services/AuthService';
import {UsersService} from '../../../services/Users.service';
import {ScoreKnobComponent} from '../score-knob/score-knob.component';

@Component({
  selector: 'app-videogame-banner',
  standalone: true,
  imports: [YoutubePlayerComponent, KnobModule, FormsModule, CardModule, RouterLink, RouterModule, ScoreKnobComponent],
  templateUrl: './videogame-banner.component.html',
  styleUrl: './videogame-banner.component.css'
})
export class VideogameBannerComponent implements OnInit{

  value: string = "0";
  player!: YT.Player;
   id!: string;
  videogame!: Videogame;
   constructor(private ActivatedRoute: ActivatedRoute,
               private videogameService: VideojuegosService,
               private authService: AuthService,
               private userService: UsersService) {

   }

   ngOnInit() {
    this.id = this.ActivatedRoute.snapshot.params['videogameId'];
    if(this.id) {
      this.videogameService.getById(this.id).subscribe(videogame => {
        this.videogame = videogame;

        this.value = videogame.globalScore.toFixed(2);
      })
    }

   }

  savePlayer(player: YT.Player) {
       this.player = player;
  }
  onStateChange(event: any) {
    console.log("player state", event.data);
  }

  addToLibrary(videogameId: string) {
    let user = this.authService.getCurrentUser();
    if(user){
      this.userService.addVideogameToLibrary(user!.id, videogameId).subscribe({
        next: (data) => {
          alert("Game added to your library");
        },
        error: (error) => {
          if (error.status === 400) {
            alert("Game already in your library");
          }
        }
      });
    } else{
      alert('You must be logged in to add videogames to your library.');
    }

  }


}
