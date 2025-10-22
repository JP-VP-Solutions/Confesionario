import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.estaAutenticado()) {
      return true;
    }

    // Guardar la URL para redirigir después del login (opcional)
    const returnUrl = state.url !== '/confesiones' ? state.url : null;

    this.router.navigate(['/login'], {
      queryParams: returnUrl ? { returnUrl } : {}
    });

    return false;
  }
}
