import {AfterViewInit, Component, HostListener, ViewChild} from '@angular/core';
import {AuthService} from '../../services/AuthService';
import {Router, RouterModule} from '@angular/router';
import {User, UserDTO} from '../../Model/Interfaces/User';
import {
  NotificationModalComponent
} from '../../components/UserComponents/notification-modal/notification-modal.component';
declare var bootstrap: any;

@Component({
  selector: 'app-sidebar-usuario',
  standalone: true,
  imports: [RouterModule, NotificationModalComponent],
  templateUrl: './sidebar-usuario.component.html',
  styleUrl: './sidebar-usuario.component.css'
})
export class SidebarUsuarioComponent implements AfterViewInit{
  sidebarVisible = false; // Controla la visibilidad
  user: UserDTO | null = null;

  constructor(public authService: AuthService,
              private router: Router) {
    this.user = this.authService.getCurrentUser();

  }

  @ViewChild(NotificationModalComponent) notificationModal!: NotificationModalComponent;

  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    console.log(this.user);
  }


  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const mouseX = event.clientX;

    // Mostrar el sidebar si el mouse está en los primeros 30px de la pantalla
    if (mouseX < 30) {
      this.sidebarVisible = true;
    } else if (mouseX > 80) { // Ocultar el sidebar si el mouse se aleja
      this.sidebarVisible = false;
    }
  }

  openNotificationsModal() {
    if(this.authService.isSessionActive()){
      this.notificationModal.openModal();
    } else {
      alert("You must be logged in to view notifications.");
    }
  }

  goToProfile() {
    if(this.authService.isSessionActive()){
      this.router.navigate(['/userProfile']);
    } else {
      alert("You must be logged in to view your profile.");
    }

  }

  goToLibrary() {

    if(this.authService.isSessionActive()){
      this.router.navigate(['/user/library']);
    } else {
      alert("You must be logged in to view your library.");
    }

  }

  goToRecommended(){
    if(this.authService.isSessionActive()){
      this.router.navigate(['/recommended']);
    } else {
      alert("You must be logged in to view your recommended.");
    }
  }

  goToFriends(){
    if(this.authService.isSessionActive()){
      this.router.navigate(['/findUsers']);
    } else {
      alert("You must be logged in to view your friendlist.");
    }
  }
}
