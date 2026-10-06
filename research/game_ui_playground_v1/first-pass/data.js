window.PLAYGROUND_DATA = {
  config: {
    schemaVersion: '1.0', language: 'en', artifactType: 'authored-design-proposal',
    minimap: { orientation: 'north', zoom: 1.4, shape: 'circle', framing: 'follow', edgeArrows: true, enemies: true, allies: true, objectives: true, iconScale: 1, pulse: true, objectiveMaps: 'both' },
    inventory: { layout: 'grid', sort: 'rarity', filter: 'all', compare: true, density: 'roomy' },
    shop: { catalog: 'all', density: 'roomy', showOwned: true },
    hud: { healthDisplay: 'bar', showNumbers: true, cooldownDisplay: 'radial', lowHealthCue: true },
    dialogue: { choices: 'stack', objectiveTracker: true }
  },
  fixture: {
    player: { name: 'Rowan', rank: 2, x: 480, y: 365, heading: 30 },
    markers: [
      { id: 'tower', name: 'Watchtower', type: 'objective', x: 825, y: 135 },
      { id: 'camp', name: 'Camp', type: 'objective', x: 365, y: 325 },
      { id: 'ally-a', name: 'Scout', type: 'ally', x: 515, y: 300 },
      { id: 'ally-b', name: 'Ranger', type: 'ally', x: 200, y: 480 },
      { id: 'enemy-a', name: 'Sentry', type: 'enemy', x: 580, y: 340 },
      { id: 'enemy-b', name: 'Patrol', type: 'enemy', x: 740, y: 580 }
    ],
    items: [
      { id: 'reed', name: 'Reed blade', kind: 'weapon', rarity: 1, power: 8, guard: 2, rank: 1, quantity: 1, icon: 'sword', tone: 'silver', description: 'A light field blade.' },
      { id: 'brass', name: 'Brass sabre', kind: 'weapon', rarity: 2, power: 14, guard: 1, rank: 2, quantity: 1, icon: 'sword', tone: 'gold', description: 'A heavier edge. Less guard.' },
      { id: 'anchor', name: 'Anchor axe', kind: 'weapon', rarity: 3, power: 22, guard: 4, rank: 3, quantity: 1, icon: 'axe', tone: 'coral', description: 'Requires a stronger grip.' },
      { id: 'linen', name: 'Linen vest', kind: 'armor', rarity: 1, power: 0, guard: 5, rank: 1, quantity: 1, icon: 'armor', tone: 'silver', description: 'Simple travel gear.' },
      { id: 'scale', name: 'Scale coat', kind: 'armor', rarity: 2, power: 0, guard: 9, rank: 2, quantity: 1, icon: 'armor', tone: 'teal', description: 'Lightweight plated protection.' },
      { id: 'tonic', name: 'Field tonic', kind: 'consumable', rarity: 1, power: 0, guard: 0, rank: 1, quantity: 4, icon: 'bottle', tone: 'teal', description: 'Restores 30 health.' },
      { id: 'ration', name: 'Trail ration', kind: 'consumable', rarity: 1, power: 0, guard: 0, rank: 1, quantity: 2, icon: 'ration', tone: 'gold', description: 'Food for the next journey.' },
      { id: 'ore', name: 'Copper ore', kind: 'material', rarity: 1, power: 0, guard: 0, rank: 1, quantity: 8, icon: 'ore', tone: 'coral', description: 'A crafting material.' },
      { id: 'crystal', name: 'Mist crystal', kind: 'material', rarity: 3, power: 0, guard: 0, rank: 1, quantity: 1, icon: 'crystal', tone: 'teal', description: 'A rare trade material.' }
    ],
    equipment: { weapon: 'reed', armor: 'linen' },
    products: [
      { id: 'tonic', name: 'Field tonic', price: 40, stock: 12, icon: 'bottle', tone: 'teal', description: 'Restores 30 health.', reason: 'Useful after a tough encounter.', recommended: true },
      { id: 'ward', name: 'Trail beacon', price: 90, stock: 6, icon: 'beacon', tone: 'gold', description: 'Marks one route in the local simulation.', reason: 'Useful on an unfamiliar trail.', recommended: true },
      { id: 'boots', name: 'Ranger boots', price: 180, stock: 3, icon: 'boots', tone: 'silver', description: 'A sturdy pair for long patrols.', reason: 'Travel gear for this route.', recommended: false },
      { id: 'lens', name: 'Survey lens', price: 420, stock: 2, icon: 'lens', tone: 'coral', description: 'A precision instrument for distant terrain.', reason: 'Specialist survey equipment.', recommended: false }
    ],
    shop: { balance: 260, quantityLimit: 9, owned: { tonic: 1, ward: 0, boots: 0, lens: 0 } },
    combat: { health: 100, enemyHealth: 30, tonics: 2, strikeDamage: 12, incomingDamage: 24, healAmount: 30, cooldownMs: 2500 },
    quest: { title: 'The mist samples', required: 3, reward: 80 }
  }
};
