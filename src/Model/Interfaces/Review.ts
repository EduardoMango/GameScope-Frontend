import {Videogame} from './videogame';
import {UserDTO} from './User';

export interface Review {
  id: string | number;
  videogame: string | number | Videogame;    // ID del videojuego reseñado
  user: string | number | UserDTO;       // ID del usuario que escribió la reseña
  title: string;          // Título de la reseña
  graphicsRating: number | any,   // Calificaciones del videojuego
  graphicsComment: string,
  gameplayRating: number| any,
  gameplayComment: string,
  priceQualityRating: number| any,
  priceQualityComment: string,
  averageRating: number | any;    // Calificación del videojuego
  reviewKarma: number;    // Karma de la reseña
  likedBy: UserDTO[];
  dislikedBy: UserDTO[];
  content: string;       // Contenido de la reseña
  date: Date;     // Fecha de creación de la reseña
  comentarios?: Comment[]; // Comentarios de otros usuarios (opcional)
}

export interface Comment {
  id?: number;             // Identificador único del comentario
  review: Review;       // ID de la reseña a la que pertenece el comentario
  author: UserDTO;      // ID del usuario que escribió el comentario
  content: string;      // Contenido del comentario
  date: Date;            // Fecha en la que se escribió el comentario
  likedBy: UserDTO[];
  dislikedBy: UserDTO[];
  commentKarma: number;
}

export interface ReviewResponse {
  _embedded: {
    reviewDTOList: Review[];
  };
  _links: {
    self: {
      href: string;
    };
  };
  page: PageInfo;
}

export interface CommentResponse {
  _embedded: {
    commentDTOList: Comment[];
  };
  _links: {
    self: {
      href: string;
    };
  };
  page: PageInfo;
}



export interface PageInfo {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
