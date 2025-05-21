import { Routes } from '@angular/router';
import {LoginComponent} from '../components/UserComponents/login/login.component';
import {FormRegisterComponent} from '../components/UserComponents/form-register/form-register.component';
import {MainComponent} from '../components/gameComponents/main/main.component';
import {ViewUsersComponent} from '../components/UserComponents/view-users/view-users.component';
import {InfoUserComponent} from '../components/UserComponents/info-user/info-user.component';
import {VideogamePageComponent} from '../Pages/videogame-page/videogame-page.component';
import {UserLibraryPageComponent} from '../Pages/user-library-page/user-library-page.component';
import {FullVideogamePageComponent} from '../Pages/full-videogame-page/full-videogame-page.component';
import {ReviewComponent} from '../components/gameComponents/review/review.component';
import {RecommendedComponent} from '../components/gameComponents/recommended/recommended.component';
import {SearchPageComponent} from '../Pages/search-page/search-page.component';
import { ListReviewComponent } from '../components/list-review/list-review.component';
import { ReviewCompletaComponent } from '../components/gameComponents/review-completa/review-completa.component';
import {UpdateUserComponent} from '../components/UserComponents/update-user/update-user.component';
import {ReviewListComponent} from '../components/gameComponents/review-list/review-list.component';
import {TopGamesComponent} from '../components/gameComponents/top-games/top-games.component';
import {
  VideogameoftheweekComponent
} from '../components/gameComponents/videogameoftheweek/videogameoftheweek.component';

export const routes: Routes = [

  {
    path: 'home',
    component: MainComponent
  },
  { path: 'userProfile/:userId/update',
    component: UpdateUserComponent
  },
  { path: 'userProfile/:userId',
    component: InfoUserComponent
  },
  {
    path: 'userProfile',
    component: InfoUserComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: FormRegisterComponent
  },
  {
    path: 'findUsers',
    component: ViewUsersComponent
  },
  {
    path: 'videogames/gotw',
    component: VideogameoftheweekComponent
  },
  {
    path: 'videogames/:videogameId/reviews',
    component: ReviewListComponent
  },
  {
    path: 'videogames/:videogameId/reviews/new',
    component: ReviewComponent
  },
  {
    path: 'videogames/:videogameId/reviews/:reviewId',
    component: ReviewCompletaComponent
  },
  {
    path: 'videogames',
    component: VideogamePageComponent
  },
  {
    path: 'videogames/:videogameId',
    component: FullVideogamePageComponent
  },
  {
    path: 'videogames/top/:period',
    component: TopGamesComponent
  },
    {
    path: 'addVideogame',
    component: SearchPageComponent
  },
  {
    path: 'user/library',
    component: UserLibraryPageComponent
  },
  {
    path: 'recommended',
    component: RecommendedComponent
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
