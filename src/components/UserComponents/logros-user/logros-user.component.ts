import {Component, Input, OnInit} from '@angular/core';
import {Achievement} from '../../../Model/Interfaces/Achievement';
import {NgOptimizedImage} from '@angular/common';
import {RatingModule} from 'primeng/rating';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-logros-user',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RatingModule,
    FormsModule
  ],
  templateUrl: './logros-user.component.html',
  styleUrl: './logros-user.component.css'
})
export class LogrosUserComponent implements OnInit{

  value: number = 1;

  @Input() achievements: Achievement[] = [];


  ngOnInit(): void {
    console.log(this.achievements)
  }

}
