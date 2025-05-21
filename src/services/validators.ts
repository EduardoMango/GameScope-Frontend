// username.validator.ts
// import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
// import { debounceTime, map, catchError } from 'rxjs/operators';
// import {Observable, of} from 'rxjs';
// import {UsersService} from './Users.service';
//
// export function usernameUniqueValidator(userService: UsersService): AsyncValidatorFn {
//   return (control: AbstractControl): Observable<ValidationErrors | null> => {
//     if (!control.value) return of(null);  // No hacer nada si el valor es vacío
//
//     return userService.isUsernameTaken(control.value).pipe(
//       debounceTime(300), // Espera 300ms para reducir llamadas al servidor
//       map(isTaken => (isTaken ? { usernameTaken: true } : null)),
//       catchError(() => of(null)) // Si hay un error, no retorna error de validación
//     );
//   };
// }
//
// export function emailUniqueValidator(userService: UsersService): AsyncValidatorFn {
//   return (control: AbstractControl): Observable<ValidationErrors | null> => {
//     if (!control.value) return of(null);  // No hacer nada si el valor es vacío
//
//     return userService.isEmailTaken(control.value).pipe(
//       debounceTime(300), // Reduce llamadas al servidor
//       map(isTaken => (isTaken ? { emailTaken: true } : null)),
//       catchError(() => of(null)) // Si hay error, no retorna error de validación
//     );
//   };
// }


//DEPRECATED AND MOVED TO BACKEND
