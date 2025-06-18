import { Component, ViewEncapsulation } from '@angular/core';
import { TweetService } from '../../services/tweet.service';
import { ReactionService } from '../../services/reaction.service';
import { CommentService } from '../../services/comment.service';
import { StorageService } from '../../services/storage.service';
import { Tweet } from '../../models/tweets/Tweet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  username: string = '';
  tweets: Tweet[] = [];
  reactionCounts: { [tweetId: number]: { [reaction: string]: number } } = {};
  activeTweetId: number | null = null;
  editModalVisible = false;
  editedTweetId: number | null = null;
  editedText: string = '';
  //editedImage: File | null = null;  // Comentado ya que no usaremos imagen
  removeImage: boolean = false;

  constructor(
    private router: Router,
    private tweetService: TweetService,
    private reactionService: ReactionService,
    private commentService: CommentService,
    private storageService: StorageService
  ) {
    this.username = this.storageService.getUser() || '';
    this.getTweets();
  }


  ngOnInit(): void {
    const user = this.storageService.getUser();  // Verifica si el usuario está logueado
    if (!user) {
      // Si no hay un usuario, redirige a la página de login
      this.router.navigate(['']);
    } else {
      this.username = user;
      this.getTweets();
    }
  }

  //  Obtener todos los tweets
  getTweets() {
    this.tweetService.getTweets().subscribe({
      next: data => {
        this.tweets = data.map(tweet => {
          // Corregir la URL de la imagen si no es completa
          //if (tweet.imageUrl && !tweet.imageUrl.startsWith('http')) {
          //  tweet.imageUrl = `https://moviebook-backend-5cw6.onrender.com${tweet.imageUrl}`;
          //}
          return tweet;
        });

        // Cargar las reacciones de cada tweet
        for (let tweet of this.tweets) {
          this.loadReactions(tweet.id);
        }
      },
      error: err => console.error(err)
    });
  }

  // Cargar reacciones por tweet
  loadReactions(tweetId: number) {
    this.reactionService.getReactionCount(tweetId).subscribe({
      next: data => {
        this.reactionCounts[tweetId] = data;
      }
    });
  }

  //  Agregar comentario
  addComment(event: { tweetId: number, content: string }) {
    this.commentService.createComment(event.tweetId, event.content).subscribe(() => {
      this.getTweets();  // Refrescar los tweets después de agregar un comentario
    });
  }

  //  Cerrar sesión
  logout() {
    this.storageService.signOut();
    this.router.navigate(['']);
  }

  //  Mostrar opciones del tweet
  toggleTweetOptions(tweetId: number) {
    this.activeTweetId = this.activeTweetId === tweetId ? null : tweetId;
  }

  //  Eliminar tweet
  onDeleteTweet(tweetId: number) {
    if (confirm('¿ESTÁS SEGURO QUE DESEAS ELIMINAR ESTE TWEET?')) {
      this.tweetService.deleteTweet(tweetId).subscribe({
        next: () => {
          this.tweets = this.tweets.filter(t => t.id !== tweetId);
        },
        error: err => console.error('ERROR AL ELIMINAR TWEET:', err)
      });
    }
  }

  //  Editar tweet
  onEditTweet(tweet: Tweet): void {
    this.editedTweetId = tweet.id;
    this.editedText = tweet.tweet;
    //this.editedImage = null;  // Comentado ya que no usaremos imagen
    this.editModalVisible = true;

    // Cerrar el menú de opciones
    this.activeTweetId = null;
  }

  //  Seleccionar imagen para editar (comentado)
  // onEditImageSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file && file.type.startsWith('image/')) {
  //     this.editedImage = file;
  //   }
  // }

  //  Cancelar edición
  cancelEdit(): void {
    this.editModalVisible = false;
    this.editedTweetId = null;
    this.editedText = '';
    //this.editedImage = null;  // Comentado ya que no usaremos imagen
  }

  //  Confirmar edición de tweet
  confirmEditTweet(): void {
    if (this.editedTweetId === null) return;

    const formData = new FormData();
    formData.append('tweet', this.editedText);

    // Comentado ya que no usaremos imagen
    // if (this.editedImage) {
    //   formData.append('image', this.editedImage);
    // }

    formData.append('removeImage', this.removeImage.toString());

    this.tweetService.updateTweet(this.editedTweetId, formData).subscribe({
      next: () => {
        this.getTweets();       
        this.cancelEdit();
      },
      error: (err: any) => {
        console.error('ERROR AL ACTUALIZAR TWEET:', err);
      }
    });
  }

  //  Cambiar opción de eliminar imagen (comentado)
  // onRemoveImageChange(): void {
  //   if (this.removeImage) {
  //     this.editedImage = null;
  //   }
  // }

  //  Alternar eliminar imagen (comentado)
  // toggleRemoveImage(): void {
  //   this.removeImage = !this.removeImage;
  //   if (this.removeImage) {
  //     this.editedImage = null;
  //   }
  // }

  //  Refrescar lista de tweets
  prependTweet(tweet: Tweet): void {
    this.getTweets();
  }
}
