import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario_login: string = '';
  password_login: String = '';

  
  constructor(private router: Router) {}

  ngOnInit() {}

  iniciarSeccion() {
    let datosEnviar: NavigationExtras = {
      queryParams: { usuario_login: this.usuario_login },
    };
    this.router.navigate(['/home'], datosEnviar);
  }
}
