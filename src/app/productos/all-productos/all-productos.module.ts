import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllProductosPageRoutingModule } from './all-productos-routing.module';

import { AllProductosPage } from './all-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllProductosPageRoutingModule
  ],
  declarations: [AllProductosPage]
})
export class AllProductosPageModule {}
