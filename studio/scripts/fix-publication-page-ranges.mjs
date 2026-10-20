import { getCliClient } from 'sanity/cli';

// Correct four page ranges damaged by a character encoding error during import.
// The exact old values and document revisions are checked before each write.
const corrections = [
  {
    id: 'publication-liu-5g-2019',
    oldVenue: 'Optical Fiber Telecommunications VII, Elsevier, pp. 751鈥?83',
    newVenue: 'Optical Fiber Telecommunications VII, Elsevier, pp. 751–783'
  },
  {
    id: 'publication-liu-globecom-2025',
    oldVenue: 'IEEE Global Communications Conference (GLOBECOM), pp. 4077鈥?082',
    newVenue: 'IEEE Global Communications Conference (GLOBECOM), pp. 4077–4082'
  },
  {
    id: 'publication-liu-resilient-ocs-2026',
    oldVenue: 'IEEE International Conference on Communications (ICC), 1鈥?',
    newVenue: 'IEEE International Conference on Communications (ICC), 1–6'
  },
  {
    id: 'publication-parajuli-recursive-filtering-2026',
    oldVenue: 'Optics Express, 34, 19214鈥?9229',
    newVenue: 'Optics Express, 34, 19214–19229'
  }
];

async function main() {
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ dataset: 'production' });
  for (const { id, oldVenue, newVenue } of corrections) {
    const document = await client.getDocument(id);
    if (!document) throw new Error(`Missing publication: ${id}`);
    if (document.venue === newVenue) {
      console.log(`Already corrected: ${id}`);
      continue;
    }
    if (document.venue !== oldVenue) {
      throw new Error(`Unexpected venue for ${id}: ${document.venue}`);
    }
    await client.patch(id).ifRevisionId(document._rev).set({ venue: newVenue }).commit();
    console.log(`Corrected: ${id}`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
