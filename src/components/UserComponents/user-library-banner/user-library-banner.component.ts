import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../services/AuthService';
import {User, UserDTO} from '../../../Model/Interfaces/User';
import {userTitle} from '../../../Model/enums/user-titles';
import { DropdownModule } from 'primeng/dropdown';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';


@Component({
  selector: 'app-user-library-banner',
  standalone: true,
  imports: [FormsModule, DropdownModule, CommonModule],
  templateUrl: './user-library-banner.component.html',
  styleUrl: './user-library-banner.component.css'
})
export class UserLibraryBannerComponent {


  user!: UserDTO | null;
  constructor(private authService: AuthService,
              private router: Router) {
    this.user = this.authService.getCurrentUser();
    }

  searchQuery: string = '';

  search() {
    // Lógica para realizar la búsqueda
  }

  goToProfile() {
    this.router.navigate(['/userProfile']);
  }
}
