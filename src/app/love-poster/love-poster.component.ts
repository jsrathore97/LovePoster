import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';
import { LovePosterService } from '../services/love-poster.service';


@Component({
  selector: 'app-love-poster',
  standalone: true,
  templateUrl: './love-poster.component.html',
  styleUrl: './love-poster.component.scss'
})
export class LovePosterComponent implements OnInit {

  private route = inject(ActivatedRoute);

  private posterService =
    inject(LovePosterService);

  poster: any = null;

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.posterService
      .getPoster(id)
      .subscribe({
        next: poster => {
          this.poster = poster;
        },
        error: error => {
          console.error(error);
        }
      });
  }
}