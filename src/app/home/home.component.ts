import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { Router } from '@angular/router';
import { Comentario } from '../models/comentarios/Comentario';
import { Reaccion } from '../models/reacciones/Reaccion';
import { ReactionService } from '../services/reaction.service';
import { EReaction } from '../models/reacciones/Reaccion';
type ReactionType = 'LIKE' | 'LOVE' | 'SAD' | 'ANGRY' | 'GOAT';


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
  reactionsVisibility: { [key: number]: boolean } = {}; // Controla si las reacciones están visibles o no
  selectedReactions: { [key: number]: string } = {};



  page: number = 0;
  size: number = 5;
  totalPages: number = 1;
  loading: boolean = false;
 currentUser: string = '';

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

  isAdmin(): boolean {
     return this.storageService.getSession('role') === 'ADMIN'; // Esto depende de cómo manejes los roles en tu app
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
        this.comments[tweetId] = comments; // Almacenamos comentarios por tweet
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
          this.reactions[tweetId] = { LIKE: 5, LOVE: 5, SAD: 5, ANGRY: 5, GOAT: 5 };
        }
        this.reactions[tweetId] = reactions || { LIKE: 5, LOVE: 5, SAD: 5, ANGRY: 5, GOAT: 5 };
      },
      error: (err) => {
        console.error('Error al obtener reacciones:', err);
      }
    });
  }
  

  toggleComments(tweetId: number): void {
    this.commentsVisibility[tweetId] = !this.commentsVisibility[tweetId];
  }
  toggleReactions(tweetId: number): void {
    this.reactionsVisibility[tweetId] = !this.reactionsVisibility[tweetId];
  }


   addComment(tweetId: number): void {
    if (this.commentText[tweetId]?.trim()) {
      const commentData = {
        texto: this.commentText[tweetId],
        publicacionId: tweetId
      };

      this.tweetService.addComment(commentData).subscribe({
        next: (comment) => {
          this.commentText[tweetId] = ''; // Limpiamos el campo de texto del comentario
          this.getCommentsByTweetId(tweetId); // Recargamos los comentarios del tweet
        },
        error: (err) => {
          console.error('Error al agregar comentario:', err);
        },
      });
    }
  }

  addReaction(tweetId: number, reactionType: string): void {
  const current = this.selectedReactions[tweetId];

  // Si no está seleccionada, la agregamos
  if (current !== reactionType) {
    const reactionData = { publicacionId: tweetId, tipo: reactionType };

    this.reactionService.addReaction(reactionData, reactionType).subscribe({
      next: () => {
        this.selectedReactions[tweetId] = reactionType;  // Guardamos la reacción seleccionada
        this.updateReactionsForTweet(tweetId);  // Actualizamos las reacciones del tweet
      },
      error: (err) => console.error('Error al agregar reacción:', err)
    });
  }
}



private updateReactionsForTweet(tweetId: number): void {
  this.reactionService.countReactionsByType(tweetId).subscribe({
    next: (reactions) => {
      this.reactions[tweetId] = reactions || { LIKE: 0, LOVE: 0, SAD: 0, ANGRY: 0, GOAT: 0 };
    },
    error: (err) => {
      console.error('Error al obtener las reacciones actualizadas:', err);
    }
  });
}

  public addTweet(): void {
    if (this.tweetText.trim().length <= 400) {   
    if (this.tweetText.trim()) {
      this.tweetService.postTweet(this.tweetText).subscribe({
        next: (tweet) => {
          this.tweetText = ''; // limpia el campo de texto después de publicar
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
  } else {
    alert('El tweet no puede superar los 400 caracteres');
  }
  }

 showReactionsCount(tweetId: number): void {
   if (!this.reactions[tweetId]) {
    this.reactions[tweetId] = { LIKE: 0, LOVE: 0, SAD: 0, ANGRY: 0, GOAT: 0 }; // Inicializamos si no hay reacciones aún
  }

 }



  deleteTweet(tweetId: number): void {
  const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta publicación?');

   
  if (confirmDelete) {
    this.tweetService.deleteTweet(tweetId).subscribe({
      next: () => {
        
        this.tweets = this.tweets.filter(tweet => tweet.id !== tweetId);
      },
      error: (err) => {
        console.error('Error al eliminar el tweet:', err);
      }
    });
  }
}


    isTweetOwner(tweetId: number): boolean {
   const tweet = this.tweets.find(t => t.id === tweetId);
  return tweet ? tweet.username === this.username : false;
}


  cerrarSesion(): void {
    this.storageService.clearSession();
    this.router.navigate(['/login']);
  }
}
