import { Component } from '@angular/core';
import {SearchVideogameComponent} from '../../components/gameComponents/search-videogame/search-videogame.component';
import {ViewGamesComponent} from '../../components/gameComponents/view-games/view-games.component';

@Component({
  selector: 'app-videogame-page',
  standalone: true,
  imports: [
    SearchVideogameComponent,
    ViewGamesComponent
  ],
  templateUrl: './videogame-page.component.html',
  styleUrl: './videogame-page.component.css'
})
export class VideogamePageComponent {

}
