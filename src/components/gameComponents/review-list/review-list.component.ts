import {Component, OnInit, ViewChild} from '@angular/core';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {UserDTO} from '../../../Model/Interfaces/User';
import {Review} from '../../../Model/Interfaces/Review';
import {ActivatedRoute, Router} from '@angular/router';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {FormBuilder} from '@angular/forms';
import {ReviewService} from '../../../services/review.service';
import {UsersService} from '../../../services/Users.service';
import {AuthService} from '../../../services/AuthService';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css'
})
export class ReviewListComponent implements OnInit {


  videojuego: Videogame | undefined;
  user!: UserDTO | null;
  reviews: Review[] = [];
  videoJuegoId: string | null = null;



  constructor(private route: ActivatedRoute,
              private videojuegosService: VideojuegosService,
              private fb: FormBuilder,
              private reviewService: ReviewService,
              private userService: UsersService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.videoJuegoId = this.route.snapshot.paramMap.get('videogameId');
    if (this.videoJuegoId) {
      this.videojuegosService.getById(this.videoJuegoId).subscribe(videojuego => {
        this.videojuego = videojuego;
      });
    }
    this.user = this.authService.getCurrentUser()

    this.loadReviews(this.videoJuegoId!);
  }
  loadReviews(id: string | number) {
    this.videojuegosService.getReviews(id).subscribe({
      next: (response) => {
        this.reviews = response._embedded?.reviewDTOList || [];
      },
      error: (error) => {
        console.error('Error al obtener las reseñas:', error);
      },
    })
  }

  seleccionarReview(review: Review): void {
    console.log(review.id);
    console.log(this.videoJuegoId);
    this.router.navigate([`/videogames/${this.videoJuegoId}/reviews/${review.id}`]);
  }
}
