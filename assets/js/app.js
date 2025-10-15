import { PRODUCTS, formatCurrency } from './data.js';
import { addToCart, getCart, removeFromCart, clearCart, saveCart } from './cart.js';
import { mountConfigurator } from './configurator.js';

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

function updateCartCount(){
  const count = getCart().length;
  qsa('.cart-count').forEach(el => el.textContent = String(count));
}

function initNav(){
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  if(!nav || !toggle) return;
  toggle.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', (!expanded).toString());
    toggle.setAttribute('aria-expanded', (!expanded).toString());
  });
}

function initHome(){
  const el = qs('#home-products');
  if(!el) return;
  el.innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <img src="assets/svg/${p.id}.svg" alt="${p.name}">
      <div class="body">
        <h3>${p.name}</h3>
        <div class="price">${formatCurrency(p.price)}</div>
        <div class="actions">
          <a class="btn" href="${p.id}.html">Configurar</a>
          <a class="btn outline" href="produtos.html">Ver todos</a>
        </div>
      </div>
    </article>
  `).join('');
}

function initProdutosGrid(){
  const el = qs('#produtos-grid');
  if(!el) return;
  el.innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <img src="assets/svg/${p.id}.svg" alt="${p.name}">
      <div class="body">
        <h3>${p.name}</h3>
        <p class="muted">Miniatura premium colecionável</p>
        <div class="price">${formatCurrency(p.price)}</div>
        <div class="actions">
          <a class="btn" href="${p.id}.html">Configurar</a>
          <button class="btn outline" data-add-id="${p.id}">Adicionar ao carrinho</button>
        </div>
      </div>
    </article>
  `).join('');
  el.querySelectorAll('[data-add-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = PRODUCTS.find(p => p.id === btn.getAttribute('data-add-id'));
      if(!product) return;
      addToCart({ productId: product.id, name: product.name, price: product.price, plates: [] });
    });
  });
}

function initProductPage(){
  const root = qs('#configurator');
  if(!root) return;
  const basePrice = parseFloat(root.dataset.basePrice || '0');
  mountConfigurator({ root, basePrice, onAdd: ({ plates, basePrice }) => {
    const productId = root.dataset.productId || document.body.dataset.productId || '';
    const name = root.dataset.productName || document.body.dataset.productName || '';
    addToCart({ productId, name, price: basePrice, plates });
  }});
}

function initCart(){
  const list = qs('#cart-list');
  const empty = qs('#cart-empty');
  const totalEl = qs('#cart-total');
  if(!list || !totalEl) return;

  function render(){
    const items = getCart();
    list.innerHTML = items.map((it, idx) => `
      <div class="card" style="padding:12px;">
        <div class="line"><strong>${it.name}</strong><button class="btn outline" data-rm="${idx}">Remover</button></div>
        <div class="line"><span>Base</span><span>${formatCurrency(it.price)}</span></div>
        ${it.plates?.length ? `<div class="line"><span>Anilhas</span><span>${it.plates.map(p=>`${p.qty}×${p.kg}kg`).join(' · ')}</span></div>`: ''}
      </div>
    `).join('');
    const total = items.reduce((s, it) => s + it.price + (it.plates?.reduce((a,p)=>a + p.kg*p.qty*12.5,0) || 0), 0);
    totalEl.textContent = formatCurrency(total);
    empty.style.display = items.length ? 'none' : 'block';

    list.querySelectorAll('[data-rm]').forEach(btn => btn.addEventListener('click', () => {
      removeFromCart(parseInt(btn.getAttribute('data-rm')));
      render();
    }));
  }

  qs('#checkout')?.addEventListener('click', () => {
    alert('Checkout simulado — obrigado por escolher a PR Tracker!');
    clearCart();
    render();
  });

  render();
}

addEventListener('cart:updated', updateCartCount);
addEventListener('DOMContentLoaded', () => {
  initNav();
  updateCartCount();
  const y = document.querySelector('#year'); if(y) y.textContent = String(new Date().getFullYear());
  initHome();
  initProdutosGrid();
  initProductPage();
  initCart();
});
