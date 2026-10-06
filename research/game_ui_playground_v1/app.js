(() => {
  'use strict';
  const D = window.PLAYGROUND_DATA, clone = x => JSON.parse(JSON.stringify(x));
  let config = clone(D.config), station = 'minimap';
  const states = {};
  const $ = id => document.getElementById(id);
  const labels = { minimap: 'Trail survey', inventory: 'Outpost equipment', shop: 'Field trader', hud: 'Training encounter', dialogue: 'A small contract' };
  const rarity = ['','Common','Uncommon','Rare'];
  const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const item = id => D.fixture.items.find(x => x.id === id);
  const product = id => D.fixture.products.find(x => x.id === id);
  const sign = n => n > 0 ? '+' + n : String(n);
  function init(s) {
    if (s === 'minimap') states[s] = { player: clone(D.fixture.player), view: 'trail', waypoint: 'tower' };
    if (s === 'inventory') states[s] = { view: 'camp', selected: null, equipment: clone(D.fixture.equipment) };
    if (s === 'shop') states[s] = { view: 'catalog', selected: null, quantity: 1, balance: D.fixture.shop.balance, owned: clone(D.fixture.shop.owned), stock: Object.fromEntries(D.fixture.products.map(p => [p.id,p.stock])), pending: null, receipt: null, transactions: 0 };
    if (s === 'hud') states[s] = { health: D.fixture.combat.health, enemyHealth: D.fixture.combat.enemyHealth, tonics: D.fixture.combat.tonics, cooldown: 0, paused: false, result: null, strikes: 0 };
    if (s === 'dialogue') states[s] = { view: 'talk', accepted: false, collected: 0, claimed: false, balance: 0 };
  }
  Object.keys(labels).forEach(init);
  function say(message) { $('status').textContent = message; }
  function button(id, text, cls = '', disabled = false) { const label={forward:'Move forward',backward:'Move backward','turn-left':'Turn left 45 degrees','turn-right':'Turn right 45 degrees','cancel-purchase':'Cancel purchase','qty-minus':'Decrease quantity','qty-plus':'Increase quantity'}[id];return `<button id="${id}" data-action="${id}" class="${cls}" ${label?'aria-label="'+label+'"':''} ${disabled?'disabled':''}>${text}</button>`; }
  function icon(name, tone = 'silver', cls = '') {
    const paths = {
      sword:'<path d="M24 4 31 11 17 31 9 24Z" fill="currentColor"/><path d="m7 24 17 12M14 30 5 43M2 40l6 5"/>',
      axe:'<path d="M29 4v39M17 10c-2 5-6 8-10 9l8 12 15-8 9-3-5-11Z"/><path d="m26 40 6 4"/>',
      armor:'<path d="m15 7 7 4 7-4 9 6-6 9-3-3 4 24H12l4-24-4 3-6-9Z"/><path d="M17 26h11M19 33h7"/>',
      bottle:'<path d="M17 5h12v8l-2 3v5c9 5 10 13 7 20H11c-3-7-2-15 8-20v-5l-2-3Z"/><path d="M12 31h21M18 10h10"/><path d="m20 26 5 7-5 5"/>',
      ration:'<path d="m10 13 27-5 5 29-29 8Z"/><path d="m9 13 8 8 24-4M15 26l19-4M17 33l14-3"/>',
      ore:'<path d="m4 29 12-16 12-5 16 24-14 12-19-4Z"/><path d="m16 13 3 18 11 13M19 31l25 1M28 8l-9 23L4 29"/>',
      crystal:'<path d="m24 3 13 13-2 19-11 12L12 35l-2-19Z"/><path d="m10 16 14 3 13-3M24 3v44M12 35l12-16 11 16"/>',
      beacon:'<path d="M21 17h6v23h-6Z"/><path d="m24 5 9 9-9 9-9-9ZM12 43h24M8 8 3 14m37-6 5 6"/>',
      boots:'<path d="M14 6h17v21l10 7v9H10V29h4Z"/><path d="M14 16h17M13 34h26M16 25h10"/>',
      lens:'<circle cx="25" cy="21" r="14"/><circle cx="25" cy="21" r="9"/><path d="m15 32-9 13M14 34l-5-4"/>'
    };
    return `<svg class="item-icon ${tone} ${cls}" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name]||paths.crystal}</svg>`;
  }
  function terrain() {
    const trees = [[110,100],[158,150],[205,95],[280,150],[370,100],[590,130],[720,95],[920,100],[890,240],[760,325],[850,410],[130,320],[170,390],[220,570],[310,630],[570,600],[650,510],[930,600],[445,200],[605,460]];
    return `<rect width="1000" height="700" fill="#334a32"/><path d="M0 150Q250 270 410 100T1000 150M0 210Q260 320 440 155T1000 220M0 620Q210 430 400 550T1000 620" fill="none" stroke="#53644a" stroke-width="2" opacity=".55"/><path d="M-30 590C130 460 250 440 310 280S550 120 710-20" stroke="#273e37" stroke-width="99" fill="none"/><path d="M-30 590C130 460 250 440 310 280S550 120 710-20" stroke="#527c73" stroke-width="70" fill="none"/><path d="M-30 590C130 460 250 440 310 280S550 120 710-20" stroke="#7caaa0" stroke-width="2" fill="none"/><path d="M40 650 250 530 390 395 510 365 635 270 825 135 990 90M510 365 645 465 750 585 970 655" stroke="#263828" stroke-width="29" fill="none"/><path d="M40 650 250 530 390 395 510 365 635 270 825 135 990 90M510 365 645 465 750 585 970 655" stroke="#b2a783" stroke-width="19" fill="none"/><path d="m287 340 65 26" stroke="#d3bd91" stroke-width="30"/><path d="m289 336 63 26m-66-15 62 26" stroke="#6f6045" stroke-width="2"/>${trees.map(([x,y],i)=>`<g transform="translate(${x} ${y})"><ellipse cy="23" rx="23" ry="9" fill="#192c20" opacity=".45"/><path d="M0-32 24 16H-24Z" fill="${i%2?'#253e28':'#203725'}" stroke="#5d7352" stroke-width="1.5"/><path d="M0-19 17 15H-17Z" fill="#3e5938"/><path d="M0 13v15" stroke="#9b8863" stroke-width="4"/></g>`).join('')}<g transform="translate(340 298)"><path d="M0 35 25-12 62 35Z" fill="#c1af80" stroke="#594f39" stroke-width="3"/><path d="m25-12 14 47H62" fill="#8f7958"/><path d="m22 35 7-23 10 23" fill="#293b28"/><circle cx="75" cy="37" r="10" fill="#e6ba6f"/><path d="m68 44 14-14m-14 0 14 14" stroke="#685634" stroke-width="4"/></g><g transform="translate(800 105)"><path d="M0 65V10L25-5l25 15v55Z" fill="#9eac8c" stroke="#283d2b" stroke-width="4"/><path d="m-8 10 33-28 33 28Z" fill="#635e44"/><path d="M16 27h18v22H16Z" fill="#2c3c2c"/><path d="M25 66V50" stroke="#6b765e" stroke-width="3"/></g><path d="M705 577h88v40h-88Z" fill="#526944"/><path d="m692 578 57-35 57 35Z" fill="#8c7d5a"/><text x="690" y="666" fill="#9ba889" font-size="13" letter-spacing="5">EAST RIDGE</text>`;
  }
  function markerSymbol(m, size, edge = false, angle = 0, pulse = false) {
    const color = m.type === 'enemy' ? '#ffad99' : m.type === 'ally' ? '#8adee5' : '#f1c87e';
    let symbol = m.type === 'enemy' ? `<path d="M0-${size} ${size} 0 0 ${size}-${size} 0Z" fill="${color}" stroke="#1a3026" stroke-width="2"/>` : m.type === 'ally' ? `<circle r="${size}" fill="${color}" stroke="#1a3026" stroke-width="2"/>` : `<path d="M0-${size+2} ${size} ${size}-${size} ${size}Z" fill="${color}" stroke="#1a3026" stroke-width="2"/>`;
    if (edge) symbol = `<g transform="rotate(${angle})"><path d="m0-${size+2} ${size} ${size} -${size} 0Z" fill="${color}" stroke="#14241d" stroke-width="2"/></g>`;
    return `${pulse&&m.type==='objective'?`<circle class="pulse-ring" r="${size+5}" fill="none" stroke="${color}" stroke-width="2"/>`:''}${symbol}`;
  }
  function visibleMarker(m, overview = false) {
    const c=config.minimap;
    if(m.type==='enemy') return c.enemies;
    if(m.type==='ally') return c.allies;
    return c.objectives && (c.objectiveMaps==='both'||c.objectiveMaps===(overview?'overview':'minimap'));
  }
  function legend() { return `<div class="map-legend"><span class="enemy"><b>◆</b>Enemy</span><span class="ally"><b>●</b>Ally</span><span class="objective"><b>▲</b>Goal</span></div>`; }
  function minimap() {
    const c=config.minimap, p=states.minimap.player, full=c.framing==='full', angle=!full&&c.orientation==='heading'?-p.heading:0;
    const scale=full?.215:c.zoom*.48, ox=full?500:p.x, oy=full?350:p.y, r=angle*Math.PI/180;
    const projected=D.fixture.markers.filter(m=>visibleMarker(m)).map(m=>{
      const dx=(m.x-ox)*scale,dy=(m.y-oy)*scale; let x=dx*Math.cos(r)-dy*Math.sin(r),y=dx*Math.sin(r)+dy*Math.cos(r);
      const distance=Math.hypot(x,y), outside=c.shape==='circle'?distance>99:Math.max(Math.abs(x),Math.abs(y))>99;
      if(outside&&!c.edgeArrows)return '';
      const factor=outside?99/(c.shape==='circle'?distance:Math.max(Math.abs(x),Math.abs(y))):1;
      const a=Math.atan2(x,-y)*180/Math.PI;
      return `<g class="map-marker" data-marker="${m.id}" data-edge="${outside}" transform="translate(${120+x*factor} ${120+y*factor})"><title>${m.name}${outside?' · direction only':''}</title>${markerSymbol(m,5*c.iconScale,outside,a,c.pulse&&states.minimap.waypoint===m.id)}</g>`;
    }).join('');
    const px=full?(p.x-500)*scale:0,py=full?(p.y-350)*scale:0,pa=p.heading+angle;
    const nx=120+Math.sin(r)*108,ny=120-Math.cos(r)*108;
    return `<svg viewBox="0 0 240 240" aria-hidden="true"><defs><clipPath id="mini-clip">${c.shape==='circle'?'<circle cx="120" cy="120" r="119"/>':'<rect width="240" height="240"/>'}</clipPath></defs><g clip-path="url(#mini-clip)"><g transform="translate(120 120) rotate(${angle}) scale(${scale}) translate(${-ox} ${-oy})">${terrain()}</g><circle cx="120" cy="120" r="43" fill="none" stroke="#d8dfcb" opacity=".3" stroke-dasharray="2 6"/>${projected}<g transform="translate(${120+px} ${120+py}) rotate(${pa})"><path d="M0-12 9 9 0 5-9 9Z" fill="#f8f7ea" stroke="#163223" stroke-width="2"/></g></g><text x="${nx}" y="${ny+4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#fff1c8" stroke="#15271e" stroke-width="3" paint-order="stroke">N</text></svg>`;
  }
  function world(overview = false) {
    const p=states.minimap.player;
    const markers=D.fixture.markers.filter(m=>visibleMarker(m,overview)).map(m=>`<g ${overview&&m.type==='objective'?`tabindex="0" role="button" aria-label="Track ${m.name}" data-waypoint="${m.id}"`:''} transform="translate(${m.x} ${m.y})"><title>${m.name}</title>${markerSymbol(m,overview?12:8,false,0,config.minimap.pulse&&states.minimap.waypoint===m.id)}${overview?`<text y="30" text-anchor="middle" font-size="16" fill="#fff4d3" stroke="#183025" stroke-width="3" paint-order="stroke">${m.name}</text>`:''}</g>`).join('');
    return `<svg class="${overview?'overview-map':'scene-map'}" viewBox="0 0 1000 700" preserveAspectRatio="${overview?'xMidYMid meet':'xMidYMid slice'}" ${overview?'aria-label="Area map. Choose Camp or Watchtower to track." role="group"':'aria-hidden="true"'}>${terrain()}${markers}<g transform="translate(${p.x} ${p.y}) rotate(${p.heading})"><circle r="26" fill="#f2ecd3" opacity=".12"/><path d="M0-18 13 12 0 6-13 12Z" fill="#fff6db" stroke="#203829" stroke-width="3"/></g></svg>`;
  }
  function renderMinimap() {
    const s=states.minimap, target=D.fixture.markers.find(m=>m.id===s.waypoint),distance=Math.round(Math.hypot(target.x-s.player.x,target.y-s.player.y));
    if(s.view==='overview')return `<div class="game-top"><div><small>EXPLORATION / AREA MAP</small><h2>East ridge</h2></div>${button('close-map','× Close map','back')}</div><div class="overview-body">${world(true)}<div class="overview-legend">${legend()}<span class="muted">Choose a goal · Tracking ${target.name}</span></div></div>`;
    return `${world()}<div class="scene-shade"></div><div class="explore-top"><p class="kicker">EXPLORATION / FIELD SURVEY</p><h2>East ridge</h2><div class="location">Heading ${s.player.heading}° · ${Math.round(s.player.x)}, ${Math.round(s.player.y)}</div></div><div class="minimap-dock"><button id="open-map" data-action="open-map" class="minimap-open ${config.minimap.shape==='square'?'square':''}" aria-label="Open area map">${minimap()}</button><div class="map-caption"><span>${config.minimap.framing==='full'?'Full frame':config.minimap.orientation==='north'?'North up':'Heading up'}</span><span>↗ Open map</span></div></div><div class="explore-bottom"><div class="route-info"><p class="kicker">TRACKED GOAL</p><h3>${target.name}</h3><p class="muted">${distance<35?'Arrived':distance+' m'} · ${config.minimap.edgeArrows?'Arrows at the edge show direction':'Distant markers hidden'}</p>${legend()}</div><div><div class="movement">${button('forward','↑','forward')}${button('turn-left','↶','left')}${button('backward','↓','backward')}${button('turn-right','↷','right')}</div><div class="key-hint">W / S move · A / D turn</div></div></div>`;
  }
  function campArt() { return `<svg class="camp-art" viewBox="0 0 350 280" aria-hidden="true"><ellipse cx="175" cy="230" rx="145" ry="25" fill="#10241b"/><path d="m60 225 112-169 125 169Z" fill="#958661" stroke="#c6b68b" stroke-width="2"/><path d="m172 56 36 169h89Z" fill="#625e44"/><path d="m127 225 48-118 33 118Z" fill="#1c3023"/><path d="m130 225 45-118" stroke="#d6c49b" stroke-width="2"/><path d="m65 225-29 27m257-27 30 27" stroke="#a6ad86"/><circle cx="250" cy="236" r="16" fill="#d8ab66" opacity=".7"/><path d="m236 246 29-18m-29 0 29 18" stroke="#645736" stroke-width="5"/><path d="M27 127 53 76l29 51Zm258-15 26-51 28 51Z" fill="#4d6348"/><path d="M53 118v59m258-74v48" stroke="#7c8262" stroke-width="5"/></svg>`; }
  function filteredItems(){
    const c=config.inventory;let xs=D.fixture.items.filter(i=>c.filter==='all'||i.kind===c.filter);
    return [...xs].sort((a,b)=>c.sort==='name'?a.name.localeCompare(b.name):c.sort==='power'?b.power-a.power||a.name.localeCompare(b.name):b.rarity-a.rarity||a.name.localeCompare(b.name));
  }
  function renderInventory() {
    const s=states.inventory,c=config.inventory, weapon=item(s.equipment.weapon),armor=item(s.equipment.armor);
    if(s.view==='camp')return `<div class="game-top"><div><small>RPG / OUTPOST</small><h2>Rowan’s camp</h2></div><span class="top-meta">Rank <strong>2</strong></span></div><div class="game-content camp">${campArt()}<div><p class="kicker">READY FOR THE TRAIL</p><h3>Your loadout</h3><p class="equipment-line">Weapon<b>${weapon.name}</b></p><p class="equipment-line">Armor<b>${armor.name}</b></p><div class="camp-stats"><span>Power<strong>${weapon.power+armor.power}</strong></span><span>Guard<strong>${weapon.guard+armor.guard}</strong></span></div><div class="game-actions">${button('open-inventory','Open inventory','primary')}</div></div></div>`;
    const selected=item(s.selected),equipped=selected&&s.equipment[selected.kind]===selected.id;
    const xs=filteredItems();
    const toolbar=['all','weapon','armor','consumable','material'].map(k=>`<button id="filter-${k}" class="chip" data-filter="${k}" aria-pressed="${c.filter===k}">${k==='all'?'All':k==='consumable'?'Supplies':k==='material'?'Materials':k==='weapon'?'Weapons':'Armor'}</button>`).join('');
    let detail=`<div class="empty-detail">${icon('armor','silver','large')}<span>Choose an item</span><p class="muted">Selection leaves your loadout intact.</p></div>`;
    if(selected){
      const current=item(s.equipment[selected.kind]),canEquip=!!current;
      const rows=canEquip?['power','guard'].map(stat=>`<tr><td>${stat==='power'?'Power':'Guard'}</td>${c.compare?`<td>${current[stat]}</td>`:''}<td>${selected[stat]}</td>${c.compare?`<td class="delta ${selected[stat]-current[stat]>0?'plus':selected[stat]-current[stat]<0?'minus':''}">${sign(selected[stat]-current[stat])}</td>`:''}</tr>`).join(''):'';
      detail=`${button('back-items','← Back to items','mobile-back back')}<div class="detail-heading">${icon(selected.icon,selected.tone)}<div><h3>${selected.name}</h3><div class="muted">${rarity[selected.rarity]} · ${selected.kind}</div></div></div><p class="muted">${selected.description}</p>${canEquip?`<table class="stats-table"><thead><tr><th>Stat</th>${c.compare?'<th>Equipped</th>':''}<th>Selected</th>${c.compare?'<th>Change</th>':''}</tr></thead><tbody>${rows}</tbody></table><p class="notice">${equipped?'Equipped':selected.rank>2?'Requires rank '+selected.rank:current.name+' → '+selected.name}</p>${button('equip',equipped?'Equipped':'Equip','primary',equipped||selected.rank>2)}`:`<p class="notice">Owned ×${selected.quantity}</p><span class="muted">${selected.kind==='material'?'Crafting material · retained in bag':'Supply · retained in bag'}</span>`}`;
    }
    return `<div class="game-top"><div><small>RPG / EQUIPMENT</small><h2>Inventory</h2></div>${button('close-inventory','× Close','back')}</div><div class="inventory-toolbar">${toolbar}</div><div class="inventory-layout ${selected?'has-selection':''}"><div class="item-collection ${c.layout} ${c.density==='compact'?'compact':''}">${xs.map(i=>`<button id="item-${i.id}" data-item="${i.id}" class="item-card" aria-pressed="${i.id===s.selected}" aria-label="Select ${i.name}${s.equipment[i.kind]===i.id?', equipped':''}">${icon(i.icon,i.tone)}<span class="item-name">${i.name}</span><span class="item-count">×${i.quantity}</span>${s.equipment[i.kind]===i.id?'<span class="equipped">Equipped</span>':''}</button>`).join('')}</div><div class="item-detail">${detail}</div></div>`;
  }
  function renderShop() {
    const s=states.shop,c=config.shop,selected=product(s.selected);
    const top=`<div class="game-top"><div><small>RPG / FIELD TRADER</small><h2>${s.view==='catalog'?'Supply shop':selected.name}</h2></div><span class="top-meta">Coins <strong id="coin-balance">${s.balance}</strong></span></div>`;
    if(s.view==='catalog')return top+`<div class="shop-body"><div class="shop-catalog"><div class="catalog-tabs"><button id="catalog-all" data-catalog="all" class="chip" aria-pressed="${c.catalog==='all'}">All items</button><button id="catalog-recommended" data-catalog="recommended" class="chip" aria-pressed="${c.catalog==='recommended'}">For this route</button></div><div class="product-list ${c.density==='compact'?'compact':''}">${D.fixture.products.filter(p=>c.catalog==='all'||p.recommended).map(p=>`<button id="product-${p.id}" class="product-card" data-product="${p.id}">${icon(p.icon,p.tone)}<span><b>${p.name}</b><span class="price">${p.price} coins</span><small>${c.showOwned?'Owned '+s.owned[p.id]+' · ':''}Stock ${s.stock[p.id]}</small>${c.catalog==='recommended'?`<small>${p.reason}</small>`:''}</span></button>`).join('')}</div></div><aside class="quick-buy" aria-label="Common supplies"><p>COMMON<br>SUPPLIES</p>${D.fixture.products.slice(0,2).map(p=>`<button id="quick-${p.id}" data-product="${p.id}" aria-label="Review ${p.name}">${icon(p.icon,p.tone)}<span>${p.price} coins</span></button>`).join('')}</aside></div>`;
    const total=selected.price*s.quantity,shortfall=Math.max(0,total-s.balance),max=Math.min(D.fixture.shop.quantityLimit,s.stock[selected.id]);
    let content=top+`<div class="shop-detail"><div class="product-showcase">${icon(selected.icon,selected.tone)}</div><div>${button('back-shop','← Back to shop','back')}<p class="muted">${selected.description}</p><p class="muted">${c.showOwned?'Owned '+s.owned[selected.id]+' · ':''}Stock ${s.stock[selected.id]}</p><div class="quantity" aria-label="Purchase quantity">${button('qty-minus','−','',s.quantity<=1)}<output id="quantity" aria-label="Quantity">${s.quantity}</output>${button('qty-plus','+','',s.quantity>=max)}</div><div class="cost-line"><span>Total</span><strong>${total} coins</strong></div><p class="notice">${max===0?'Out of stock':shortfall?'Need '+shortfall+' more coins':'Balance after purchase: '+(s.balance-total)}</p>${button('review-purchase','Review purchase','primary',shortfall>0||max===0)}</div></div>`;
    if(s.pending)content+=`<dialog id="purchase-dialog" class="game-dialog" aria-labelledby="purchase-title"><div class="dialog-close"><h3 id="purchase-title">Confirm purchase</h3>${button('cancel-purchase','×','ghost')}</div><div class="receipt">${icon(selected.icon,selected.tone)}<p>${s.pending.quantity} × ${selected.name}</p></div><div class="cost-line"><span>Spend</span><strong>${s.pending.total} coins</strong></div><p class="muted">Coins ${s.balance} → ${s.balance-s.pending.total}</p><p class="muted">Local game coins · simulated purchase</p><div class="game-actions">${button('cancel-review','Cancel')}${button('confirm-purchase','Confirm purchase','primary')}</div></dialog>`;
    if(s.receipt)content+=`<dialog id="receipt-dialog" class="game-dialog" aria-labelledby="receipt-title"><div class="success-mark" aria-hidden="true">✓</div><h3 id="receipt-title">Added to your bag</h3><p class="receipt">${s.receipt.quantity} × ${product(s.receipt.id).name}</p><p class="muted">Spent ${s.receipt.total} coins · ${s.balance} remaining</p><p class="notice">Owned ${s.owned[s.receipt.id]}</p><div class="game-actions">${button('continue-shop','Continue shopping','primary')}</div></dialog>`;
    return content;
  }
  function enemyArt(){return `<svg class="enemy-art" viewBox="0 0 200 190" aria-hidden="true"><ellipse cx="100" cy="174" rx="65" ry="11" fill="#0d2118"/><path d="m100 19 58 57-17 66-41 34-41-34-17-66Z" fill="#516954" stroke="#a6b292" stroke-width="3"/><path d="m100 19 17 76-17 81-17-81Z" fill="#758169"/><path d="M58 76h84l-19 30H77Z" fill="#1e3024"/><path d="M66 89h26m16 0h26" stroke="#e5bb7b" stroke-width="5"/><path d="m61 136 39-23 39 23" fill="none" stroke="#a6b292" stroke-width="3"/></svg>`;}
  function renderHud(){
    const s=states.hud,c=config.hud;
    let content=`<div class="hud-scene ${s.health<=30&&c.lowHealthCue?'low-health':''}"><div class="hud-top"><div class="health-box"><div class="health-label"><span>Rowan${s.health<=30&&c.lowHealthCue?' · LOW HEALTH':''}</span>${c.showNumbers?`<span id="hp-value">${s.health} / 100</span>`:''}</div>${c.healthDisplay==='bar'?`<div class="health-track" role="meter" aria-label="Health" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.health}"><div class="health-fill" style="width:${s.health}%"></div></div>`:`<div class="large-health">${s.health}<small class="muted"> HP</small></div>`}</div>${button('pause','Ⅱ Pause','',!!s.result)}</div><div>${enemyArt()}<div class="target-hp">Training sentry · ${s.enemyHealth} HP</div>${s.result?`<p class="hud-result">${s.result==='won'?'Encounter complete':'Downed'}</p>`:''}</div><div class="hud-bottom"><div><p class="kicker">TRAINING / LOCAL ENCOUNTER</p><span class="muted">${s.result?'Retry restores the encounter.':'Strike, recover, or pause the cooldown.'}</span></div><div class="combat-controls">${s.result?button('retry-combat','Retry encounter','primary'):`<button id="strike" data-action="strike" class="primary strike-button" ${s.cooldown>0?'disabled':''}>${c.cooldownDisplay==='radial'?'<span class="cooldown-indicator" aria-hidden="true"></span>':''}Strike<span id="cooldown-text" class="cooldown-text">${s.cooldown>0?(s.cooldown/1000).toFixed(1)+' s':'Ready · 12 damage'}</span></button>${button('heal','Heal · '+s.tonics,'',s.tonics===0||s.health>=100)}${button('incoming-hit','Take hit · −24')}`}</div></div></div>`;
    if(s.paused)content+=`<dialog id="pause-dialog" class="game-dialog" aria-labelledby="pause-title"><h3 id="pause-title">Encounter paused</h3><p class="muted">Cooldown stays at ${(s.cooldown/1000).toFixed(1)} seconds.</p><div class="game-actions">${button('resume','Resume','primary')}</div></dialog>`;
    return content;
  }
  function portraitArt(){return `<svg class="portrait-art" viewBox="0 0 240 280" aria-hidden="true"><circle cx="120" cy="131" r="102" fill="#304935"/><path d="M38 268 57 195l63-23 62 23 22 73Z" fill="#70866a" stroke="#adc09c" stroke-width="2"/><path d="m86 174 34 38 35-38" fill="#afbf99"/><path d="m101 211-8 57h55l-9-57Z" fill="#3b553d"/><path d="M78 85v56l20 38h43l21-38V85Z" fill="#c7b895"/><path d="m71 86 15-33 39-18 43 31 1 35-41-18-57 26Z" fill="#56624c"/><path d="M62 73q60-51 122 0l-10 17H70Z" fill="#8d9e78"/><path d="m89 117 20-2m25 0 18 2" stroke="#444d3a" stroke-width="3"/><path d="m119 122-5 23h12m-21 12h30" fill="none" stroke="#8b7d5f" stroke-width="2"/><path d="m54 194 24 29-27 40m131-69-22 29 27 40" fill="none" stroke="#a9b690" stroke-width="3"/><circle cx="166" cy="220" r="9" fill="#d9b575"/></svg>`;}
  function renderDialogue(){
    const s=states.dialogue,c=config.dialogue,q=D.fixture.quest;
    let text,choices;
    if(s.view==='talk'){text='The mist is moving in. Bring me three samples before the trail closes.';choices=button('accept-quest','Accept contract','primary')+button('ask-reward','What is the reward?')+button('leave-talk','Leave');}
    if(s.view==='reward'){text='Eighty coins for three samples. I will pay when you return.';choices=button('accept-quest','Accept contract','primary')+button('back-talk','← Back');}
    if(s.view==='trail'){text=s.accepted?`Mist samples collected: ${s.collected} / ${q.required}.`:'The trail is quiet. The ranger is still at camp.';choices=s.accepted?button('collect-sample',s.collected===q.required?'All samples collected':'Collect sample','primary',s.collected===q.required)+button('return-ranger','Return to ranger'):button('return-ranger','Talk to ranger','primary');}
    if(s.view==='return'){text=s.collected===q.required?'You made it back. Here is your payment.':`You still need ${q.required-s.collected} samples. Come back when you have them.`;choices=s.collected===q.required?button('claim-reward','Claim 80 coins','primary'):button('continue-quest','Return to trail','primary');}
    if(s.claimed){text='Contract complete. Your reward is in your pouch.';choices=button('return-trail','Back to trail');}
    return `<div class="game-top"><div><small>RPG / DIALOGUE & QUEST</small><h2>Mistwatch camp</h2></div><span class="top-meta">Coins <strong>${s.balance}</strong></span></div>${c.objectiveTracker&&s.accepted&&!s.claimed?`<div class="quest-track"><span>${q.title} · ${s.collected} / ${q.required}</span><div class="quest-progress" aria-hidden="true">${Array.from({length:q.required},(_,i)=>`<i class="${i<s.collected?'filled':''}"></i>`).join('')}</div></div>`:''}<div class="dialogue-scene">${s.view==='trail'&&!s.claimed?campArt():portraitArt()}<div><p class="speaker">${s.view==='trail'?'THE TRAIL':'RANGER IVA'}</p><p class="dialogue-text">${text}</p><div class="choices ${c.choices==='inline'?'inline':''}">${choices}</div>${s.claimed?'<p class="notice">Reward claimed · +80 coins</p>':''}</div></div>`;
  }
  const renders={minimap:renderMinimap,inventory:renderInventory,shop:renderShop,hud:renderHud,dialogue:renderDialogue};
  function renderGame(focusId) {
    const active=document.activeElement, previous=active&&$('game').contains(active)?active.id:null;
    $('game').innerHTML=renders[station]();$('game').dataset.station=station;$('preview-label').textContent=labels[station];
    $('game').querySelectorAll('dialog').forEach(d=>{
      d.showModal();d.addEventListener('cancel',e=>{e.preventDefault();if(d.id==='purchase-dialog')cancelPurchase();else if(d.id==='receipt-dialog')continueShop();else resume();});
      const target=d.querySelector(d.id==='purchase-dialog'?'[data-action="cancel-review"]':'button');target?.focus();
    });
    if(!$('game').querySelector('dialog')){
      const node=$(focusId||previous);if(node&&!node.disabled&&node.getClientRects().length)node.focus({preventScroll:true});else if(focusId==='game'||previous)$('game').focus({preventScroll:true});
    }
    if(station==='hud')updateCooldown();
  }
  function segment(key,title,options,disabled=false){const c=config[station];return `<div class="setting"><span class="setting-title" id="setting-${key}">${title}</span><div class="segmented" role="group" aria-labelledby="setting-${key}">${options.map(([v,label])=>`<button data-setting="${key}" data-value="${v}" aria-pressed="${c[key]===v}" ${disabled?'disabled':''}>${label}</button>`).join('')}</div></div>`;}
  function select(key,title,options){return `<div class="setting"><label for="setting-${key}">${title}</label><select id="setting-${key}" data-setting="${key}">${options.map(([v,label])=>`<option value="${v}" ${config[station][key]===v?'selected':''}>${label}</option>`).join('')}</select></div>`;}
  function check(key,title){return `<label class="check-line"><input type="checkbox" data-setting="${key}" ${config[station][key]?'checked':''}>${title}</label>`;}
  function range(key,title,min,max,step,disabled=false){return `<div class="setting"><label for="setting-${key}">${title}</label><div class="range-line"><input id="setting-${key}" data-setting="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${config[station][key]}" ${disabled?'disabled':''}><output for="setting-${key}">${config[station][key]}×</output></div></div>`;}
  function renderSettings(){
    let html='';const full=config.minimap.framing==='full';
    if(station==='minimap')html=`<div class="setting"><label for="map-preset">Authored design preset</label><select id="map-preset"><option value="custom">Custom settings</option><option value="scout">Trail scout</option><option value="lookout">Raid lookout</option></select><p class="setting-note">Same scene, different information needs.</p></div>${segment('orientation','Orientation',[['north','North up'],['heading','Heading up']],full)}${range('zoom','Zoom',.7,2.8,.1,full)}${segment('shape','Shape',[['circle','Circle'],['square','Square']])}${segment('framing','Framing',[['follow','Follow player'],['full','Full frame']])}${full?'<p class="setting-note">Full frame shows the area and stops following. Rotation and zoom are inactive.</p>':''}<div class="setting">${check('edgeArrows','Offscreen direction arrows')}</div><details class="advanced"><summary>Marker details</summary><div class="setting">${check('enemies','Enemies ◆')}${check('allies','Allies ●')}${check('objectives','Objectives ▲')}</div>${range('iconScale','Marker size',.7,1.6,.1)}<div class="setting">${check('pulse','Tracked objective pulse')}</div>${select('objectiveMaps','Objective visible on',[['both','Both maps'],['minimap','Minimap only'],['overview','Area map only']])}<p class="setting-note">Arrows on the rim indicate direction. Inner marks show map positions.</p></details>`;
    if(station==='inventory')html=`${segment('layout','Item layout',[['grid','Grid'],['list','List']])}${select('sort','Sort by',[['rarity','Rarity'],['name','Name'],['power','Power']])}${select('filter','Show items',[['all','All items'],['weapon','Weapons'],['armor','Armor'],['consumable','Supplies'],['material','Materials']])}${segment('density','Density',[['roomy','Roomy'],['compact','Compact']])}<div class="setting">${check('compare','Compare equipped stats')}</div><p class="setting-note">Open the bag. Select gear, then Equip. Close returns to your updated loadout.</p>`;
    if(station==='shop')html=`${segment('catalog','Catalog',[['all','All items'],['recommended','For this route']])}${segment('density','Item density',[['roomy','Roomy'],['compact','Compact']])}<div class="setting">${check('showOwned','Show owned count')}</div><p class="setting-note">Select an item. Adjust quantity. Review, then confirm or cancel. Coins stay local.</p><details class="advanced"><summary>Reach the blocked state</summary><p class="setting-note">The Survey lens costs 420 coins. Your starting balance is 260. Or raise the quantity of any supply.</p></details>`;
    if(station==='hud')html=`${segment('healthDisplay','Health',[['bar','Bar'],['number','Number']])}<div class="setting">${check('showNumbers','Exact health count')}</div>${segment('cooldownDisplay','Cooldown',[['radial','Radial + time'],['time','Time only']])}<div class="setting">${check('lowHealthCue','Low-health warning')}</div><p class="setting-note">Strike starts a 2.5 s cooldown. Pause freezes it. A hit or heal changes health immediately.</p>`;
    if(station==='dialogue')html=`${segment('choices','Choice layout',[['stack','Stack'],['inline','Inline']])}<div class="setting">${check('objectiveTracker','Show quest progress')}</div><p class="setting-note">Ask about the reward, accept, collect three samples, return, and claim once.</p>`;
    $('settings').innerHTML=html;$('export-status').textContent='';
  }
  function choose(s){station=s;document.querySelectorAll('[data-station]').forEach(b=>{if(b.dataset.station===s)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});renderSettings();renderGame();say({minimap:'Move, turn, or open the minimap.',inventory:'Open inventory to compare your equipment.',shop:'Choose an item to review a local purchase.',hud:'Try a strike, hit, heal, and pause.',dialogue:'Talk, collect, return, and claim.'}[s]);}
  function setting(key,value){config[station][key]=value;
    if(station==='inventory'&&key==='filter'){states.inventory.selected=null;}
    renderGame();
    if(key==='framing'){const focusedKey=document.activeElement?.dataset.setting;renderSettings();if(focusedKey)$('settings').querySelector(`[data-setting="${focusedKey}"][aria-pressed="true"]`)?.focus();}
    else $('settings').querySelectorAll(`[data-setting="${key}"]`).forEach(el=>{if(el.tagName==='BUTTON')el.setAttribute('aria-pressed',String(el.dataset.value===value));if(el.tagName==='SELECT')el.value=value;if(el.type==='range')el.nextElementSibling.textContent=value+'×';});
    const preset=$('map-preset');if(preset)preset.value='custom';
    say('Preview updated.');
  }
  function cancelPurchase(){states.shop.pending=null;renderGame('review-purchase');say('Purchase cancelled. Coins and stock unchanged.');}
  function continueShop(){const s=states.shop;s.receipt=null;s.view='catalog';renderGame('product-'+s.selected);say('Purchase complete. Your updated balance and owned count are shown.');}
  function resume(){states.hud.paused=false;renderGame('pause');say('Encounter resumed.');}
  function act(id){
    const s=states[station];
    if(station==='minimap'){
      if(id==='open-map'){s.view='overview';renderGame('close-map');say('Area map opened. Choose a goal to track.');return;}
      if(id==='close-map'){s.view='trail';renderGame('open-map');say('Returned to the trail.');return;}
      if(s.view!=='trail')return;
      if(id==='turn-left')s.player.heading=(s.player.heading+315)%360;
      if(id==='turn-right')s.player.heading=(s.player.heading+45)%360;
      if(id==='forward'||id==='backward'){const f=id==='forward'?1:-1,r=s.player.heading*Math.PI/180;s.player.x=Math.max(30,Math.min(970,s.player.x+Math.sin(r)*35*f));s.player.y=Math.max(30,Math.min(670,s.player.y-Math.cos(r)*35*f));}
      renderGame();say('Heading '+s.player.heading+'° · position '+Math.round(s.player.x)+', '+Math.round(s.player.y));
    }
    if(station==='inventory'){
      if(id==='open-inventory'){s.view='bag';renderGame(s.selected?'equip':'item-brass');say('Bag opened. Selecting an item preserves equipment.');}
      if(id==='close-inventory'){s.view='camp';renderGame('open-inventory');say('Returned to camp. Committed equipment is retained.');}
      if(id==='back-items'){const selected=s.selected;s.selected=null;renderGame('item-'+selected);say('Returned to items.');}
      if(id==='equip'&&s.view==='bag'){const selected=item(s.selected);if(!selected||!['weapon','armor'].includes(selected.kind)||selected.rank>2||s.equipment[selected.kind]===selected.id)return;s.equipment[selected.kind]=selected.id;renderGame('close-inventory');say(selected.name+' equipped.');}
    }
    if(station==='shop'){
      const p=product(s.selected),max=p?Math.min(s.stock[p.id],D.fixture.shop.quantityLimit):0;
      if(id==='back-shop'){s.pending=null;s.view='catalog';renderGame('product-'+s.selected);say('Returned to shop. No coins spent.');}
      if(id==='qty-minus'||id==='qty-plus'){if(!p||s.pending||s.receipt)return;s.quantity=Math.max(1,Math.min(Math.max(1,max),s.quantity+(id==='qty-plus'?1:-1)));renderGame(id==='qty-plus'&&s.quantity>=max?'qty-minus':id==='qty-minus'&&s.quantity<=1?'qty-plus':id);say('Quantity '+s.quantity+'. Total '+p.price*s.quantity+' coins.');}
      if(id==='review-purchase'&&p&&!s.pending&&!s.receipt&&s.quantity<=s.stock[p.id]&&p.price*s.quantity<=s.balance){s.pending={id:p.id,quantity:s.quantity,total:p.price*s.quantity};renderGame();say('Review only. Coins have not been spent.');}
      if(id==='cancel-purchase'||id==='cancel-review')cancelPurchase();
      if(id==='confirm-purchase'&&s.pending){const pending=s.pending;if(pending.total>s.balance||pending.quantity>s.stock[pending.id]){s.pending=null;renderGame('back-shop');say('Purchase unavailable. Choose another quantity.');return;}s.balance-=pending.total;s.stock[pending.id]-=pending.quantity;s.owned[pending.id]+=pending.quantity;s.transactions++;s.receipt=clone(pending);s.pending=null;renderGame();say('Purchased '+pending.quantity+' × '+product(pending.id).name+'.');}
      if(id==='continue-shop')continueShop();
    }
    if(station==='hud'){
      if(id==='pause'&&!s.result){s.paused=true;renderGame();say('Paused. Cooldown is frozen.');return;}
      if(id==='resume'){resume();return;}
      if(id==='retry-combat'){init('hud');renderGame('strike');say('Fresh encounter.');return;}
      if(s.paused||s.result)return;
      if(id==='strike'&&s.cooldown<=0){s.enemyHealth=Math.max(0,s.enemyHealth-D.fixture.combat.strikeDamage);s.cooldown=D.fixture.combat.cooldownMs;s.strikes++;if(s.enemyHealth===0)s.result='won';renderGame('incoming-hit');say('Strike landed. Sentry has '+s.enemyHealth+' health.');}
      if(id==='incoming-hit'){s.health=Math.max(0,s.health-D.fixture.combat.incomingDamage);if(s.health===0)s.result='lost';renderGame(s.result?'retry-combat':id);say(s.result?'Downed. Retry the encounter.':'Hit received. Health '+s.health+'.');}
      if(id==='heal'&&s.tonics>0&&s.health<100){s.health=Math.min(100,s.health+D.fixture.combat.healAmount);s.tonics--;renderGame('incoming-hit');say('Healed. '+s.tonics+' tonics remain.');}
    }
    if(station==='dialogue'){
      if(id==='ask-reward')s.view='reward';if(id==='back-talk')s.view='talk';if(id==='leave-talk')s.view='trail';
      if(id==='accept-quest'&&!s.accepted){s.accepted=true;s.view='trail';say('Contract accepted.');}
      if(id==='collect-sample'&&s.accepted&&s.collected<D.fixture.quest.required&&!s.claimed){s.collected++;say('Sample '+s.collected+' / 3 collected.');}
      if(id==='return-ranger')s.view=s.accepted?'return':'talk';
      if(id==='continue-quest'||id==='return-trail')s.view='trail';
      if(id==='claim-reward'&&s.accepted&&s.collected===D.fixture.quest.required&&!s.claimed){s.claimed=true;s.balance+=D.fixture.quest.reward;say('Reward claimed. +80 coins.');}
      renderGame(id==='collect-sample'&&s.collected===3?'return-ranger':id==='claim-reward'?'return-trail':'game');
    }
  }
  document.querySelector('.stations').addEventListener('click',e=>{const b=e.target.closest('[data-station]');if(b)choose(b.dataset.station);});
  $('settings').addEventListener('click',e=>{const b=e.target.closest('button[data-setting]');if(b&&!b.disabled)setting(b.dataset.setting,b.dataset.value);});
  $('settings').addEventListener('input',e=>{const el=e.target;if(!el.dataset.setting||el.tagName==='BUTTON')return;setting(el.dataset.setting,el.type==='checkbox'?el.checked:el.type==='range'?Number(el.value):el.value);});
  $('settings').addEventListener('change',e=>{if(e.target.id!=='map-preset'||e.target.value==='custom')return;const preset=e.target.value;Object.assign(config.minimap,preset==='scout'?{orientation:'north',zoom:1.1,shape:'circle',framing:'follow',edgeArrows:true,enemies:false,allies:true,objectives:true,iconScale:1,pulse:true,objectiveMaps:'both'}:{orientation:'heading',zoom:2.3,shape:'square',framing:'follow',edgeArrows:true,enemies:true,allies:true,objectives:true,iconScale:1.3,pulse:false,objectiveMaps:'both'});renderSettings();$('map-preset').value=preset;$('map-preset').focus();renderGame();say('Authored preset applied to the same scene.');});
  $('game').addEventListener('click',e=>{
    const target=e.target.closest('[data-action],[data-item],[data-product],[data-filter],[data-catalog],[data-waypoint]');if(!target||target.disabled)return;
    if(target.dataset.action){act(target.dataset.action);return;}
    if(target.dataset.item){states.inventory.selected=target.dataset.item;renderGame($('game').clientWidth<=620?'back-items':'item-'+target.dataset.item);say(item(target.dataset.item).name+' selected. Equipment unchanged.');}
    if(target.dataset.product){const s=states.shop;s.selected=target.dataset.product;s.view='detail';s.quantity=1;s.receipt=null;renderGame('back-shop');say(product(s.selected).name+' selected. No coins spent.');}
    if(target.dataset.filter){setting('filter',target.dataset.filter);renderSettings();}
    if(target.dataset.catalog){setting('catalog',target.dataset.catalog);}
    if(target.dataset.waypoint){states.minimap.waypoint=target.dataset.waypoint;renderGame('close-map');say('Tracking '+D.fixture.markers.find(m=>m.id===target.dataset.waypoint).name+'.');}
  });
  $('viewport').addEventListener('change',e=>{$('frame').dataset.view=e.target.value;say('Preview framing updated. Browser viewport is unchanged.');});
  $('play-view').addEventListener('click',()=>{
    const focused=document.body.dataset.playView!=='true';document.body.dataset.playView=String(focused);$('play-view').setAttribute('aria-pressed',String(focused));$('play-view').textContent=focused?'← Exit play view':'Play view ↗';
    if(focused){$('viewport').value='adaptive';$('frame').dataset.view='adaptive';}window.scrollTo(0,0);say(focused?'Play view opened. Settings and state retained.':'Returned to live settings.');
  });
  $('reset').addEventListener('click',()=>{init(station);config[station]=clone(D.config[station]);renderSettings();renderGame();say(labels[station]+' reset. Other examples retained.');});
  $('export').addEventListener('click',()=>{const data={...clone(config),preview:$('viewport').value};const blob=new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='game-ui-settings.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('export-status').textContent='Settings JSON downloaded.';});
  document.addEventListener('keydown',e=>{
    if($('game').querySelector('dialog[open]'))return;
    const el=document.activeElement;
    if(e.key==='Escape'){
      if(station==='minimap'&&states.minimap.view==='overview'){e.preventDefault();act('close-map');}
      if(station==='inventory'&&states.inventory.view==='bag'){e.preventDefault();if(states.inventory.selected&&matchMedia('(max-width:620px)').matches||states.inventory.selected&&$('game').clientWidth<=620)act('back-items');else act('close-inventory');}
      if(station==='shop'&&states.shop.view==='detail'){e.preventDefault();act('back-shop');}
      if(station==='hud'&&!states.hud.result){e.preventDefault();act('pause');}
      if(station==='dialogue'&&(states.dialogue.view==='reward'||states.dialogue.view==='talk')){e.preventDefault();act(states.dialogue.view==='reward'?'back-talk':'leave-talk');}
      return;
    }
    const waypoint=el?.dataset.waypoint;if(waypoint&&(e.key==='Enter'||e.key===' ')){e.preventDefault();states.minimap.waypoint=waypoint;renderGame('close-map');say('Tracked goal updated.');return;}
    if(!$('game').contains(el)||['INPUT','SELECT','TEXTAREA'].includes(el.tagName))return;
    if(station==='minimap'&&states.minimap.view==='trail'){const map={w:'forward',ArrowUp:'forward',s:'backward',ArrowDown:'backward',a:'turn-left',ArrowLeft:'turn-left',d:'turn-right',ArrowRight:'turn-right'};if(map[e.key]){e.preventDefault();act(map[e.key]);}}
    if(station==='inventory'&&states.inventory.view==='camp'&&e.key.toLowerCase()==='i'){e.preventDefault();act('open-inventory');}
  });
  function updateCooldown(){const s=states.hud,b=$('strike'),t=$('cooldown-text');if(!b||!t)return;b.disabled=s.cooldown>0;t.textContent=s.cooldown>0?(s.cooldown/1000).toFixed(1)+' s':'Ready · 12 damage';const ring=b.querySelector('.cooldown-indicator');if(ring)ring.style.setProperty('--progress',Math.round(100*(1-s.cooldown/D.fixture.combat.cooldownMs))+'%');}
  let last=performance.now();setInterval(()=>{const now=performance.now(),delta=Math.min(500,now-last);last=now;const s=states.hud;if(station==='hud'&&!s.paused&&!s.result&&s.cooldown>0){s.cooldown=Math.max(0,s.cooldown-delta);updateCooldown();}},50);
  window.gamePlayground=Object.freeze({snapshot:()=>clone({station,config,states,preview:$('viewport').value})});
  renderSettings();renderGame();
})();
