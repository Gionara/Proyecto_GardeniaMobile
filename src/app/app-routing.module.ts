import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component'; // Ajusta la ruta si es necesario
import { AllProductosComponent } from './all-productos/all-productos.component';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },

  {
    path: 'plantas',
    loadChildren: () => import('./pages/categorias/plantas/plantas.module').then( m => m.PlantasPageModule)
  },
  {
    path: 'insumos',
    loadChildren: () => import('./pages/categorias/insumos/insumos.module').then( m => m.InsumosPageModule)
  },
  {
    path: 'herramientas',
    loadChildren: () => import('./pages/categorias/herramientas/herramientas.module').then( m => m.HerramientasPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./pages/carrito/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  { path: 'productos/:categoria/:subcategoria', component: ProductosComponent },

  { path: 'all-productos', component: AllProductosComponent },
  // otras rutas...

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
