import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';  // Importar HttpClientModule
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment'; // Donde se encuentra la configuración de Firebase
import { GoogleMapsModule } from '@angular/google-maps'; // Nueva importación
import { DireccionesPage } from './pages/direcciones/direcciones.page';
import { DireccionesService } from './servicios/direcciones.service'; 
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Asegúrate de importar esto


@NgModule({
  declarations: [AppComponent 
  ],
  imports: [
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig), // Inicializa Firebase
    AngularFireAuthModule, // Módulo para autenticación
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    GoogleMapsModule, // Importar el módulo de Google Maps
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DireccionesService, // Agregar el servicio
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
