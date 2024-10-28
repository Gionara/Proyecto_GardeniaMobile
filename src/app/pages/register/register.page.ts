// register.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  usuario: string = '';
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error_message: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() { }

  registrarUsuario() {
    if (this.password !== this.confirmPassword) {
      this.error_message = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.register(this.usuario, this.password, this.nombre, this.apellido, this.email).subscribe(success => {
      if (success) {
        this.router.navigate(['/login']);
      } else {
        this.error_message = 'El usuario ya existe. Por favor, elige otro nombre de usuario.';
      }
    });
    
  }
}
