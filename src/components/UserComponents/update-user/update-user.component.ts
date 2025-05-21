import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {UsersService} from '../../../services/Users.service';
import {NewUser, User} from '../../../Model/Interfaces/User';
import {AuthService} from '../../../services/AuthService';
@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);

  id: string | null = null;
  form = this.fb.group({
    id: [{ value: '', disabled: true }], // Deshabilitado ya que es autogenerado
    username: ['', [],],
    email: ['', [Validators.email]],
    password: ['', []],
  });

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.id = param.get('userId');
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }

  updateUser() {
    if (this.form.invalid) return;

    let updated:boolean = false;
    const formValues = this.form.getRawValue();


    if (formValues.username || formValues.password || formValues.email) {

      let updatedUser: any;
      if (formValues.username) {
        updatedUser = { username: formValues.username };
      }

      if (formValues.password) {
        updatedUser = { ...updatedUser, password: formValues.password };
      }

      if (formValues.email) {
        updatedUser = { ...updatedUser, email: formValues.email };
      }

      this.usersService.updateUser(this.id!,updatedUser).subscribe({
        next: () => {
          alert("Information updated successfully. Please log in again");
          this.authService.logout();
          this.router.navigate(['home']);
        },
        error: (e: Error) => {
          console.log(e.message);
        }
      });
    }

  }
}
