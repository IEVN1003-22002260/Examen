export interface Opcion {
  nombre: string;
  precio: number;
}

export const TAMANOS: Opcion[] = [
  { nombre: 'Chica', precio: 40 },
  { nombre: 'Mediana', precio: 80 },
  { nombre: 'Grande', precio: 120 },
];

export const INGREDIENTES: Opcion[] = [
  { nombre: 'Jamon', precio: 10 },
  { nombre: 'Piña', precio: 10 },
  { nombre: 'Champiñones', precio: 10 },
];

export interface PizzaDetalle {
  tamano: string;
  ingredientes: string[];
  numPizzas: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  fecha: string;
  total: number;
}

export interface VentaDetalle {
  pedido: Venta;
  pizzas: PizzaDetalle[];
}