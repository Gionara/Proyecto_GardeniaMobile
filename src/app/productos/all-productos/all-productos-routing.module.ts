import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllProductosPage } from './all-productos.page';

const routes: Routes = [
  {
    path: '',
    component: AllProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllProductosPageRoutingModule {}
