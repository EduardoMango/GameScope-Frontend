import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent implements OnInit {
  ngOnInit(): void {
    this.updateStars();
  }
  @Input() rating: number = 0; // Valor inicial
  @Output() ratingChange = new EventEmitter<number>();

  stars: boolean[] = Array(5).fill(false); // Para renderizar estrellas dinámicamente
  updateStars(): void {
    this.stars = this.stars.map((_, i) => i < this.rating);
  }

  setRating(index: number): void {
    this.rating = index + 1; // La estrella seleccionada (de 1 a 5)
    this.ratingChange.emit(this.rating); // Emitir el valor de la puntuación
    this.updateStars();
  }
}
