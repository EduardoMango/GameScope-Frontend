import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideojuegosService } from '../../../services/videojuegos.service';
import { Review, Comment } from '../../../Model/Interfaces/Review';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { Videogame } from '../../../Model/Interfaces/videogame';
import {User, UserDTO} from '../../../Model/Interfaces/User';
import { AuthService } from '../../../services/AuthService';
import { UsersService } from '../../../services/Users.service';
import {ReviewService} from '../../../services/review.service';

@Component({
  selector: 'app-review-completa',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, RatingModule, CommonModule],
  templateUrl: './review-completa.component.html',
  styleUrls: ['./review-completa.component.css']
})
export class ReviewCompletaComponent implements OnInit {

  videojuego: Videogame | undefined;
  user!: UserDTO | null;
  reviews: Review[] = [];
  comments: Comment[] = [];

  isAdmin: boolean = false;

  isLiked: boolean = false;
  isDisliked: boolean = false;

  reviewSeleccionada: Review | null = null; // Variable para almacenar la reseña seleccionada

  idVideogame : string | null = null;
  idReview : string | null = null;

  authService = inject(AuthService)
  usersService = inject (UsersService)



  constructor(
    private route: ActivatedRoute,
    private videojuegosService: VideojuegosService,
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  comentarioForm!: FormGroup;

  ngOnInit(): void {
    this.idVideogame = this.route.snapshot.paramMap.get('videogameId');
    if (this.idVideogame) {
      this.videojuegosService.getById(this.idVideogame).subscribe((data) => {
        this.videojuego = data;
      });



      const usuarioActual = this.authService.getCurrentUser();
      this.comentarioForm = this.fb.group({
        content: ['', [Validators.required, Validators.minLength(5)]],
      });

      this.user = usuarioActual;
      this.isAdmin = this.authService.isAdmin();
    }


    this.idReview = this.route.snapshot.paramMap.get('reviewId');
    if (this.idReview) {
      this.reviewService.getByID(this.idReview).subscribe((data) => {
        this.reviewSeleccionada = data;
      })
    }

    this.loadComments();
  }

  // Método para volver a la lista de reseñas
  volverALista(): void {
    this.router.navigate(['/videogames/' + this.idVideogame + '/reviews']);
  }


loadComments() {
  this.reviewService.getComments(this.idReview!).subscribe({
    next: (response) => {
      this.comments = response._embedded?.commentDTOList || [];
    },
    error: (error) => {
      console.error('Error al obtener los comentarios:', error);
    },
  })
}

/** COMENTARIOS */
addComent() {
  if (this.comentarioForm.invalid) return;

  let data = this.comentarioForm.getRawValue();
  const nuevoComentario: Comment = {
    author: this.user!,
    review: this.reviewSeleccionada!,
    content: data.content,
    date: new Date(),
    likedBy: [],
    dislikedBy: [],
    commentKarma: 0
  }

  this.reviewService.addComment(this.reviewSeleccionada!.id, nuevoComentario).subscribe({
    next: () => {
      this.loadComments();
    },
    error: (error) => {
      console.error('Error al agregar el comentario:', error);
    },
  });

    this.comentarioForm.reset();
}

likeReview(review: Review) {
  this.reviewService.likeReview(review.id, this.user!.id).subscribe({
    next: (response) => {
      this.reviewSeleccionada = response;
      this.isLiked = true;
      this.isDisliked = false;
    },
    error: (error) => {
      console.error('Error al dar like a la reseña:', error);
    },
  });
}

dislikeReview(review: Review) {
  this.reviewService.dislikeReview(review.id, this.user!.id).subscribe({
    next: (response) => {
      this.reviewSeleccionada = response;
      this.isLiked = false;
      this.isDisliked = true;
    },
    error: (error) => {
      console.error('Error al dar like a la reseña:', error);
    },
  });
}

likeComment(comment: Comment) {
this.reviewService.likeComment(this.reviewSeleccionada!.id, comment.id, this.user!.id).subscribe({
  next: () => {
    this.loadComments();
  },
  error: (error) => {
    console.error('Error al dar like al comentario:', error);
  },
})
}

dislikeComment(comment: Comment) {
this.reviewService.dislikeComment(this.reviewSeleccionada!.id, comment.id, this.user!.id).subscribe({
  next: () => {
    this.loadComments();
  },
  error: (error) => {
    console.error('Error al dar dislike al comentario:', error);
  },
})
}
isReviewLikedByUser(review: Review): boolean {
  return review.likedBy?.some((user) => user.username === this.user?.username);
}

isReviewDislikedByUser(review: Review): boolean {
  return review.dislikedBy?.some((user) => user.username === this.user?.username);
}
  isDislikedByUser(comentario: Comment): boolean {
    return comentario.dislikedBy?.some((user) => user.username === this.user?.username);
  }
  isLikedByUser(comentario: Comment): boolean {
    return comentario.likedBy?.some((user) => user.username === this.user?.username);
  }

  isOwnComment(comment: Comment): boolean {
    return comment.author.username === this.user?.username;
  }

  deleteComment(comment: Comment) {
    this.reviewService.deleteComment(this.reviewSeleccionada!.id, comment.id).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (error) => {
        console.error('Error al eliminar el comentario:', error);
      },
    });
  }
}
