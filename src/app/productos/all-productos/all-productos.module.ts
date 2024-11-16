import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AllProductosPageRoutingModule } from './all-productos-routing.module';

import { AllProductosPage } from './all-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: AllProductosPage }])
  ],
  declarations: [AllProductosPage] // Aquí debe estar AllProductosPage
})
export class AllProductosPageModule {}

