import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { StorageService } from "../services/storage.service";
import { Reaccion } from '../models/reacciones/Reaccion';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  private apiURL = 'https://soccerhub-spring.onrender.com/api/reacciones/';
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

 
  addReaction(reactionData: any, reactionType?: string): Observable<Reaccion> {
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


   countReactionsByType(postId: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}contador/${postId}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
}

  
  deleteReaction(tweetId: number, reactionType: string): Observable<any> {
  const url = `${this.apiURL}eliminar`;
  const params = new HttpParams()
    .set('publicacionId', tweetId.toString())
    .set('tipo', reactionType);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.storageService.getSession('token') // Asegúrate de que el token esté siendo pasado correctamente
  });

  return this.http.delete(url, { params, headers })
    .pipe(
      catchError(err => {
        console.error('Error al eliminar reacción:', err);
        return throwError(err);
      })
    );
}


  // Manejo de errores
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
       errorMessage = error.error.message;
    } else {
       errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
