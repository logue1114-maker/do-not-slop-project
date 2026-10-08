import { deepFreeze } from './state.mjs';

/** Load the trusted bundled fixture. Network/JSON failures reject unchanged.
 * The relative URL deliberately keeps the baseline page-relative resolution.
 * fetchFixture is injectable for tests; no retry, fallback, or new UI is added.
 */
export async function loadFixture(fetchFixture) {
  const fixture = await fetchFixture('./fixture.json').then(response => {
    if (!response.ok) throw new Error('Could not load the shared fixture');
    return response.json();
  });
  return deepFreeze(fixture);
}
