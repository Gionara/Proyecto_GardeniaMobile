import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  mesaje:string ="";
  constructor(private rutaActiva: ActivatedRoute) { 

    this.rutaActiva.queryParams.subscribe(params =>{
      if(params['usuario_login']){
        this.mesaje = params['usuario_login']
      }
    })
  }

  ngOnInit() {
  }

}
