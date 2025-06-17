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

  apiURL = 'https://soccerhub-spring.onrender.com/';
  token = '';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.token = this.storageService.getSession('token');
    console.log(this.token);
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.token,
    }),
  };

  errorMessage = '';
  getHttpOptions() {
    const token = this.storageService.getSession('token'); // lee porque si no se me traba por alguna razon
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
  }

   private getToken(): string | null {
    const token = this.storageService.getSession("token");
    if (!token) {
      console.error("Token JWT no encontrado");
      return null;  
    }
    return token;
  }

   getCommentsByTweetId(tweetId: number): Observable<Comentario[]> {
    const token = this.getToken();  
    if (!token) {
      return throwError(() => new Error("Token no encontrado"));  
    }

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

   addComment(commentData: any): Observable<Comentario> {
    const token = this.getToken();  
    if (!token) {
      return throwError(() => new Error("Token no encontrado"));  
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

  
  addReaction(reactionData: any): Observable<any> {
    const token = this.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(`${this.apiURL}api/reacciones/crear`, reactionData, httpOptions)
      .pipe(catchError(this.handleError));
  }


  
  deleteTweet(id: number): Observable<any> {
  return this.http.delete(
    `${this.apiURL}api/publicaciones/${id}`,   
    {
      ...this.getHttpOptions(),
      responseType: 'text' as 'json'   
    }
  ).pipe(
    catchError(this.handleError)
  );
}

  
   
  isTweetOwner(tweetId: number): Observable<boolean> {
  const token = this.getToken();
  if (!token) {
    return throwError(() => new Error("Token no encontrado"));
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + token
    })
  };

  return this.http.get<boolean>(`${this.apiURL}api/publicaciones/${tweetId}/owner`, httpOptions)
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
