import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { IgdbService } from './igdb-service.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private igdbService: IgdbService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.igdbService.getAccessToken().pipe(
            switchMap(token => {
              const newReq = req.clone({
                setHeaders: { 'Authorization': `Bearer ${token}` }
              });
              return next.handle(newReq);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
