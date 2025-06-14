import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { StorageService } from '../services/storage.service';
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  username: string = '';
  tweetText: string = '';
  tweets: Tweet[] = [];

  page: number = 0;
  size: number = 5;
  totalPages: number = 1;
  loading: boolean = false;

  private observer!: IntersectionObserver;
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

  constructor(
    private storageService: StorageService,
    private tweetService: TweetService,
    private router: Router
  ) {
    this.username = this.storageService.getSession('user');
    console.log(this.username);
    this.getTweets();
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.loading && this.page < this.totalPages) {
        this.getTweets();
      }
    });

    this.observer.observe(this.scrollAnchor.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private getTweets(): void {
    if (this.page >= this.totalPages) return;

    this.loading = true;
    this.tweetService.getTweets(this.page, this.size).subscribe({
    next: (res) => {
    // Ordenar los tweets por fecha de creación en orden descendente
    this.tweets = [...this.tweets, ...res.content].sort((a, b) => {
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
    });
    this.totalPages = res.totalPages;
    this.page++;
    this.loading = false;
  },
  error: (err) => {
    console.error('Error al obtener tweets:', err);
    this.loading = false;
  }
});
  }

  public addTweet(): void {
    if (this.tweetText.trim()) {
      this.tweetService.postTweet(this.tweetText).subscribe({
        next: (tweet) => {
          this.tweetText = '';  // Limpiar el campo de texto
          this.tweets = [];     // Limpiar los tweets actuales
          this.page = 0;        // Reiniciar la página para recargar desde el principio
          this.totalPages = 1;  // Reiniciar la cantidad total de páginas
          this.getTweets();     // Recargar los tweets
        },
        error: (err) => {
          console.error('Error al crear tweet:', err);
        }
      });
    }
  }

  cerrarSesion(): void {
    this.storageService.clearSession();
    this.router.navigate(['/login']);
  }
}
