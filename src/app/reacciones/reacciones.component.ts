import { Component, OnInit } from '@angular/core';
import { ReactionService } from '../services/reaction.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-reacciones',
  templateUrl: './reacciones.component.html',
  styleUrls: ['./reacciones.component.css']
})
export class ReaccionesComponent implements OnInit {
  tweetId: number = 0;  // El ID de la publicación/tweet
  reactions: any[] = [];  // Arreglo para almacenar las reacciones
  reactionText: string = '';  // Variable para almacenar la reacción actual
  loading: boolean = false;

  constructor(
    private reactionService: ReactionService, // Servicio que maneja las reacciones
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.tweetId = params['id'];  // Obtener el ID de la publicación desde la URL
      this.getReactions();  // Cargar las reacciones cuando se inicie el componente
    });
  }

  // Obtener reacciones para la publicación actual
  getReactions() {
    this.reactionService.getReactionsByPostId(this.tweetId).subscribe({
      next: (res) => {
        this.reactions = res;  // Asignamos las reacciones obtenidas
      },
      error: (err) => {
        console.error("Error al obtener reacciones", err);
      }
    });
  }

  // Agregar una nueva reacción
  addReaction(reactionType: string) {
    const token = this.storageService.getSession('token');

    if (!token) {
      alert('Por favor inicie sesión para reaccionar.');
      return;
    }

    const reactionData = {
      publicacionId: this.tweetId,
      tipo: reactionType // Enviar el tipo de reacción al backend
    };

    this.reactionService.addReaction(reactionData).subscribe({
      next: (res) => {
        this.getReactions();  // Actualizar la lista de reacciones después de agregar una nueva
        this.reactionText = '';  // Limpiar el campo de texto
      },
      error: (err) => {
        console.error('Error al agregar reacción:', err);
      }
    });
  }
}
