import { Component, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PedidoService } from '../pedido.service';
import { Venta, VentaDetalle } from '../modelos';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-ventas-consulta',
  templateUrl: './ventas-consulta.html',
})
export class VentasConsulta implements OnInit {
  consulta = new FormGroup({
    tipo: new FormControl('dia', { nonNullable: true }),
    valor: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  ventas = signal<Venta[]>([]);
  totalAcumulado = signal(0);
  titulo = signal('Ventas');
  mensaje = signal('');
  detalle = signal<VentaDetalle | null>(null);

  private consultaActiva = false;

  constructor(private pedido: PedidoService) {
    this.pedido.ventasActualizadas
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.consultaActiva) {
          this.consultar();
        }
      });
  }

  ngOnInit(): void {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    this.consulta.patchValue({ tipo: 'dia', valor: dias[new Date().getDay()] });
    this.consultar();
  }

  consultar(): void {
    this.mensaje.set('');

    if (this.consulta.invalid) {
      this.consulta.markAllAsTouched();
      this.mensaje.set('Escribe un día de la semana o el nombre de un mes.');
      return;
    }

    const { tipo, valor } = this.consulta.getRawValue();
    const texto = valor.trim();

    const peticion = tipo === 'dia'
      ? this.pedido.ventasPorDia(texto)
      : this.pedido.ventasPorMes(texto);

    peticion.subscribe({
      next: (respuesta) => {
        this.ventas.set(respuesta.ventas);
        this.totalAcumulado.set(respuesta.total);
        this.titulo.set(tipo === 'dia' ? `Ventas del ${texto}` : `Ventas de ${texto}`);
        this.detalle.set(null);
        this.consultaActiva = true;

        if (respuesta.ventas.length === 0) {
          this.mensaje.set('No hay ventas para esta consulta.');
        }
      },
      error: (error) => {
        console.error('Error al consultar ventas:', error);
        this.ventas.set([]);
        this.totalAcumulado.set(0);
        this.detalle.set(null);
        this.mensaje.set(error.error?.mensaje || 'No se pudieron consultar las ventas.');
      }
    });
  }

  verDetalle(id: number): void {
    this.pedido.detalleVenta(id).subscribe({
      next: (respuesta) => this.detalle.set(respuesta),
      error: (error) => {
        console.error('Error al consultar el detalle:', error);
        this.mensaje.set('No se pudo consultar el detalle de la venta.');
      }
    });
  }

  cerrarDetalle(): void {
    this.detalle.set(null);
  }
}