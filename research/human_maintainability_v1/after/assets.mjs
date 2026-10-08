// Authored vector geometry only. This module neither reads the DOM nor issues orders.
export const shipShapes = {
  cruiser: '<path d="M0-22 13-6 10 13 0 21-10 13-13-6Z"/><path class="ship-detail" d="M0-15V14M-7 1H7"/>',
  frigate: '<path d="M0-20 10 0 8 16 0 11-8 16-10 0Z"/><path class="ship-detail" d="M0-11V9M-6 1H6"/>',
  tender: '<path d="M0-15 13-5 13 10 0 17-13 10-13-5Z"/><path class="ship-detail" d="M-8-2H8M-8 4H8M0-9V11"/>'
};
export function worldMarkup(fixture, variant) {
  const stars = fixture.stars.map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
  return `<svg class="world" viewBox="0 0 960 680" preserveAspectRatio="none" aria-hidden="true">
    <defs><radialGradient id="${variant}-nebula"><stop stop-color="#295169" stop-opacity=".33"/><stop offset="1" stop-color="#0c1821" stop-opacity="0"/></radialGradient><pattern id="${variant}-grid" width="120" height="85" patternUnits="userSpaceOnUse"><path d="M120 0H0V85" fill="none" stroke="#536574" stroke-opacity=".13"/></pattern></defs>
    <rect width="960" height="680" fill="#08141d"/><ellipse cx="474" cy="354" rx="550" ry="348" fill="url(#${variant}-nebula)"/><rect width="960" height="680" fill="url(#${variant}-grid)"/>
    <g fill="#bdd0d9" opacity=".6">${stars}</g>
    <g fill="none" stroke="#496570" opacity=".3"><ellipse cx="568" cy="453" rx="195" ry="137" stroke-dasharray="3 9"/><ellipse cx="568" cy="453" rx="278" ry="195"/><path d="M100 557 180 521 267 531 313 489"/></g>
    <g fill="#809eaa" font-size="11" font-family="monospace" opacity=".65"><text x="29" y="41">OUTER RELAY / SECTOR 07</text><text x="29" y="651">NAV GRID 960 × 680</text><text x="770" y="651">SYNTHETIC SCENE</text></g>
    <g class="fixture-movement" fill="none" stroke="#4e8caa" stroke-width="1.6" stroke-dasharray="6 8"><path d="M185 165 270 246"/><path d="M327 304 392 352"/></g>
    <path class="fixture-firing" d="M392 352 647 269" fill="none" stroke="#ab6a56" stroke-width="1.6" stroke-dasharray="2 7"/>
    <g class="orders"></g><g class="preview-lines"></g>
  </svg>`;
}
