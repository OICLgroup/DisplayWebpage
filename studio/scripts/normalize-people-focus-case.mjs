import { getCliClient } from 'sanity/cli';

// Sentence case for English research-focus labels; preserve technical acronyms.
const changes = [
  ['person-suresh-chejarla', 'Optical Switching and Computing based on LCOS-SLM', 'Optical switching and computing based on LCOS-SLM'],
  ['person-cao-chen', 'Optical Networks, Physical Layer Modelling, Collective Communication', 'Optical networks, physical layer modelling, collective communication'],
  ['person-hum-nath-parajuli', 'short reach optical communication', 'Short reach optical communication'],
  ['person-wang-xinghua', 'Optical Switching Technology', 'Optical switching technology'],
  ['person-siqian-yang', 'Optical Switching and Processing', 'Optical switching and processing'],
  ['person-wang-xinping', 'fiber-optic communications', 'Fiber-optic communications'],
  ['person-fan-minwei', 'optical networking', 'Optical networking'],
  ['person-kuang-zilin', 'short reach optical communication', 'Short reach optical communication'],
  ['person-xie-xiaolan', 'optical networking', 'Optical networking']
];

async function main() {
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ dataset: 'production' });
  for (const [id, before, after] of changes) {
    const person = await client.getDocument(id);
    if (!person || (person.focus !== before && person.focus !== after)) {
      throw new Error(`Unexpected research focus for ${id}; review it before updating.`);
    }
    if (person.focus === after) continue;
    await client.patch(id).ifRevisionId(person._rev).set({ focus: after }).commit();
    console.log(`${person.name}: ${after}`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
