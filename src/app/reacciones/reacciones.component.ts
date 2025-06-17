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
  tweetId: number = 0;   
  reactions: any[] = [];   
  reactionText: string = '';  
  loading: boolean = false;

  constructor(
    private reactionService: ReactionService,  
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.tweetId = params['id'];   
      this.getReactions();   
    });
  }

 
  getReactions() {
    this.reactionService.getReactionsByPostId(this.tweetId).subscribe({
      next: (res) => {
        this.reactions = res;   
      },
      error: (err) => {
        console.error("Error al obtener reacciones", err);
      }
    });
  }

  addReaction(reactionType: string) {
    const token = this.storageService.getSession('token');

    if (!token) {
      alert('Por favor inicie sesión para reaccionar.');
      return;
    }

    const reactionData = {
      publicacionId: this.tweetId,
      tipo: reactionType  
    };

    this.reactionService.addReaction(reactionData).subscribe({
      next: (res) => {
        this.getReactions();  
        this.reactionText = '';   
      },
      error: (err) => {
        console.error('Error al agregar reacción:', err);
      }
    });
  }
}
