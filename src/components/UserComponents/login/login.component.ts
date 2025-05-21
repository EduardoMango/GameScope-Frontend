import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/AuthService';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UsersService} from '../../../services/Users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private userService: UsersService) {
    // Inicializar el formulario reactivo
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // Validación para el correo electrónico
      password: ['', [Validators.required]] // Validación para la contraseña
    });
  }

  ngOnInit(): void {}

  onSubmit() {

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        alert("Successful login");
        this.router.navigate(['home']);
      },
      error: (error) => {
        if (error.status != 401) {
          alert(error.error?.error);
          } else {
          if (error.error?.error === "User is disabled") {
            if (confirm("Your account has been deactivated. Do you wish to reactivate it?")) {
              this.userService.reactivateUser(username).subscribe({
                next: () => {
                  alert("Your account has been reactivated. Please log in again.");
                  this.router.navigate(['/login']);
                },
                error: (error) => {
                  console.error("Error reactivating user:", error.message);
                },
              });
            }
          } else {
            alert(error.error?.error);
          }
        }
      }
    });


  }
}

