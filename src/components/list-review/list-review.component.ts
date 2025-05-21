import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { Review } from '../../Model/Interfaces/Review';
import { AuthService } from '../../services/AuthService';
import { UsersService } from '../../services/Users.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Videogame } from '../../Model/Interfaces/videogame';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-review',
  standalone: true,
  imports: [CommonModule, CardModule,RouterModule,FormsModule],
  templateUrl: './list-review.component.html',
  styleUrl: './list-review.component.css'
})

export class ListReviewComponent implements OnInit {
 ngOnInit(): void {
  this.id = this.route.snapshot.paramMap.get('videogameId'); // Obtiene el ID de la ruta
  if (this.id) {
    this.getAllReviews(this.id);
  }
  }


  authService = inject(AuthService)

  usersService = inject (UsersService)

  vgservice = inject(VideojuegosService)

  route = inject(ActivatedRoute)

  constructor(private cdr: ChangeDetectorRef ,private router: Router ) {}

  reviewSeleccionada: Review | null = null; // Variable para almacenar la reseña seleccionada

  id: string | null = null;

  listReview: Review [] = [];

  addReviewToList(review: Review){
    this.listReview.push(review);
  }

 searchAllReviews(videojuego: Videogame) {

}

  getAllReviews(id: string){
    this.vgservice.getById(id).subscribe(
      {
        next: (users) => {
          const videojuego: Videogame = users;
          this.searchAllReviews(videojuego);
        }
      }
    )
  }

  sortReviews(event: Event) {
    const target = event.target as HTMLSelectElement | null; // Asegura que target no sea null
    const filter = target?.value; // Accede a value solo si target no es null

    switch (filter) {
      case 'fechaCreacion':
        console.log(this.listReview)
        //this.listReview.sort((a, b) => (b.fechaCreacion).toISOString (a.fechaCreacion).toISOString);
        this.listReview.sort((a, b) => a.title.localeCompare(b.title));
        console.log(this.listReview)
        this.cdr.detectChanges();
        break;
      case 'rating':
        console.log(this.listReview)
        this.listReview.sort((a, b) => (b.averageRating) - (a.averageRating)); // Maneja rating como un número y nullish coalescing
        console.log(this.listReview)
        this.cdr.detectChanges();

        break;
    }
  }

  seleccionarReview(review: Review): void {
    this.reviewSeleccionada = review;
  }

}
