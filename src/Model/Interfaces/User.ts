import {userTitle} from '../enums/user-titles';
import {Achievement} from './Achievement';
import {Review} from './Review';
import {Videogame} from './videogame';

export interface User {
  id: string;
  isAdmin: boolean;
  isActive: boolean;
  isBanned: boolean;
  username: string;
  followers: number;
  following: string[];
  karma: number;
  email: string;
  password: string;
  currentTitle: userTitle;
  titles: userTitle[];
  avatarUrl: string;
  achievements: Achievement[];
  reviews: Review[];
  notificaciones: string[];
  library: Videogame[];
  uninterestedGamesID: string[];
}

export interface UserResponse {
  _embedded: {
    userDTOList: UserDTO[];
  };
  _links: {
    self: {
      href: string;
    };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  isBanned: boolean;
  followerCount: number;
  followingCount: number;
  reviewCount: number;
  karma: number;
  avatarUrl: string;
  notifications: any[]; // Puedes cambiar `any` si tienes una estructura específica para notificaciones
  currentTitle: userTitle;
}

export interface NewUser {
  username: string | null;
  email: string | null;
  password: string | null;
}
