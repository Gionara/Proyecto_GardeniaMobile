import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductosPage } from './productos.page'; // Asegúrate de que la importación sea correcta
import { RouterModule } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularFirestoreModule,
    RouterModule.forChild([{ path: '', component: ProductosPage }]),
  ],
  declarations: [ProductosPage]
})
export class ProductosPageModule {}
