import { Component } from '@angular/core';
import { Captura } from './captura/captura';
import { DetallePedido } from './detalle-pedido/detalle-pedido';
import { VentasConsulta } from './ventas-consulta/ventas-consulta';

@Component({
  imports: [Captura, DetallePedido, VentasConsulta],
  selector: 'app-pizzeria',
  templateUrl: './pizzeria.html',
})
export class Pizzeria {}