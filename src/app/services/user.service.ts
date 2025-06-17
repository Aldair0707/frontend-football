// user.service.ts
import { Injectable } from '@angular/core';
import { Credential } from '../models/user/Credential';
import { Token } from '../models/user/Token';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = 'https://soccerhub-spring.onrender.com/api/auth/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  postLogin(myCredential: Credential): Observable<Token> {
    const body = {
      username: myCredential.username,
      password: myCredential.password
    };
    return this.http.post<Token>(this.apiURL + 'signin', body, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para registrar un usuario
  registerUser(userData: any): Observable<any> {
    return this.http.post(this.apiURL + 'signup', userData, this.httpOptions);   
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error ${error.status}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
