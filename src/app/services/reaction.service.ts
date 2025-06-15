import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from "../services/storage.service";
import { Reaccion } from '../models/reacciones/Reaccion';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  private apiURL = 'http://localhost:8080/api/reacciones/';
  private token: string = '';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.token = this.storageService.getSession("token");
  }

  private getToken(): string | null {
    const token = this.storageService.getSession("token");
    if (!token) {
      console.error("Token JWT no encontrado");
      return null;
    }
    return token;
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    })
  };

  // Método para agregar una reacción
  addReaction(reactionData: any): Observable<Reaccion> {
    const token = this.getToken();
    if (!token) {
        return throwError(() => new Error("Token no encontrado"));
    }

    const httpOptions = {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        })
    };

    return this.http.post<Reaccion>(`${this.apiURL}crear`, reactionData, httpOptions)
        .pipe(
            catchError(this.handleError)
        );
}

  // Método para obtener las reacciones de una publicación
  getReactionsByPostId(tweetId: number): Observable<Reaccion[]> {
  const token = this.getToken();
  if (!token) {
    return throwError(() => new Error("Token no encontrado"));
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + token
    })
  };

  return this.http.get<Reaccion[]>(`${this.apiURL}/publicacion/${tweetId}`, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
}

  // Método para contar las reacciones por tipo para una publicación
  countReactionsByType(postId: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}contador/${postId}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
}

  // Método para eliminar una reacción
  deleteReaction(reactionId: number): Observable<any> {
    return this.http.delete(`${this.apiURL}${reactionId}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = error.error.message;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
