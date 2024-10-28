// login.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario_login: string = '';
  password_login: string = '';
  error_message: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  iniciarSeccion() {
    this.authService.login(this.usuario_login, this.password_login).subscribe(success => {
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.error_message = 'Usuario o contraseña incorrectos';
      }
    });
  }
}
