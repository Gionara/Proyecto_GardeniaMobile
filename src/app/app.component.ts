import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  mesaje:string ="";
  constructor(private rutaActiva: ActivatedRoute) { 

    this.rutaActiva.queryParams.subscribe(params =>{
      if(params['usuario_login']){
        this.mesaje = params['usuario_login']
      }
    })
  }
}