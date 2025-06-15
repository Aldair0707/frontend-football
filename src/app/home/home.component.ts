import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { Router } from '@angular/router';
import { Comentario } from '../models/comentarios/Comentario';
import { EReaction, Reaccion } from '../models/reacciones/Reaccion';
import { ReactionService } from '../services/reaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  username: string = '';
  tweetText: string = '';
  commentText: { [key: number]: string } = {}; // Almacena comentarios por tweet id
  tweets: Tweet[] = [];
  comments: { [key: number]: Comentario[] } = {}; // Comentarios por tweet id
  reactions: { [key: number]: { LIKE: number; LOVE: number; SAD: number; ANGRY: number; GOAT: number } } = {};
  commentsVisibility: { [key: number]: boolean } = {}; // Controla si los comentarios están visibles o no


  page: number = 0;
  size: number = 5;
  totalPages: number = 1;
  loading: boolean = false;

  private observer!: IntersectionObserver;
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

  constructor(
    private storageService: StorageService,
    private tweetService: TweetService,
    private router: Router,
    private reactionService: ReactionService
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
        this.tweets = [...this.tweets, ...res.content].sort((a, b) => {
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });
        this.totalPages = res.totalPages;
        this.page++;
        this.loading = false;

        // Obtener los comentarios y reacciones de los tweets
        this.tweets.forEach((tweet) => {
          this.getCommentsByTweetId(tweet.id);
          this.getReactionsByTweetId(tweet.id);
        });
      },
      error: (err) => {
        console.error('Error al obtener tweets:', err);
        this.loading = false;
      }
    });
  }

  private getCommentsByTweetId(tweetId: number): void {
    this.tweetService.getCommentsByTweetId(tweetId).subscribe({
      next: (comments) => {
        this.comments[tweetId] = comments; // Almacenar comentarios por tweet
      },
      error: (err) => {
        console.error('Error al obtener comentarios:', err);
      }
    });
  }

  private getReactionsByTweetId(tweetId: number): void {
    this.reactionService.countReactionsByType(tweetId).subscribe({
      next: (reactions) => {
        if (!this.reactions[tweetId]) {
          this.reactions[tweetId] = { LIKE: 0, LOVE: 0, SAD: 0, ANGRY: 0, GOAT: 0 };
        }
        this.reactions[tweetId] = reactions || { LIKE: 0, LOVE: 0, SAD: 0, ANGRY: 0, GOAT: 0 };
      },
      error: (err) => {
        console.error('Error al obtener reacciones:', err);
      }
    });
}

  toggleComments(tweetId: number): void {
    this.commentsVisibility[tweetId] = !this.commentsVisibility[tweetId];
  }


  // Método para agregar un comentario
  addComment(tweetId: number): void {
    if (this.commentText[tweetId]?.trim()) {
      const commentData = {
        texto: this.commentText[tweetId],
        publicacionId: tweetId
      };

      this.tweetService.addComment(commentData).subscribe({
        next: (comment) => {
          this.commentText[tweetId] = ''; // Limpiar el campo de texto del comentario
          this.getCommentsByTweetId(tweetId); // Recargar los comentarios del tweet
        },
        error: (err) => {
          console.error('Error al agregar comentario:', err);
        },
      });
    }
  }

  public addTweet(): void {
    if (this.tweetText.trim()) {
      this.tweetService.postTweet(this.tweetText).subscribe({
        next: (tweet) => {
          this.tweetText = '';
          this.tweets = [];
          this.page = 0;
          this.totalPages = 1;
          this.getTweets();
        },
        error: (err) => {
          console.error('Error al crear tweet:', err);
        }
      });
    }
  }

  addReaction(tweetId: number, reactionType: string): void {
    const reactionData = {
      publicacionId: tweetId,
      tipo: reactionType  // 'LIKE', 'LOVE', etc.
    };

    this.reactionService.addReaction(reactionData).subscribe({
      next: (response) => {
        this.getReactionsByTweetId(tweetId);  // Recargar las reacciones después de agregar
      },
      error: (err) => {
        console.error('Error al agregar reacción:', err);
      }
    });
  }

  public getMostReactedEmoji(tweetId: number): string {
  const reactions = this.reactions[tweetId];
  
  if (!reactions) {
    return ''; // Si no hay reacciones, no mostramos nada
  }

  // Encontrar la reacción con más votos
  const maxReaction = Math.max(reactions.LIKE, reactions.LOVE, reactions.SAD, reactions.ANGRY, reactions.GOAT);

  if (maxReaction === reactions.LIKE) {
    return 'LIKE'; // Emoji para 'Like'
  } else if (maxReaction === reactions.LOVE) {
    return 'LOVE'; // Emoji para 'Love'
  } else if (maxReaction === reactions.SAD) {
    return 'SAD'; // Emoji para 'Sad'
  } else if (maxReaction === reactions.ANGRY) {
    return 'ANGRY'; // Emoji para 'Angry'
  } else if (maxReaction === reactions.GOAT) {
    return 'GOAT'; // Emoji para 'GOAT'
  }

  return ''; // Si no hay reacciones, no mostrar nada
}


  cerrarSesion(): void {
    this.storageService.clearSession();
    this.router.navigate(['/login']);
  }
}
