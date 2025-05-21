import { Injectable } from '@angular/core';
import {environment} from '../environments/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Comment, CommentResponse, Review} from '../Model/Interfaces/Review';
import {AuthService} from './AuthService';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private reviewsEndpoint = environment.reviewsEndpoint;


  constructor(private http: HttpClient,
              private authService: AuthService) { }

  likeReview(reviewId: number | string, userId: number): Observable<Review> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.post<Review>(`${this.reviewsEndpoint}/${reviewId}/like/${userId}`, {}, {headers});
  }

  dislikeReview(reviewId: number | string, userId: number): Observable<Review> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.post<Review>(`${this.reviewsEndpoint}/${reviewId}/dislike/${userId}`, {} , {headers});
  }

  getComments(reviewId: number | string): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(`${this.reviewsEndpoint}/${reviewId}/comments`);
  }

  addComment(reviewId: number | string, comment: Comment): Observable<Comment> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.post<Comment>(`${this.reviewsEndpoint}/${reviewId}/comments`, comment, {headers});
  }

  likeComment(reviewId: number | string, commentId: number | string | undefined, userId: number): Observable<Comment> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.post<Comment>(`${this.reviewsEndpoint}/${reviewId}/comments/${commentId}/like/${userId}`, {}, {headers});
  }

  dislikeComment(reviewId: number | string, commentId: number | string | undefined, userId: number): Observable<Comment> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.post<Comment>(`${this.reviewsEndpoint}/${reviewId}/comments/${commentId}/dislike/${userId}`, {} , {headers});
  }

  deleteComment(reviewId: number | string, commentId: number | string | undefined): Observable<void> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.delete<void>(`${this.reviewsEndpoint}/${reviewId}/comments/${commentId}`, {headers});
  }

  getByID(id: number | string): Observable<Review> {
    return this.http.get<Review>(`${this.reviewsEndpoint}/${id}`);
  }

}
