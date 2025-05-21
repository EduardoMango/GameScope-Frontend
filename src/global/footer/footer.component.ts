import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  text1: string = 'About us';
  text2: string = 'Contact us';
  text3: string =  'Help';
  logoUrl: string = "https://i.imgur.com/gDo9QBt.png";

}
