import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  nombre: string | null = '';

  constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    // Obtener el usuario autenticado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Si el usuario está autenticado, obtén sus datos
        this.nombre = user.displayName || 'Usuario';

      }
    });
  }
}
