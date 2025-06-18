import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  private apiURL = `${environment.apiUrl}/reactions`;  // Ya usa la URL base definida en environment.ts

  constructor(private http: HttpClient, private storageService: StorageService) { }

  private getAuthHeaders(): HttpHeaders | null {
    const token = this.storageService.getToken();
    console.log('🧪 TOKEN OBTENIDO:', token); // 💥 esto debe mostrar el JWT

    if (!token) {
      console.warn("❌ Token no disponible. Petición cancelada.");
      return null;
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

   
  reactToTweet(tweetId: number, reactionId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    const body = { tweetId, reactionId };
    return this.http.post(`${this.apiURL}/react`, body, { headers });
  }

  
  removeReaction(tweetId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    return this.http.delete(`${this.apiURL}/tweet/${tweetId}`, { headers });
  }

  
  getReactionCount(tweetId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    return this.http.get(`${this.apiURL}/count/tweet/${tweetId}`, { headers });
  }
}