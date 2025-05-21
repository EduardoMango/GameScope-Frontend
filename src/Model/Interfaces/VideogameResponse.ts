import {Videogame} from './videogame';

export interface VideogameResponse {
  _embedded: {
    videogameDTOList: Videogame[];
  };
  _links: {
    self: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
