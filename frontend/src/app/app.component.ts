import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

// PrimeNG
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MessageModule,
    ButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Confiesa Anónimo';
  showServerWarning = true;
  showNavbar = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Detectar cambios de ruta para mostrar/ocultar navbar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Ocultar navbar en login y registro
        this.showNavbar = !event.url.includes('/login') && !event.url.includes('/registro');
      });

    // Auto-ocultar mensaje del servidor después de 10 segundos
    setTimeout(() => {
      this.showServerWarning = false;
    }, 10000);
  }

  cerrarMensajeServidor(): void {
    this.showServerWarning = false;
  }

  logout(): void {
    this.authService.logout();
  }

  irAAdmin(): void {
    this.router.navigate(['/admin']);
  }

  irAConfesiones(): void {
    this.router.navigate(['/confesiones']);
  }
}
