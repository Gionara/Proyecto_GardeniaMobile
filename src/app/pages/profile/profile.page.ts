// profile.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = localStorage.getItem('nombre_del_usuario');
    const userData = localStorage.getItem(this.usuario as string);
    
    if (userData) {
      const user = JSON.parse(userData);
      this.nombre = user.nombre;
      this.apellido = user.apellido;
      this.email = user.email;
    }
  }

  logout() {
    this.authService.logout(); // Llamar al método de logout
    this.router.navigate(['/login']); // Redirigir a la página de login
  }
}
