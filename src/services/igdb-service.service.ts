import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, concatMap, delay, map, switchMap, take, tap, toArray } from 'rxjs/operators';
import { Observable, BehaviorSubject, forkJoin, of, throwError, from } from 'rxjs';
import { Game } from '../Model/Interfaces/game';
import {environment} from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class IgdbService {
  private clientId = environment.clientId;
  private clientSecret = environment.clientSecret;
  private tokenEndpoint = environment.tokenEndpoint;
  private igdbEndpoint = environment.igdbEndpoint;
  private tokenSubject = new BehaviorSubject<string | null>(null);

  gamesEmitter = new EventEmitter<Game[]>(); // Nuestro EventEmitter

  constructor(private http: HttpClient) { }

  // Método para obtener el token de acceso
  getAccessToken(): Observable<string | null> {
    if (this.tokenSubject.value) {
      return this.tokenSubject.asObservable();
    } else {
      const body = `client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`;
      return this.http.post<any>(this.tokenEndpoint, body, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      }).pipe(
        tap(response => this.tokenSubject.next(response.access_token)),
        switchMap(() => this.tokenSubject.asObservable())
      );
    }
  }


  getGames(query: string): Observable<Game[]> {
    return this.getAccessToken().pipe(
      switchMap(token => {
        const body = `search "${query}"; fields *;`;
        return this.http.post<any[]>(`${this.igdbEndpoint}/games`, body, {
          headers: new HttpHeaders({
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          })
        });
      }),
      tap(games => console.log("Games received from API:", games)), // Depuración de juegos recibidos
      switchMap(games => {
        const filteredGames = games.filter(game =>
          game.id && game.name && (game.storyline || game.summary) &&
          game.cover && game.genres && game.platforms &&
          game.involved_companies && game.websites && game.videos &&
           game.first_release_date && game.similar_games
        );


        if (filteredGames.length === 0) {
          console.warn("No games with all required fields were found.");
          return of([]); // No realiza más peticiones si no hay juegos con todos los campos
        }

        const gamesWithDetails$ = filteredGames.map(game => {
          const cover$ = this.getCover(game.cover).pipe(
            map((coverData: { url: string }[]) => {
              const url = coverData[0] ? `https:${coverData[0].url.replace('t_thumb', 't_cover_big')}` : '';
              return url;
            }),
            tap(url => console.log("Cover URL con tamaño grande:", url)),
            take(1),
            catchError(error => {
              console.error("Error en cover$:", error);
              return of('');
            })
          );

          const genres$ = this.getGenres(game.genres).pipe(
            tap(genres => console.log("Genres:", genres)),
            take(1),
            catchError(error => {
              console.error("Error en genres$:", error);
              return of([]);
            })
          );

          const platforms$ = this.getPlatforms(game.platforms).pipe(
            tap(platforms => console.log("Platforms:", platforms)),
            take(1),
            catchError(error => {
              console.error("Error en platforms$:", error);
              return of([]);
            })
          );

          const companiesIds$ = this.getInvolvedCompanies(game.involved_companies).pipe(
            map(companyObjects => companyObjects.map(obj => obj.company) || []),
            tap(ids => console.log("Company IDs:", ids)),
            take(1),
            catchError(error => {
              console.error("Error en companiesIds$:", error);
              return of([]);
            })
          );

          const companies$ = companiesIds$.pipe(
            switchMap(ids => ids.length > 0 ? this.getCompanies(ids).pipe(
              tap(companies => console.log("Companies:", companies)),
              take(1),
              catchError(error => {
                console.error("Error en companies$:", error);
                return of([]);
              })
            ) : of([]))
          );

          const gameVideos$ = this.getVideos(game.videos).pipe(
            tap(videos => console.log('Videos: ', videos)),
            take(1),
            catchError(error => {
              console.error("Error en videos$:", error);
              return of([]);
            })
          );

          const websitesUrl$ = this.getWebsites(game.websites).pipe(
            tap(websites => console.log('Websites: ', websites)),
            take(1),
            catchError(error => {
              console.error("Error en websites$:", error);
              return of([]);
            })
          );

          const releaseDate = new Date(game.first_release_date * 1000)
          const formattedDate = `${releaseDate.getDate().toString().padStart(2, '0')}/${(releaseDate.getMonth() + 1).toString().padStart(2, '0')
            }/${releaseDate.getFullYear()}`

          return forkJoin([cover$, genres$, platforms$, companies$, gameVideos$, websitesUrl$]).pipe(
            tap(results => console.log("ForkJoin Results:", results)),
            map(([cover, genres, platforms, companies, gameVideos, websitesUrl]) => ({
              id: `${game.id}` as string,
              titulo: game.name as string,
              storyline: game.storyline ? game.storyline : game.summary, // Usa storyline o summary si el primero no está disponible
              imagen: cover as string,
              generos: genres.map(genre => genre.name) as string[],
              plataformas: platforms.map(platform => platform.name) as string[],
              empresas: companies.map(company => company.name) as string[],
              videos: gameVideos.map(video => video.video_id) as string[],
              websites: websitesUrl.map(website => website.url) as string[],
              fechaLanzamiento: formattedDate, // Agrega el campo con la fecha formateada
              similarGames: game.similar_games as number[]
            })),
            tap(gameDetails => console.log("Game Details:", gameDetails))
          );
        });


        return from(gamesWithDetails$).pipe(
          concatMap(gameDetails$ => gameDetails$.pipe(delay(500))), // 250 ms para no superar las 4 req/s
          toArray(), // Convierte la secuencia a un solo arreglo al finalizar
          tap(finalGames => console.log("Final Games Array:", finalGames))
        );

      }),
      tap(games => {
        console.log("Datos emitidos por gamesEmitter:", games);
        this.gamesEmitter.emit(games);
      }),
      catchError(error => {
        console.error("Error en getGames:", error);
        return throwError(() => new Error('Error al cargar los juegos'));
      })
    );
  }



  getCover(coverId: number): Observable<{ url: string }[]> {
    return this.getAccessToken().pipe(
      switchMap(token => {
        const body = `fields url; where id = (${coverId});`;
        return this.http.post<{ url: string }[]>(`${this.igdbEndpoint}/covers`, body, {
          headers: new HttpHeaders({
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          })
        }).pipe(
          tap(response => console.log("Cover result:", response)),
          catchError(error => {
            console.error("Error en getCover:", error);
            return of([{ url: '' }]);  // Devuelve un arreglo con un objeto vacío si falla
          })
        );
      })
    );
  }

  getGenres(genreIds: number[]): Observable<{ id: number, name: string }[]> {
    return this.getAccessToken().pipe(
      switchMap(token => {
        const body = `fields name; where id = (${genreIds.join(',')});`;
        return this.http.post<{ id: number, name: string }[]>(`${this.igdbEndpoint}/genres`, body, {
          headers: new HttpHeaders({
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          })
        });
      }),
      tap(response => console.log("Genres result:", response))
    );
  }

  getPlatforms(platformIds: number[]): Observable<{ id: number, name: string }[]> {
    return this.getAccessToken().pipe(
      switchMap(token => {
        const body = `fields name; where id = (${platformIds.join(',')});`;
        return this.http.post<{ id: number, name: string }[]>(`${this.igdbEndpoint}/platforms`, body, {
          headers: new HttpHeaders({
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          })
        });
      }),
      tap(response => console.log("Platforms result:", response))
    );
  }

  getInvolvedCompanies(involvedCompaniesIds: number[]): Observable<{ id: number, company: number }[]> {
    return this.getAccessToken().pipe(
      switchMap(token => {
        const body = `fields company; where id = (${involvedCompaniesIds.join(',')});`;
        return this.http.post<{ id: number, company: number }[]>(`${this.igdbEndpoint}/involved_companies`, body, {
          headers: new HttpHeaders({
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          })
        });
      }),
      tap(response => console.log("Involved Companies result:", response))
    );
  }


  getCompanies(companiesIds: number[]): Observable<{ id: number; name: string }[]> {
    if (companiesIds.length === 0) {
      return of([]); // Evita la solicitud si no hay IDs
    }

    return this.getAccessToken().pipe(
      switchMap(token => {
        console.log(companiesIds);
        const body = `fields name; where id = (${companiesIds.join(',')});`;
        return this.http.post<{ id: number; name: string }[]>(`${this.igdbEndpoint}/companies`, body, {
          headers: new HttpHeaders({
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          })
        });
      }),
      tap(response => console.log("Resultado de getCompanies:", response)), // Verifica el resultado
      catchError(error => {
        console.error("Error en getCompanies:", error);
        return of([]); // Devuelve un arreglo vacío en caso de error
      })
    );
  }

  // Método para obtener videos
  getVideos(videoIds: number[]): Observable<{ video_id: string }[]> {
    if (videoIds.length === 0) {
      return of([]); // Evita la solicitud si no hay IDs
    }

    return this.getAccessToken().pipe(
      switchMap(token => {
        const body = `fields video_id; where id = (${videoIds.join(',')});`;
        return this.http.post<{ video_id: string }[]>(`${this.igdbEndpoint}/game_videos`, body, {
          headers: new HttpHeaders({
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          })
        });
      }),
      tap(response => console.log("Videos result:", response)), // Depuración del resultado
      catchError(error => {
        console.error("Error en getVideos:", error);
        return of([]); // Devuelve un arreglo vacío en caso de error
      })
    );
  }

  // Método para obtener sitios web
  getWebsites(websiteIds: number[]): Observable<{ url: string }[]> {
    if (websiteIds.length === 0) {
      return of([]); // Evita la solicitud si no hay IDs
    }

    return this.getAccessToken().pipe(
      switchMap(token => {
        const body = `fields url; where id = (${websiteIds.join(',')});`;
        return this.http.post<{ url: string }[]>(`${this.igdbEndpoint}/websites`, body, {
          headers: new HttpHeaders({
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          })
        });
      }),
      tap(response => console.log("Websites result:", response)), // Depuración del resultado
      catchError(error => {
        console.error("Error en getWebsites:", error);
        return of([]); // Devuelve un arreglo vacío en caso de error
      })
    );
  }

  getAllPlatforms(): Observable<{ id: number, name: string }[]> {
    return this.getAccessToken().pipe(
      switchMap(token => {
        const body = `fields name; limit 500;`; // Ajusta el límite si necesitas más resultados
        return this.http.post<{ id: number, name: string }[]>(`${this.igdbEndpoint}/platforms`, body, {
          headers: new HttpHeaders({
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          })
        });
      }),
      tap(response => console.log("All Platforms result:", response))
    );
  }

  getAllGenres(): Observable<{ id: number, name: string }[]> {
    return this.getAccessToken().pipe(
      switchMap(token => {
        const body = `fields name; limit 500;`; // Ajusta el límite si es necesario
        return this.http.post<{ id: number, name: string }[]>(`${this.igdbEndpoint}/genres`, body, {
          headers: new HttpHeaders({
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          })
        });
      }),
      tap(response => console.log("All Genres result:", response))
    );
  }
}
