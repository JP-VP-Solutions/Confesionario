import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {AuthService} from '../../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const usuarioId = authService.obtenerUsuarioId();

  // Si hay un usuario logueado, agregar el header Usuario-Id
  if (usuarioId) {
    const clonedRequest = req.clone({
      setHeaders: {
        'Usuario-Id': usuarioId.toString()
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
