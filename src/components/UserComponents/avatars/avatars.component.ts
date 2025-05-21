import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import { Avatar } from '../../../Model/Interfaces/avatar.interface';
import { CommonModule } from '@angular/common';
import {avatars} from '../../../assets/user-icons/userAvatars';

@Component({
  selector: 'app-avatars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatars.component.html',
  styleUrl: './avatars.component.css'
})
export class AvatarsComponent implements OnInit{

  avatarUrls: Avatar[] = [];

    @Output() avatarSelected = new EventEmitter<Avatar>();


    ngOnInit(): void {
      this.obtainAvatar();
    }

    selectAvatar(avatar: Avatar) {
      this.avatarSelected.emit(avatar);
    }

    obtainAvatar() {
      this.avatarUrls = avatars;
      console.log(this.avatarUrls)
    }
}

