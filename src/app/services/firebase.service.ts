import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  Database
} from 'firebase/database';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private readonly app = initializeApp(environment.firebase);

  readonly database: Database = getDatabase(this.app);
}