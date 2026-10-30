import { getCliClient } from 'sanity/cli';

// Items numbered in the supplied Liu Yuanhao biography (2026-10-31).
// Remove them from his profile and hide matching publication documents from Outcomes.
const removedRecords = new Map([
  ['liu-journal-06', 'Cost-Oriented and Delay-Constrained Anycasting'],
  ['liu-journal-11', 'A Two-Stage Scheduling Algorithm'],
  ['liu-journal-14', 'Earth Observation Satellite Downlink Scheduling'],
  ['liu-journal-15', 'A Multi-Objective Dynamic Mission-Scheduling Algorithm'],
  ['liu-journal-16', 'A VNF Sharing Method Based on Node Selection Probability'],
  ['liu-journal-18', '基于ESWO的敏捷对地观测卫星任务调度算法'],
  ['liu-journal-19', '面向卫星互联网的弹性光网络动态路由和频谱分配算法研究'],
  ['liu-conference-08', 'Anycast Service Function Chain Provisioning'],
  ['liu-patent-01', '一种混合激光声波的水下网络的初始化方法']
]);

const outcomesPublications = new Map([
  ['publication-liu-cv-2025-1e699934997a', 'Cost-Oriented and Delay-Constrained Anycasting'],
  ['publication-liu-cv-2025-c8f719a92c29', 'A Two-Stage Scheduling Algorithm'],
  ['publication-liu-cv-2025-423ffd79e4b7', 'Earth Observation Satellite Downlink Scheduling'],
  ['publication-liu-cv-2024-25c6565b8504', 'A Multi-Objective Dynamic Mission-Scheduling Algorithm'],
  ['publication-liu-cv-2025-b1ecdc09422a', 'A VNF Sharing Method Based on Node Selection Probability'],
  ['publication-liu-cv-2024-674ffd7ae36c', '基于ESWO的敏捷对地观测卫星任务调度算法'],
  ['publication-liu-cv-2024-25b34edf3112', '面向卫星互联网的弹性光网络动态路由和频谱分配算法研究'],
  ['publication-liu-cv-2023-8a6f82a84db0', 'Anycast Service Function Chain Provisioning']
]);

async function main() {
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ dataset: 'production' });
  const person = await client.getDocument('person-liu-yuanhao');
  if (!person || person.name !== 'Yuanhao Liu' || !Array.isArray(person.academicRecords)) {
    throw new Error('Expected Yuanhao Liu profile was not found.');
  }

  for (const record of person.academicRecords) {
    const expected = removedRecords.get(record._key);
    if (expected && !record.citation?.includes(expected)) {
      throw new Error(`Record ${record._key} no longer matches the supplied document.`);
    }
  }

  const publications = await Promise.all([...outcomesPublications].map(async ([id, expected]) => {
    const item = await client.getDocument(id);
    if (!item || !item.title?.includes(expected)) throw new Error(`Unexpected publication: ${id}`);
    return item;
  }));

  for (const item of publications) {
    if (item.hideFromOutcomes === true) continue;
    await client.patch(item._id).ifRevisionId(item._rev).set({ hideFromOutcomes: true }).commit();
    console.log(`Hidden from Outcomes: ${item.title}`);
  }

  const retained = person.academicRecords.filter((record) => !removedRecords.has(record._key));
  if (retained.length !== person.academicRecords.length) {
    await client.patch(person._id).ifRevisionId(person._rev).set({ academicRecords: retained }).commit();
    console.log(`Removed ${person.academicRecords.length - retained.length} items from Yuanhao Liu's profile.`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
