import { PLATES, formatCurrency } from './data.js';

export function mountConfigurator({ root, basePrice, onAdd }){
  const selection = new Map();
  PLATES.forEach(p => selection.set(p.kg, 0));

  const el = document.createElement('div');
  el.className = 'configurator';
  el.innerHTML = `
    <div class="plates" role="group" aria-label="Seleção de anilhas">
      ${PLATES.map(p => `
        <button class="plate" type="button" data-kg="${p.kg}" aria-pressed="false" title="${p.kg} kg - ${p.color}">${p.kg}</button>
      `).join('')}
    </div>
    <div class="config-summary" aria-live="polite">
      <div class="line"><span>Base</span><strong class="price-base">${formatCurrency(basePrice)}</strong></div>
      <div class="line"><span>Anilhas</span><strong class="price-plates">${formatCurrency(0)}</strong></div>
      <div class="line"><span class="muted">Composição</span><span class="badge comp"></span></div>
      <div class="line total"><span>Total</span><strong class="price-total">${formatCurrency(basePrice)}</strong></div>
      <div class="actions">
        <button class="btn add">Adicionar ao carrinho</button>
        <button class="btn outline reset">Limpar</button>
      </div>
    </div>
  `;

  root.appendChild(el);

  const pricePerKg = 12.5; // preço simbólico por kg de anilha

  function update(){
    const plateTotalKg = [...selection.entries()].reduce((sum, [kg, qty]) => sum + kg*qty, 0);
    const platesPrice = plateTotalKg * pricePerKg;
    el.querySelector('.price-plates').textContent = formatCurrency(platesPrice);
    el.querySelector('.price-total').textContent = formatCurrency(basePrice + platesPrice);
    const comp = [...selection.entries()].filter(([,q])=>q>0).map(([kg,q])=>`${q}×${kg}kg`).join(' · ');
    el.querySelector('.comp').textContent = comp || 'Nenhuma anilha selecionada';
  }

  el.querySelectorAll('.plate').forEach(btn => {
    btn.addEventListener('click', () => {
      const kg = parseFloat(btn.dataset.kg);
      const current = selection.get(kg) || 0;
      const active = btn.getAttribute('aria-pressed') === 'true';
      if(active){
        selection.set(kg, Math.max(0, current - 1));
      } else {
        selection.set(kg, current + 1);
      }
      btn.setAttribute('aria-pressed', (!active).toString());
      update();
    });
  });

  el.querySelector('.reset')?.addEventListener('click', () => {
    selection.forEach((_,kg)=>selection.set(kg,0));
    el.querySelectorAll('.plate').forEach(b=>b.setAttribute('aria-pressed','false'));
    update();
  });

  el.querySelector('.add')?.addEventListener('click', () => {
    const items = [...selection.entries()].filter(([,q])=>q>0).map(([kg,q])=>({kg, qty:q}));
    onAdd({ plates: items, basePrice });
  });

  update();
}
