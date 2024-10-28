// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  // Cargar el token desde localStorage al iniciar el servicio
  private loadToken(): void {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.token = storedToken;
      this.isAuthenticated$.next(true);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    if (username === 'user' && password === 'password') { // Simulación de autenticación
      this.token = 'fake-jwt-token';
      localStorage.setItem('token', this.token);
      this.isAuthenticated$.next(true);
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.isAuthenticated$.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }
}
