import { Component, signal } from '@angular/core';
import { PedidoService } from '../pedido.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.html',
})
export class DetallePedido {
  seleccion = signal<number | null>(null);
  guardando = signal(false);
  mensaje = signal('');
  esError = signal(false);

  constructor(public pedido: PedidoService) {}

  seleccionar(indice: number): void {
    this.seleccion.set(indice);
  }

  // Botón Quitar
  quitar(): void {
    const indice = this.seleccion();
    if (indice === null) {
      return;
    }
    this.pedido.quitarPizza(indice);
    this.seleccion.set(null);
  }

  // Botón Terminar
  terminar(): void {
    this.mensaje.set('');

    if (this.pedido.detalle().length === 0) {
      this.esError.set(true);
      this.mensaje.set('Agrega al menos una pizza al pedido.');
      return;
    }

    if (this.pedido.cliente.invalid) {
      this.pedido.cliente.markAllAsTouched();
      this.esError.set(true);
      this.mensaje.set('Completa correctamente los datos del cliente.');
      return;
    }

    this.guardando.set(true);

    this.pedido.registrarPedido().subscribe({
      next: (respuesta) => {
        this.esError.set(false);
        this.mensaje.set(respuesta.mensaje);
        this.guardando.set(false);
        this.seleccion.set(null);
        this.pedido.limpiar();
        this.pedido.ventasActualizadas.next();
      },
      error: (error) => {
        console.error('Error al guardar el pedido:', error);
        this.esError.set(true);
        this.mensaje.set(error.error?.mensaje || 'No se pudo guardar el pedido.');
        this.guardando.set(false);
      }
    });
  }
}