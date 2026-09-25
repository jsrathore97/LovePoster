import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';

import {
  ref,
  set,
  get,
  child
} from 'firebase/database';

import { FirebaseService } from './firebase.service';

export interface LovePoster {
  id?: string;
  name: string;
  image: string;
  message: string;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LovePosterService {

  private firebaseService = inject(FirebaseService);

  private database = this.firebaseService.database;

  createPoster(poster: LovePoster): Observable<LovePoster> {

    const posterId = poster.id;

    if (!posterId) {
      throw new Error('Poster ID is required');
    }

    const posterRef = ref(
      this.database,
      `posters/${posterId}`
    );

    const data: LovePoster = {
      id: posterId,
      name: poster.name,
      image: poster.image,
      message: poster.message,
      createdAt: Date.now()
    };

    return from(
      set(posterRef, data).then(() => data)
    );
  }

  getPoster(id: string): Observable<LovePoster> {

    const posterRef = ref(
      this.database,
      `posters/${id}`
    );

    return from(
      get(posterRef).then(snapshot => {

        if (!snapshot.exists()) {
          throw new Error('Love poster not found');
        }

        return snapshot.val() as LovePoster;
      })
    );
  }
}