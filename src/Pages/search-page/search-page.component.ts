import { Component } from '@angular/core';
import { SearchResultsComponent } from '../../components/gameComponents/search-results/search-results.component';
import { GameSearchComponent } from '../../components/gameComponents/game-search/game-search.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [SearchResultsComponent, GameSearchComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {

}
