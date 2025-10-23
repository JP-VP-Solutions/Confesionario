import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import {
  MensajeChatDTO,
  MensajeUsuarioRequestDTO,
  MensajeSistemaRequestDTO
} from '../../models/chat.model';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {FormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {TooltipModule} from 'primeng/tooltip';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';

interface MensajeSistema {
  contenido: string;
  nombreSistema: string;
}

@Component({
  selector: 'app-chat-global',
  templateUrl: './chat-global.component.html',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    CommonModule,
    ButtonModule,
    TooltipModule,
    ScrollPanelModule,
    MessageModule
  ],
  styleUrls: ['./chat-global.component.css']
})
export class ChatGlobalComponent implements OnInit, OnDestroy {

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  mensajes: MensajeChatDTO[] = [];
  nuevoMensaje: string = '';
  cargando: boolean = false;

  private pollingSubscription?: Subscription;
  private mensajesSistemaSubscription?: Subscription;

  // Array de mensajes del sistema
  private readonly MENSAJES_SISTEMA: MensajeSistema[] = [
    {
      contenido: "El fragor del yunke nos espera a todos...",
      nombreSistema: "Morel Vulliez"
    },
    {
      contenido: "¡Yo quiero Cobrar!!!!",
      nombreSistema: "Morel Vulliez"
    },
    {
      contenido: "¡Cordero!!!!!",
      nombreSistema: "Morel Vulliez"
    },
    {
      contenido: "Una vez tuve una batalla contra un puma durante 7 horas.",
      nombreSistema: "Morel Vulliez"
    },
    {
      contenido: "El fragor del yunke resuena en mi alma...",
      nombreSistema: "Morel Vulliez"
    },
    {
      contenido: "El caos observa en silencio, nadie se atreve a respirar.",
      nombreSistema: "MechaCore"
    },
    {
      contenido: "Hoy aprendí que los fantasmas no pagan alquiler.",
      nombreSistema: "MechaCore"
    },
    {
      contenido: "El sistema advierte: los errores se multiplican solos.",
      nombreSistema: "MechaCore"
    },
    {
      contenido: "Los archivos secretos fueron quemados, nadie vio nada.",
      nombreSistema: "MechaCore"
    },
    {
      contenido: "El fragor del yunke está dentro de todos nosotros...",
      nombreSistema: "Morel Vulliez"
    },
    {
      contenido: "No hay salida, solo el ciclo eterno de mensajes absurdos.",
      nombreSistema: "DataForge"
    },
    {
      contenido: "Los servidores no perdonan ni a los valientes.",
      nombreSistema: "DataForge"
    },
    {
      contenido: "El fragor del yunke ilumina las almas perdidas...",
      nombreSistema: "Morel Vulliez"
    },
    {
      contenido: "Cuidado con los bugs que se disfrazan de amigos.",
      nombreSistema: "MechaCore"
    },
    {
      contenido: "¡Al ataque del caos, todos listos!",
      nombreSistema: "DataForge"
    },
    {
      contenido: "El fragor del yunke se escucha más fuerte en la noche...",
      nombreSistema: "Morel Vulliez"
    },
    {
      contenido: "Nunca subestimes la fuerza de un servidor enojado.",
      nombreSistema: "MechaCore"
    },
    {
      contenido: "El purgatorio digital se ríe de tus intentos.",
      nombreSistema: "DataForge"
    },
    {
      contenido: "El fragor del yunke marcará tu destino, MorelVulliez.",
      nombreSistema: "Morel Vulliez"
    },
    {
      contenido: "Los logs recuerdan todo… incluso lo que no querés.",
      nombreSistema: "MechaCore"
    }
  ];

  constructor(
    private chatService: ChatService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarMensajes();
    this.iniciarPolling();
    this.iniciarMensajesSistema();
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    if (this.mensajesSistemaSubscription) {
      this.mensajesSistemaSubscription.unsubscribe();
    }
  }

  // Cargar mensajes iniciales
  cargarMensajes(): void {
    this.cargando = true;
    this.chatService.obtenerMensajes().subscribe({
      next: (mensajes) => {
        this.mensajes = mensajes;
        this.cargando = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        this.cargando = false;
      }
    });
  }

  // Polling cada 0.5 segundos - SOLO TRAER NUEVOS
  iniciarPolling(): void {
    this.pollingSubscription = interval(500)
      .pipe(
        switchMap(() => {
          // Si no hay mensajes, traer todos
          if (this.mensajes.length === 0) {
            return this.chatService.obtenerMensajes();
          }

          // Si hay mensajes, traer solo los nuevos después del último
          const ultimoMensaje = this.mensajes[this.mensajes.length - 1];
          return this.chatService.obtenerMensajesNuevos(ultimoMensaje.fechaHora);
        })
      )
      .subscribe({
        next: (mensajes) => {
          if (this.mensajes.length === 0) {
            // Primera carga
            this.mensajes = mensajes;
            setTimeout(() => this.scrollToBottom(), 50);
          } else if (mensajes.length > 0) {
            // Agregar solo los nuevos al final
            this.mensajes.push(...mensajes);
            setTimeout(() => this.scrollToBottom(), 50);
          }
        },
        error: (error) => {
          console.error('Error en polling:', error);
        }
      });
  }

  // Mensajes del sistema cada 8-12 minutos (random)
  iniciarMensajesSistema(): void {
    const intervaloBase = 8 * 60 * 1000; // 8 minutos en ms
    const intervaloRandom = 4 * 60 * 1000; // +4 minutos random

    const proximoIntervalo = intervaloBase + Math.random() * intervaloRandom;

    setTimeout(() => {
      this.enviarMensajeAleatorioDelSistema();
      this.iniciarMensajesSistema(); // Recursivo para el próximo
    }, proximoIntervalo);
  }

  // Enviar mensaje aleatorio del sistema
  enviarMensajeAleatorioDelSistema(): void {
    const mensajeRandom = this.MENSAJES_SISTEMA[
      Math.floor(Math.random() * this.MENSAJES_SISTEMA.length)
      ];

    const request: MensajeSistemaRequestDTO = {
      contenido: mensajeRandom.contenido,
      nombreSistema: mensajeRandom.nombreSistema
    };

    this.chatService.enviarMensajeSistema(request).subscribe({
      next: () => {
        console.log('Mensaje del sistema enviado');
      },
      error: (error) => {
        console.error('Error al enviar mensaje del sistema:', error);
      }
    });
  }

  // Enviar mensaje de usuario
  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim()) {
      return;
    }

    const usuarioActual = this.authService.usuarioActualValue;
    if (!usuarioActual) {
      return;
    }

    const request: MensajeUsuarioRequestDTO = {
      contenido: this.nuevoMensaje.trim(),
      usuarioId: usuarioActual.id
    };

    this.chatService.enviarMensaje(request).subscribe({
      next: () => {
        this.nuevoMensaje = '';
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
      }
    });
  }

  // Scroll automático al final
  scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  // Detectar Enter para enviar
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensaje();
    }
  }
}
