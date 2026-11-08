import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { INGREDIENTES, PizzaDetalle, Venta, VentaDetalle } from './modelos';

function hoy(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function ingredientesVacios(): { [nombre: string]: boolean } {
  return Object.fromEntries(INGREDIENTES.map((i) => [i.nombre, false]));
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://127.0.0.1:5000/api/pedidos/';

  form = new FormGroup({
    cliente: new FormGroup({
      nombre: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      telefono: new FormControl('', [Validators.required, Validators.pattern(/^[0-9\- ]{7,15}$/)]),
      fecha: new FormControl(hoy(), Validators.required),
    }),
    pizza: new FormGroup({
      tamano: new FormControl('', Validators.required),
      ingredientes: new FormGroup(
        Object.fromEntries(INGREDIENTES.map((i) => [i.nombre, new FormControl(false)]))
      ),
      numPizzas: new FormControl(1, [Validators.required, Validators.min(1)]),
    }),
  });

  detalle = signal<PizzaDetalle[]>([]);
  total = computed(() => this.detalle().reduce((suma, p) => suma + p.subtotal, 0));

  ventasActualizadas = new Subject<void>();

  constructor(private http: HttpClient) {}

  get cliente() {
    return this.form.controls.cliente;
  }

  get pizza() {
    return this.form.controls.pizza;
  }

  agregarPizza(pizza: PizzaDetalle): void {
    this.detalle.update((lista) => [...lista, pizza]);
  }

  quitarPizza(indice: number): void {
    this.detalle.update((lista) => lista.filter((_, i) => i !== indice));
  }

  reiniciarPizza(): void {
    this.pizza.reset({
      tamano: '',
      ingredientes: ingredientesVacios(),
      numPizzas: 1,
    });
  }

  limpiar(): void {
    this.detalle.set([]);
    this.cliente.reset({ nombre: '', direccion: '', telefono: '', fecha: hoy() });
    this.reiniciarPizza();
  }

  registrarPedido(): Observable<any> {
    const c = this.cliente.getRawValue();

    const cuerpo = {
      nombre: c.nombre,
      direccion: c.direccion,
      telefono: c.telefono,
      fecha: c.fecha,
      pizzas: this.detalle().map((p) => ({
        tamano: p.tamano,
        ingredientes: p.ingredientes,
        numPizzas: p.numPizzas,
      })),
    };

    return this.http.post<any>(this.apiUrl, cuerpo);
  }

  ventasPorDia(dia: string): Observable<{ ventas: Venta[]; total: number }> {
    return this.http.get<{ ventas: Venta[]; total: number }>(
      `${this.apiUrl}dia/${encodeURIComponent(dia)}`
    );
  }

  ventasPorMes(mes: string): Observable<{ ventas: Venta[]; total: number }> {
    return this.http.get<{ ventas: Venta[]; total: number }>(
      `${this.apiUrl}mes/${encodeURIComponent(mes)}`
    );
  }

  detalleVenta(id: number): Observable<VentaDetalle> {
    return this.http.get<VentaDetalle>(`${this.apiUrl}${id}`);
  }
}