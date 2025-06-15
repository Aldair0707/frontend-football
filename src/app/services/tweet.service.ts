import { Injectable } from '@angular/core';
import { Tweet } from '../models/tweets/Tweet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StorageService } from "../services/storage.service";
import { Comentario } from '../models/comentarios/Comentario';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  apiURL = 'http://localhost:8080/';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  // Función para obtener el token
  private getToken(): string | null {
    const token = this.storageService.getSession("token");
    if (!token) {
      console.error("Token JWT no encontrado");
      return null; // Si no hay token, retornamos null
    }
    return token;
  }

  // Obtener los comentarios para un tweet
  getCommentsByTweetId(tweetId: number): Observable<Comentario[]> {
    const token = this.getToken(); // Verificar que el token está presente
    if (!token) {
      return throwError(() => new Error("Token no encontrado")); // Si no hay token, retornamos un error
    }

    // Configuramos los headers con el token
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };

    return this.http.get<Comentario[]>(`${this.apiURL}api/comentarios/por-publicacion/${tweetId}`, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear un comentario
  addComment(commentData: any): Observable<Comentario> {
    const token = this.getToken(); // Verificar que el token está presente
    if (!token) {
      return throwError(() => new Error("Token no encontrado")); // Si no hay token, retornamos un error
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };

    return this.http.post<Comentario>(`${this.apiURL}api/comentarios/crear`, commentData, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener los tweets
  getTweets(page: number, size: number): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error("Token no encontrado"));
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };

    return this.http.get<any>(`${this.apiURL}api/publicaciones/all?page=${page}&size=${size}`, httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Crear un tweet
  postTweet(myTweet: string): Observable<Object> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error("Token JWT no encontrado"));
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    const body = { contenido: myTweet };

    return this.http.post(this.apiURL + 'api/publicaciones/crear', body, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  


  

  // Manejo de errores
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
