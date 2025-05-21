import {VideogameGenres} from '../enums/videogame-genres';
import {VideoGamePlatform} from '../enums/videogamePlatform';
import {Review} from './Review';

export interface Videogame {
  id: string;
  title: string;
  companies: string[];
  image: string;
  genres: VideogameGenres[];
  storyline: string;
  globalScore: number;
  releaseDate: string;
  platforms: VideoGamePlatform[];
  similarGames: string[];
  idVideo: string;
}
