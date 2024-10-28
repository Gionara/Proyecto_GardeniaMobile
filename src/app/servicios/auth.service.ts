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

  // Método de registro para almacenar usuario y contraseña
// auth.service.ts
register(usuario: string, password: string, nombre: string, apellido: string, email: string): Observable<boolean> {
  if (localStorage.getItem(usuario)) {
      return of(false); // Usuario ya existe
  }
  // Guardamos el usuario y la contraseña en localStorage
  const user = {
      password: password,
      nombre: nombre,
      apellido: apellido,
      email: email
  };
  localStorage.setItem(usuario, JSON.stringify(user)); // Almacenar como un objeto JSON
  return of(true);
}

  

// auth.service.ts
login(username: string, password: string): Observable<boolean> {
  const storedUser = localStorage.getItem(username);
  if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.password === password) {
          this.token = 'fake-jwt-token';
          localStorage.setItem('token', this.token);
          localStorage.setItem('nombre_del_usuario', username); // Guardar el nombre del usuario
          this.isAuthenticated$.next(true);
          return of(true);
      }
  }
  return of(false);
}

  

logout() {
  localStorage.removeItem('token'); // Elimina el token
  localStorage.removeItem('nombre_del_usuario'); // Elimina el nombre del usuario
  // Puedes eliminar cualquier otro dato que quieras
  this.isAuthenticated$.next(false); // Actualiza el estado de autenticación
}

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }
}
