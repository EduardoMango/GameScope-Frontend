import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../Model/Interfaces/Notification';
import { UsersService } from '../../../services/Users.service';
import { UserDTO } from '../../../Model/Interfaces/User';
import { AuthService } from '../../../services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-modal.component.html',
  styleUrl: './notification-modal.component.css'
})
export class NotificationModalComponent implements OnInit {
  notifications: Notification[] = [];
  user: UserDTO | null = null;
  isModalOpen = false;

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  loadNotifications(): void {
    if (this.user) {
      this.userService.getNotifications(this.user.id).subscribe({
        next: (response) => {
          this.notifications = response._embedded.notificationDTOList;
        },
        error: (error) => {
          console.error('Error loading notifications', error);
        }
      });
    }
  }

  openModal(): void {
    this.loadNotifications();
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  markAsRead(notification: Notification): void {
    if (this.user) {
      this.userService.markNotificationAsRead(notification.id).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
        },
        error: (error) => {
          console.error('Error marking notification as read', error);
        }
      });
    }
  }

  navigateToUrl(notification: Notification): void {
    if (notification.url) {
      this.router.navigate([notification.url]);
      this.isModalOpen = false;
    }
  }
}
