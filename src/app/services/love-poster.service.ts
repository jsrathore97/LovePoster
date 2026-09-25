import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LovePoster {

  id?: string;

  name: string;

  image: string;

  message: string;

}


@Injectable({
  providedIn: 'root'
})
export class LovePosterService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:3000/posters';


  createPoster(
    poster: LovePoster
  ): Observable<LovePoster> {

    return this.http.post<LovePoster>(
      this.apiUrl,
      poster
    );

  }


  getPoster(
    id: string
  ): Observable<LovePoster> {

    return this.http.get<LovePoster>(
      `${this.apiUrl}/${id}`
    );

  }

}