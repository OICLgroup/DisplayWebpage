import { getCliClient } from 'sanity/cli';

const links = [
  {
    id: 'link-dongguan-key-lab',
    title: 'Dongguan Key Laboratory of Intelligence and Information Technology',
    chineseTitle: '东莞市智能信息技术重点实验室',
    description: 'Official laboratory profile.',
    url: 'https://scit.gbu.edu.cn/lab_35.html'
  },
  {
    id: 'link-school-cit',
    title: 'School of Computing and Information Technology',
    chineseTitle: '信息科学技术学院',
    description: 'Official school homepage.',
    url: 'https://scit.gbu.edu.cn/'
  }
];

async function main() {
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ dataset: 'production' });

  for (const link of links) {
    const current = await client.getDocument(link.id);
    if (!current || current.title !== link.title) {
      throw new Error(`Unexpected or missing importantLink document: ${link.id}`);
    }
    if (current.url && current.url !== link.url) {
      throw new Error(`Existing URL differs for ${link.id}; review before replacing it.`);
    }
    const { id, ...fields } = link;
    if (Object.entries(fields).every(([key, value]) => current[key] === value)) {
      console.log(`${id}: already up to date`);
      continue;
    }
    await client.patch(id).ifRevisionId(current._rev).set(fields).commit();
    console.log(`${id}: updated`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
