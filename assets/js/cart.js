const CART_KEY = 'prtracker_cart_v1';

export function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch{ return []; }
}

export function saveCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  dispatchEvent(new CustomEvent('cart:updated', { detail: { items } }));
}

export function addToCart(item){
  const items = getCart();
  items.push(item);
  saveCart(items);
}

export function removeFromCart(index){
  const items = getCart();
  items.splice(index,1);
  saveCart(items);
}

export function clearCart(){
  saveCart([]);
}
