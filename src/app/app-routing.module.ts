import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'forgot-password', loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule) },
  { path: 'plantas', loadChildren: () => import('./pages/categorias/plantas/plantas.module').then(m => m.PlantasPageModule) },
  { path: 'insumos', loadChildren: () => import('./pages/categorias/insumos/insumos.module').then(m => m.InsumosPageModule) },
  { path: 'herramientas', loadChildren: () => import('./pages/categorias/herramientas/herramientas.module').then(m => m.HerramientasPageModule) },
  { path: 'carrito', loadChildren: () => import('./pages/carrito/carrito/carrito.module').then(m => m.CarritoPageModule),canActivate: [AuthGuard] },
  { path: 'productos/:categoria/:subcategoria', loadChildren: () => import('./productos/productos/productos.module').then(m => m.ProductosPageModule ) },  
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' }  // Ruta comodín
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
