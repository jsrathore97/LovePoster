import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  LovePosterService,
  LovePoster
} from '../services/love-poster.service';

@Component({
  selector: 'app-love-poster',
  standalone: true,
  templateUrl: './love-poster.component.html',
  styleUrl: './love-poster.component.scss'
})
export class LovePosterComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private posterService = inject(LovePosterService);

  poster?: LovePoster;
  loading = true;
  error = false;

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.posterService.getPoster(id).subscribe({
      next: (poster: LovePoster) => {
        this.poster = poster;
        this.loading = false;
      },

      error: (error: unknown) => {
        console.error('Failed to load poster:', error);
        this.error = true;
        this.loading = false;  
      }
    });
  }
}