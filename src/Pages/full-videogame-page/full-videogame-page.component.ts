import { Component } from '@angular/core';
import {VideogameBannerComponent} from '../../components/gameComponents/videogame-banner/videogame-banner.component';

@Component({
  selector: 'app-full-videogame-page',
  standalone: true,
  imports: [
    VideogameBannerComponent
  ],
  templateUrl: './full-videogame-page.component.html',
  styleUrl: './full-videogame-page.component.css'
})
export class FullVideogamePageComponent {

}
