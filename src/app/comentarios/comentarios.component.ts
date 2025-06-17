import { Component, OnInit } from '@angular/core';
import { Comentario } from '../models/comentarios/Comentario';
import { TweetService } from '../services/tweet.service'; // Asumí que TweetService es donde tienes el servicio de comentarios.
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  comentarios: Comentario[] = [];
  comentarioTexto: string = '';
  publicacionId: number = 0; 

  constructor(
    private tweetService: TweetService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.publicacionId = params['id'];  
      this.getComentarios();  
    });
  }


  getComentarios() {
    this.tweetService.getCommentsByTweetId(this.publicacionId).subscribe({
      next: (res) => {
        this.comentarios = res;
      },
      error: (err) => {
        console.error("Error al obtener comentarios", err);
      }
    });
  }

   
  enviarComentario() {
    const token = this.storageService.getSession("token");

    if (!this.comentarioTexto.trim()) {
      alert('Por favor ingresa un comentario.');
      return;
    }

    const comentario = {
      publicacionId: this.publicacionId,
      texto: this.comentarioTexto
    };

    this.tweetService.addComment(comentario).subscribe({
      next: (res) => {
        this.getComentarios();  
        this.comentarioTexto = '';  
      },
      error: (err) => {
        console.error('Error al enviar comentario', err);
      }
    });
  }
}
