export const PRODUCTS = [
  { id: 'deadlift-set', name: 'Deadlift Set', price: 349.90 },
  { id: 'power-rack-set', name: 'Power Rack Set', price: 399.90 },
  { id: 'bench-press-set', name: 'Bench Press Set', price: 369.90 },
  { id: 'my-trophy-set', name: 'My Trophy Set', price: 329.90 }
];

export const PLATES = [
  { kg: 25, color: 'Vermelho' },
  { kg: 20, color: 'Azul' },
  { kg: 15, color: 'Amarelo' },
  { kg: 10, color: 'Verde' },
  { kg: 5, color: 'Branco' },
  { kg: 2.5, color: 'Preto' },
  { kg: 1.25, color: 'Prata' }
];

export function formatCurrency(value){
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
