import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {VideogameGenres} from '../../../Model/enums/videogame-genres';
import {VideoGamePlatform} from '../../../Model/enums/videogamePlatform';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {ViewGamesComponent} from '../view-games/view-games.component';

@Component({
  selector: 'app-search-videogame',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-videogame.component.html',
  styleUrl: './search-videogame.component.css',
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible <=> hidden', animate('1s ease-in-out')),
    ]),
  ],
})
export class SearchVideogameComponent {

  genres = Object.values(VideogameGenres);
  platforms = Object.values(VideoGamePlatform);

  showSearchForm = true; // Control de visibilidad del formulario
  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private videogameService: VideojuegosService) {
    // Configuración del formulario reactivo
    this.searchForm = this.formBuilder.group({
      title: [''],
      genre: [''],
      platform: ['']
    });
  }

  // Método para manejar el envío del formulario
  onSearch(): void {

    this.videogameService.setFilters(this.searchForm.get('genre')?.value,
                                      this.searchForm.get('platform')?.value,
                                      this.searchForm.get('title')?.value)

    this.videogameService.get(this.searchForm.get('genre')?.value,
                              this.searchForm.get('platform')?.value,
                              this.searchForm.get('title')?.value, 0, 10, true);

    this.searchForm.reset();

  }
}
