import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../../Model/Interfaces/Review'
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/AuthService';
import {User, UserDTO} from '../../../Model/Interfaces/User';
import { UsersService } from '../../../services/Users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {VideojuegosService} from '../../../services/videojuegos.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [ReactiveFormsModule, RatingModule, CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {

  authService = inject(AuthService);
  reviewForm: FormGroup;

  videogameID: string | null = null;
  videogame: Videogame | null = null;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private usersService: UsersService,
              private videogameService: VideojuegosService,
              private router: Router) {
    this.videogameID = this.activatedRoute.snapshot.paramMap.get('videogameId');
    this.videogameService.getById(this.videogameID!).subscribe(videogame => this.videogame = videogame);


    this.reviewForm = fb.group({
      id: [''], //CAMBIE ESTO SI NO FUNCIONA SE BORRA
      title: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.minLength(50), Validators.maxLength(500)]],
      graphicsRating: [null, [Validators.required]],
      graphicsComment: ['',[Validators.minLength(50), Validators.maxLength(500)]],
      gameplayRating: [null, [Validators.required]],
      gameplayComment: ['',[Validators.minLength(50), Validators.maxLength(500)]],
      priceQualityRating: [null, [Validators.required]],
      priceQualityComment: ['',[Validators.minLength(50), Validators.maxLength(500)]],

    })
  }

  onSubmit() {
   if (this.authService.isSessionActive()) {
     const user = this.authService.getCurrentUser();
     const review: Review = this.reviewForm.value;
     review.user = user!;
     review.videogame = this.videogame!;
     const averageRating = (review.graphicsRating + review.gameplayRating + review.priceQualityRating) / 3;
     const fixedAverageRating = averageRating.toFixed(2);
     review.averageRating = parseFloat(fixedAverageRating);

     this.videogameService.addReview(review).subscribe({
       next: () => {
         alert("Review added successfully");
         this.router.navigate(['/videogame', this.videogameID]);
       },
       error: (err) => {
         alert("Error adding review");
         console.log(err);
       }
     });
   }
  }


  get titleError(){
    const control = this.reviewForm.get('titulo');
    return control?.touched && control.invalid ? 'Minimum characters required' : null;
  }

  get contentError(){
    const control = this.reviewForm.get('contenido');
    return control?.touched;
  }

  getUserId(user: UserDTO): number{
      return user?.id;
  }
}

