import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-score-knob',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-knob.component.html',
  styleUrl: './score-knob.component.css'
})
export class ScoreKnobComponent {
  @Input() videogame: any;  // Recibimos la propiedad videogame del componente padre

  // Calcular el porcentaje de la puntuación para la perilla
  get scorePercentage(): number {
    return (this.videogame?.globalScore || 0) * 20;  // Transformamos la puntuación a porcentaje (de 0 a 100)
  }
}
