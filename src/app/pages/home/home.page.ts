import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  mensaje: string = "";

  constructor() {}

  ngOnInit() {
    // Obtener el nombre del usuario desde localStorage
    const usuario = localStorage.getItem('nombre_del_usuario');
    if (usuario) {
      this.mensaje = `Bienvenido ${usuario}`;
    }
  }
}
