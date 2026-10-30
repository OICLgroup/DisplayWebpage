import { getCliClient } from 'sanity/cli';

// Publications crossed out in the five screenshots supplied on 2026-10-31.
// Retain the records for author profiles and future review.
const hidden = new Map([
  ['publication-liu-cv-2026-5e0e0b70abde', 'Fairness Enhancement in Grant-Free Random Access With Power Control for Cell-Free Massive MIMO'],
  ['publication-liu-cv-2025-b1ecdc09422a', 'A VNF Sharing Method Based on Node Selection Probability Using Reinforcement Learning in Air-Ground Network'],
  ['publication-liu-cv-2025-1e699934997a', 'Cost-Oriented and Delay-Constrained Anycasting for Service Function Chain Provisioning Leveraging Cloud-Edge Collaboration in Space-Air-Ground Integrated Networks'],
  ['publication-hum-c4-2025', 'Enhancing resolution with LSTM-RNN-based band fusion in microwave photonic radar systems'],
  ['publication-hum-c5-2025', 'Machine learning-based object classification using mm-wave radar at 77GHz–81GHz'],
  ['publication-hum-j3-2025', 'Target detection using fused unidentical photonics-based LFM sub-band radar signals with an adaptive feed forward network equalizer'],
  ['publication-liu-cv-2024-25c6565b8504', 'A Multi-Objective Dynamic Mission-Scheduling Algorithm Considering Perturbations for Earth Observation Satellites'],
  ['publication-liu-cv-2024-674ffd7ae36c', '基于ESWO的敏捷对地观测卫星任务调度算法'],
  ['publication-liu-cv-2023-8a6f82a84db0', 'Anycast Service Function Chain Provisioning in Space-Air-Ground Integrated Networks leveraging Cloud-Edge Collaboration']
]);

const firstPaper = {
  id: 'publication-hum-parajuli-ecoc-2026-high-pass-filtering',
  title: 'A low-complexity adaptive high-pass filtering scheme for multipath interference mitigation in IM/DD systems with OCS',
  before: 'Proc. 52nd European Conference on Optical Communication (ECOC), 2026, accepted for publication',
  after: 'Proc. 52nd European Conference on Optical Communication (ECOC), 2026'
};

async function main() {
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ dataset: 'production' });
  for (const [id, title] of hidden) {
    const item = await client.getDocument(id);
    if (!item || item.title !== title) throw new Error(`Unexpected publication: ${id}`);
    if (item.hideFromOutcomes === true) continue;
    await client.patch(id).ifRevisionId(item._rev).set({ hideFromOutcomes: true }).commit();
    console.log(`Hidden from Outcomes: ${title}`);
  }

  const item = await client.getDocument(firstPaper.id);
  if (!item || item.title !== firstPaper.title || ![firstPaper.before, firstPaper.after].includes(item.venue)) {
    throw new Error(`Unexpected publication status: ${firstPaper.id}`);
  }
  if (item.venue !== firstPaper.after) {
    await client.patch(firstPaper.id).ifRevisionId(item._rev).set({ venue: firstPaper.after }).commit();
    console.log(`Removed status marker: ${firstPaper.title}`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
