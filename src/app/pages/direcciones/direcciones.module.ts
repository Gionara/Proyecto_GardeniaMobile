import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DireccionesPageRoutingModule } from './direcciones-routing.module';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DireccionesService } from '../../servicios/direcciones.service';

import { DireccionesPage } from './direcciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DireccionesPageRoutingModule
  ],
  declarations: [DireccionesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DireccionesPageModule {}
