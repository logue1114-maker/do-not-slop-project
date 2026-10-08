import { loadFixture } from './platform.mjs';
import { mountFleet } from './application.mjs';

// Browser entry point. Loading must finish before any scene or input is mounted.
const fixture = await loadFixture(url => fetch(url));
const application = mountFleet(document, fixture);
// Keep the original public hook and clone isolation exactly.
window.fleetDemo = application.api;

// Teardown is for hosts/tests that remove this page; normal demo behavior is unchanged.
export function dispose() {
  application.dispose();
  if (window.fleetDemo === application.api) delete window.fleetDemo;
}
