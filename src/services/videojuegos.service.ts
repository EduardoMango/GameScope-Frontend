import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Videogame} from '../Model/Interfaces/videogame';
import {BehaviorSubject, catchError, EMPTY, map, Observable, tap, throwError} from 'rxjs';
import {VideogameGenres} from '../Model/enums/videogame-genres';
import {VideoGamePlatform} from '../Model/enums/videogamePlatform';
import {Game} from '../Model/Interfaces/game';
import {switchMap} from 'rxjs/operators';
import { environment } from '../environments/environment.development';
import {Review, Comment, ReviewResponse} from '../Model/Interfaces/Review';
import {AuthService} from './AuthService';
import {VideogameResponse} from '../Model/Interfaces/VideogameResponse';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  private genreSubject = new BehaviorSubject<string | null>(null);
  private platformSubject = new BehaviorSubject<string | null>(null);
  private titleSubject = new BehaviorSubject<string | null>(null);
  private videogamesSubject: BehaviorSubject<Videogame[]> = new BehaviorSubject<Videogame[]>([]);
  private pageInfoSubject = new BehaviorSubject<any>({});


  genre$ = this.genreSubject.asObservable();
  platform$ = this.platformSubject.asObservable();
  title$ = this.titleSubject.asObservable();
  videogames$: Observable<Videogame[]> = this.videogamesSubject.asObservable();
  pageInfo$ = this.pageInfoSubject.asObservable();

  private videogamesEndpoint = environment.videogamesEndpoint
  private reviewsEndpoint = environment.reviewsEndpoint

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  setFilters(genre: string | null, platform: string | null, title: string | null) {
    this.genreSubject.next(genre);
    this.platformSubject.next(platform);
    this.titleSubject.next(title);
  }
  getParams() {
    return {
      genre: this.genreSubject.value,
      platform: this.platformSubject.value,
      title: this.titleSubject.value,
    };
  }

  get(genre?: string | null,
      platform?: string | null,
      title?: string | null,
      page: number = 0,
      size: number = 10,
      filtered: boolean | null = false): void {
    let params = new HttpParams();

    if (genre) {
      params = params.set('genre', genre);
    }
    if (platform) {
      params = params.set('platform', this.getEnumKeyByValue(VideoGamePlatform, platform.toString())!);
    }
    if (title) {
      params = params.set('title', title);
    }
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    // Primera petición HTTP
    this.http.get<VideogameResponse>(this.videogamesEndpoint, { params }).pipe(
      tap((response) => {
        const videogames = response._embedded?.videogameDTOList || [];
        this.videogamesSubject.next(videogames);

        const pageInfo = {
          totalElements: response.page.totalElements,
          totalPages: response.page.totalPages,
          currentPage: response.page.number,
          pageSize: response.page.size
        };
        this.pageInfoSubject.next(pageInfo);
      }),
      catchError((error) => {
        console.error(error);
        return [];
      })
    ).subscribe(() => {
      // Evalúa el filtro solo después de completar la primera petición
      if (this.videogamesSubject.value.length === 0 && filtered) {
        alert("Could not find any results for the selected filters");

        // Segunda petición HTTP para obtener todos los videojuegos
        this.http.get<VideogameResponse>(this.videogamesEndpoint).pipe(
          tap((response) => {
            const videogames = response._embedded?.videogameDTOList || [];
            this.videogamesSubject.next(videogames);

            const pageInfo = {
              totalElements: response.page.totalElements,
              totalPages: response.page.totalPages,
              currentPage: response.page.number,
              pageSize: response.page.size
            };
            this.pageInfoSubject.next(pageInfo);
          }),
          catchError((error) => {
            console.error(error);
            return [];
          })
        ).subscribe();
      }
    });
  }


  getEnumKeyByValue(enumObj: any, value: string): string | undefined {
    return Object.keys(enumObj).find(key => enumObj[key] === value);
  }

 getById(id: string): Observable<Videogame> {
   return this.http.get<Videogame>(`${this.videogamesEndpoint}/${id}`);
 }


  post(game:Game): Observable<Videogame> {
    const videogame: Videogame = this.convertGametoVideogame(game)
    const token = this.authService.getJWToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });

    console.log(headers)

    return this.http.post<Videogame>(this.videogamesEndpoint, videogame, {headers}).pipe(
      tap((data) => {
        const videogamesActuales = this.videogamesSubject.value;
        this.videogamesSubject.next([...videogamesActuales, data]);
      }),
      catchError((error) => {
        console.log(headers);
        throw error;
      })
    )
  }

  convertGametoVideogame(game: Game): Videogame {
    return {
      id: game.id,
      title: game.titulo,
      companies: game.empresas,
      image: game.imagen,
      genres: game.generos.map(genre => genre as VideogameGenres),  // Asegúrate de que los géneros correspondan a VideogameGenres
      storyline: game.storyline,
      globalScore: 0,  // Inicializa el puntaje global en 0
      releaseDate: game.fechaLanzamiento,  // Valor predeterminado; podrías cambiarlo si tienes una fecha específica
      platforms: game.plataformas.map(platform => platform as VideoGamePlatform),  // Conversión de plataformas
      similarGames: game.similarGames.map((id) => id.toString()),  // Inicializa con una lista vacía de juegos similares
      idVideo: game.videos[0] || ''  // Toma el primer video, si está presente, o usa un string vacío
    }
  }


addReview(review: Review): Observable<Review> {
  const token = this.authService.getJWToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  })
  return this.http.post<Review>(`${this.reviewsEndpoint}`, review, { headers });
}

getReviews(id: string | number): Observable<ReviewResponse> {
return this.http.get<ReviewResponse>(`${this.videogamesEndpoint}/${id}/reviews`);
}

getTopGames(period: string): Observable<VideogameResponse> {
  return this.http.get<VideogameResponse>(`${this.videogamesEndpoint}/top-rated/${period}`).pipe(
  )
}

getGOTW(): Observable<Videogame> {
  return this.http.get<Videogame>(`${this.videogamesEndpoint}/gotw`);
}

}



