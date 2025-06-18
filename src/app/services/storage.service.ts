import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
 
  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

   
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

 
  public clearToken(): void {
    localStorage.removeItem('token');
  }

 
  public setUser(user: string): void {
    localStorage.setItem('user', user);
  }

   
  public getUser(): string | null {
    return localStorage.getItem('user');
  }

  
  public clearUser(): void {
    localStorage.removeItem('user');
  }
 
  
  public signOut(): void {
    localStorage.clear();
  }
}