// src/app/routes/auth.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from '../components/auth/login/login.component';
import { RegisterComponent } from '../components/auth/register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar Sesión',
    data: { animation: 'LoginPage' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registro',
    data: { animation: 'RegisterPage' }
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
