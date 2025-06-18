import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Tweet } from '../models/tweets/Tweet';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  private apiURL = 'https://soccerhub-spring07.onrender.com/api/tweets';  // URL 

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

   
  getTweets(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(`${this.apiURL}/all`);
  }

   
  createTweet(formData: FormData): Observable<Tweet> {
    const token = this.storageService.getToken();

    if (!token) {
      console.warn("❌ No hay token, usuario no autenticado.");
      return throwError(() => new Error('Token JWT no disponible'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Tweet>(`${this.apiURL}/create`, formData, { headers });
  }

   
  deleteTweet(tweetId: number): Observable<any> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiURL}/${tweetId}`, { headers });
  }

   
  updateTweet(tweetId: number, formData: FormData): Observable<any> {
    const token = this.storageService.getToken();
    if (!token) return throwError(() => new Error('Token JWT no disponible'));

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiURL}/${tweetId}`, formData, { headers });
  }
}