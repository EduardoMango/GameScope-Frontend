import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../global/navbar/navbar.component';
import { SidebarUsuarioComponent } from '../global/sidebar-usuario/sidebar-usuario.component';
import { FooterComponent } from '../global/footer/footer.component';
import { LoginComponent } from '../components/UserComponents/login/login.component';
import {FormRegisterComponent} from '../components/UserComponents/form-register/form-register.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { ListReviewComponent } from '../components/list-review/list-review.component';
import { ReviewCompletaComponent } from '../components/gameComponents/review-completa/review-completa.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarUsuarioComponent,
    FooterComponent, LoginComponent, FormRegisterComponent,
    NgbModalModule,ListReviewComponent, ReviewCompletaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{

}
