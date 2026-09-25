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

    this.route.paramMap.subscribe(params => {
  const id = params.get('id');

  if (id) {
    this.lovePosterService
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
});
  }
}