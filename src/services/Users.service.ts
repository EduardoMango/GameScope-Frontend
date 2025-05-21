import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {NewUser, User, UserDTO, UserResponse} from '../Model/Interfaces/User';
import {userTitle} from '../Model/enums/user-titles';
import {environment} from '../environments/environment.development';
import {AuthService} from './AuthService';
import {VideogameResponse} from '../Model/Interfaces/VideogameResponse';
import {Videogame} from '../Model/Interfaces/videogame';
import {NotificationResponse} from '../Model/Interfaces/Notification';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersEndpoint = environment.usersEndpoint;
  private notificationsEndpoint = environment.notificationsEndpoint;



  private pageInfoSubject = new BehaviorSubject<any>({});
  private videogamesSubject: BehaviorSubject<Videogame[]> = new BehaviorSubject<Videogame[]>([]);


  pageInfo$ = this.pageInfoSubject.asObservable();
  videogames$ = this.videogamesSubject.asObservable();

  constructor(private http: HttpClient,
              private authService: AuthService) { }



  findUserById(id: string | any): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.usersEndpoint}/${id}`);
  }

  getByUsername(username: string | null,
                page: number = 0,
                size: number = 10,
                excluded: string | null): Observable<UserResponse>{
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    // Agregar parámetros de consulta solo si no son nulos
    if (username) {
      params = params.set('username', username);
    }
    if(excluded){
      params = params.set('excluded', excluded);
    }

    return this.http.get<UserResponse>(this.usersEndpoint, { params });
  }



  registerUser(user: NewUser): Observable<User>{
    return this.http.post<User>(this.usersEndpoint, user);
  }

  getLibrary(idUser: string | number, page: number = 0, size: number = 10): void {
    let params = new HttpParams();

    params = params.set('page', page.toString());
    params = params.set('size', size.toString());
    this.http.get<VideogameResponse>(`${this.usersEndpoint}/${idUser}/games`, {params}).pipe(
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

  addVideogameToLibrary(idUser: string | number, idVideogame: string){
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.post<User>(`${this.usersEndpoint}/${idUser}/games/${idVideogame}`,{},{headers});
  }

  removeVideogameFromLibrary(idUser: string | number, idVideogame: string){
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.delete<void>(`${this.usersEndpoint}/${idUser}/games/${idVideogame}`,{headers});
  }


  updateUser(id: string | number, user: any): Observable<User> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    console.log(user)
    return this.http.patch<User>(`${this.usersEndpoint}/${id}`, user,{headers});
  }

  banUser(id: string | number): Observable<void>{
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.delete<void>(`${this.usersEndpoint}/${id}/ban`,{headers});
  }

  unbanUser(id: string | number): Observable<void>{
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    console.log(id);
    return this.http.post<void>(`${this.usersEndpoint}/${id}/unban`,{},{headers});
  }

  deactivateUser(id: string | number): Observable<void> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.delete<void>(`${this.usersEndpoint}/${id}`,{headers});
  }

  reactivateUser(username: string): Observable<void> {
    let params = new HttpParams().set('username', username);

    // Usa el operador `switchMap` para encadenar observables
    return this.http.get<UserResponse>(this.usersEndpoint, { params }).pipe(
      map(response => {
        const user = response._embedded.userDTOList[0];
        if (!user) {
          throw new Error("User not found");
        }
        return user.id;
      }),
      switchMap(userId =>
        this.http.post<void>(`${this.usersEndpoint}/${userId}/reactivate`, {})
      )
    );
  }

  followUnfollowUser(followId: number, toFollowId: number): Observable<boolean> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.post<boolean>(`${this.usersEndpoint}/${followId}/follow/${toFollowId}`, {} ,{headers});
  }

  isFollowingUser(followId: number, toFollowId: number): Observable<boolean> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.get<boolean>(`${this.usersEndpoint}/${followId}/follow/${toFollowId}` ,{headers});
  }


  updateTitleAvatar(id: number , currentTitle: userTitle | null , avatarUrl: string | null): Observable<User> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    let body: any = {}; // Inicia el objeto vacío

    if (currentTitle) {
      body.currentTitle = currentTitle.toUpperCase();
    }

    if (avatarUrl) {
      body.avatarUrl = avatarUrl;
    }
    return this.http.patch<User>(`${this.usersEndpoint}/${id}/customization`, body, {headers});
  }

  getRecommended(id:number): Observable<Videogame[]> {
    return this.http.get<Videogame[]>(`${this.usersEndpoint}/${id}/recommended`);
  }

  markGameAsUninterested(idUser: number, idGame: string): Observable<void> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.post<void>(`${this.usersEndpoint}/${idUser}/uninterested/${idGame}`,{},{headers});
  }

  getNotifications(idUser: number): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.usersEndpoint}/${idUser}/notifications`);
  }


  markNotificationAsRead(idNotification: number): Observable<void> {
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.delete<void>(`${this.notificationsEndpoint}/${idNotification}/read`,{headers});
  }

  getFollowedUsers(idUser: number,page: number = 0, size: number = 10): Observable<UserResponse> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    return this.http.get<UserResponse>(`${this.usersEndpoint}/${idUser}/followed`,{params});
  }

}
