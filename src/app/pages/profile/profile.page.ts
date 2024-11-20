import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface Direccion {
  id?: string;
  alias: string;
  direccion: string;
  nombreContacto: string;
  telefono: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  nombre: string = 'Usuario Ejemplo';
  email: string = 'usuario@ejemplo.com';
  fotoUrl: string | null = null;
  direcciones: Direccion[] = [];
  uid: string | null = null; // Variable para almacenar el UID del usuario

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private angularFireAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.cargarUsuarioAutenticado();
  }

  cargarUsuarioAutenticado() {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.nombre = user.displayName || 'Sin nombre'; // Obtén el nombre del usuario
        this.email = user.email || 'Sin correo'; // Obtén el email del usuario
        this.fotoUrl = user.photoURL; // Foto de perfil (si está disponible)
        this.obtenerDirecciones(); // Cargar direcciones asociadas al usuario
      } else {
        this.uid = null;
        console.warn('No hay un usuario autenticado');
      }
    });
  }

  obtenerDirecciones() {
    if (this.uid) {
      this.firestore
        .collection('direcciones', (ref) => ref.where('uid', '==', this.uid)) // Filtra por el UID del usuario
        .snapshotChanges()
        .subscribe((data) => {
          this.direcciones = data.map((e) => {
            const docData = e.payload.doc.data() as Direccion;
            return {
              id: e.payload.doc.id,
              alias: docData.alias || 'Sin alias',
              direccion: docData.direccion || 'Sin dirección',
              nombreContacto: docData.nombreContacto || 'Sin contacto',
              telefono: docData.telefono || 'Sin teléfono',
              lat: docData.lat || 0,
              lng: docData.lng || 0,
            };
          });
        });
    }
  }

  eliminarDireccion(id: string | undefined) {
    if (id) {
      this.firestore
        .collection('direcciones')
        .doc(id)
        .delete()
        .then(() => {
          this.obtenerDirecciones();
        })
        .catch((error) => console.error('Error al eliminar dirección:', error));
    }
  }

  async logout() {
    try {
      await this.angularFireAuth.signOut();
      this.router.navigate(['/home']);
      console.log('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
