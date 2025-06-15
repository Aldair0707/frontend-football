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
  publicacionId: number = 0; // El ID de la publicación a la que se asociarán los comentarios

  constructor(
    private tweetService: TweetService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.publicacionId = params['id']; // Obtener el ID de la publicación desde la URL
      this.getComentarios(); // Llamar a la función para cargar los comentarios
    });
  }

  // Obtener comentarios de una publicación
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

  // Enviar un nuevo comentario
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
        this.getComentarios(); // Actualizamos la lista de comentarios
        this.comentarioTexto = ''; // Limpiamos el campo del comentario
      },
      error: (err) => {
        console.error('Error al enviar comentario', err);
      }
    });
  }
}
