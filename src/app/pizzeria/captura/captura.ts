import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { INGREDIENTES, TAMANOS } from '../modelos';
import { PedidoService } from '../pedido.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-captura',
  templateUrl: './captura.html',
})
export class Captura {
  tamanos = TAMANOS;
  ingredientes = INGREDIENTES;

  constructor(public pedido: PedidoService) {}

  agregar(): void {
    const pizza = this.pedido.pizza;

    if (pizza.invalid) {
      pizza.markAllAsTouched();
      return;
    }

    const v = pizza.getRawValue();
    const tamano = TAMANOS.find((t) => t.nombre === v.tamano);
    if (!tamano) {
      return;
    }

    const elegidos = INGREDIENTES.filter((i) => v.ingredientes[i.nombre]);
    const numPizzas = Number(v.numPizzas);
    const precioUnitario = tamano.precio + elegidos.reduce((s, i) => s + i.precio, 0);

    this.pedido.agregarPizza({
      tamano: tamano.nombre,
      ingredientes: elegidos.map((i) => i.nombre),
      numPizzas,
      subtotal: precioUnitario * numPizzas,
    });

    this.pedido.reiniciarPizza();
  }
}