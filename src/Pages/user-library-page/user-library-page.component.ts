import { Component } from '@angular/core';
import {UserLibraryBannerComponent} from '../../components/UserComponents/user-library-banner/user-library-banner.component';
import {UserLibraryComponent} from '../../components/UserComponents/user-library/user-library.component';

@Component({
  selector: 'app-user-library-page',
  standalone: true,
  imports: [
    UserLibraryBannerComponent,
    UserLibraryComponent
  ],
  templateUrl: './user-library-page.component.html',
  styleUrl: './user-library-page.component.css'
})
export class UserLibraryPageComponent {

}
