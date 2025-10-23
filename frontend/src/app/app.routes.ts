import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';

export const routes: Routes = [
  // Ruta por defecto - redirige a confesiones
  {
    path: '',
    redirectTo: '/confesiones',
    pathMatch: 'full'
  },

  // Rutas públicas - redirigen a confesiones si ya estás autenticado
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [PublicGuard],
    title: 'Iniciar Sesión'
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [PublicGuard],
    title: 'Registro'
  },

  // Ruta principal protegida - maneja admin y usuarios normales internamente
  {
    path: 'confesiones',
    loadComponent: () => import('./components/confesiones-list/confesiones-list.component').then(m => m.ConfesionesListComponent),
    canActivate: [AuthGuard],
    title: 'Confesiones'
  },
  {
    path: 'admin/confesiones',
    loadComponent: () => import('./components/confesiones-admin-list/confesiones-list-admin.component').then(m => m.ConfesionesListAdminComponent),
    canActivate: [AuthGuard],
    title: 'Confesiones Admin'
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chat-global/chat-global.component').then(m => m.ChatGlobalComponent),
    canActivate: [AuthGuard],
    title: 'Chat Global'
  },

  // Ruta 404 - redirige a confesiones
  {
    path: '**',
    redirectTo: '/confesiones'
  }
];
