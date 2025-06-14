import { Injectable } from '@angular/core';
import { Tweet } from '../models/tweets/Tweet'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StorageService } from "../services/storage.service";

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  apiURL = 'http://localhost:8080/';
  token='';
  constructor(
    private http: HttpClient,
    private storageService : StorageService)
  {
       this.token = this.storageService.getSession("token");
       console.log(this.token);

  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':'Bearer '  + this.token
    })
  }

  errorMessage = "";

  
  getTweets(page: number, size: number): Observable<any> {
  const token = this.storageService.getSession("token"); // ¡toma el token actualizado!
  
  const httpOptions = {
     headers : new HttpHeaders({
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
  // Obtén el token del almacenamiento
  const token = this.storageService.getSession("token");

  // Verifica si el token está disponible
  if (!token) {
    console.error("Token JWT no encontrado");
    return throwError(() => new Error("Token JWT no encontrado"));  // Retorna un error si no hay token
  }

  // Configura las opciones HTTP con el token en el encabezado
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }),
    withCredentials: true // Asegúrate de habilitar esto si necesitas cookies de autenticación
  };

  // Crea el cuerpo de la solicitud con el contenido del tweet
  const body = { contenido: myTweet }; // Usa "contenido" como clave
  console.log("Cuerpo enviado al backend:", body);

  // Realiza la solicitud POST al backend y retorna el observable
  return this.http.post(this.apiURL + 'api/publicaciones/crear', body, httpOptions)
    .pipe(
      catchError(this.handleError) // Maneja errores si los hay
    );
}






   // Error handling
  handleError(error : any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    window.alert(errorMessage);
    return throwError(errorMessage);
 }

}