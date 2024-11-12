import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  usuario: string | null = '';
  nombre: string | null = '';
  apellido: string | null = '';
  email: string | null = '';
  fotoUrl: string | null = '';

  constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    // Obtener el usuario autenticado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Si el usuario está autenticado, obtén sus datos
        this.nombre = user.displayName || 'Nombre no disponible';
        this.email = user.email || 'Correo no disponible';
        this.fotoUrl = user.photoURL || '';
        // Si deseas agregar más datos personalizados, puedes obtenerlos de Firestore u otro lugar
      } else {
        // Si no hay usuario autenticado, redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir a la página de login
  }
}
