import {Component} from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { LoginComponent } from '../../components/UserComponents/login/login.component';
import { FormRegisterComponent } from '../../components/UserComponents/form-register/form-register.component';
import {Router, RouterLink} from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    FormRegisterComponent,
    LoginComponent,
    RouterLink,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  constructor(public authService: AuthService, private router: Router) {}

  openRegister(){
    this.router.navigate(['register']);
  }

  openLogin(){
    this.router.navigate(['login']);
  }
  // Método para cerrar sesión
  onLogout() {
    this.authService.logout();  // Establece la sesión como inactiva
    this.router.navigate(['/home']);
  }


}
