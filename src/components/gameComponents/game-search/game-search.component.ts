import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IgdbService } from '../../../services/igdb-service.service';
import { Game } from '../../../Model/Interfaces/game';
import { SearchResultsComponent } from '../search-results/search-results.component';

@Component({
  selector: 'app-game-search',
  standalone: true,
  imports: [ReactiveFormsModule, SearchResultsComponent],
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.css']
})
export class GameSearchComponent {
  searchForm: FormGroup;
  games: Game[] = [];
  loading = false;
  results: boolean = true;
  error: string | null = null;

  constructor(private fb: FormBuilder, private igdbService: IgdbService) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  onSearch() {
    const query = this.searchForm.get('query')?.value;
    console.log("Iniciando búsqueda:", query);
    this.loading = true;
    this.error = null;
    this.results = true;
    this.igdbService.getGames(query).subscribe({
      next: (games) => {
        console.log("Juegos recibidos:", games.length);
        this.games = games;
        this.loading = false;

        if(this.games.length == 0){
          this.results = false;
        }
      },
      error: (err) => {
        this.error = 'Error al cargar los juegos';
        console.error(err);
        this.loading = false;
      },
    });
  }
}


