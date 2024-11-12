// auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Necesario para Firestore

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user) // Retorna true si el usuario está autenticado, false en caso contrario
    );
  }

  // Otros métodos de autenticación (login, logout, register, etc.) van aquí
  async login(email: string, password: string): Promise<any> {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  async register(email: string, password: string, nombre: string, apellido: string): Promise<any> {
    try {
      // Crear usuario con email y contraseña
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      
      // Actualizar el perfil del usuario con nombre y apellido
      await userCredential.user?.updateProfile({
        displayName: `${nombre} ${apellido}`,  // Nombre completo
      });

      // Almacenar el nombre y apellido en Firestore (base de datos)
      await this.firestore.collection('usuarios').doc(userCredential.user?.uid).set({
        nombre: nombre,
        apellido: apellido,
        email: email,
      }).then(() => {
        console.log('Usuario guardado en Firestore');
      }).catch((error) => {
        console.error('Error al guardar usuario en Firestore:', error);
      });

      return userCredential; // Retorna el userCredential para usarlo donde lo necesites
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  async getCurrentUserId(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }
}
