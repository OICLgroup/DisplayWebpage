import { getCliClient } from 'sanity/cli';

// Curation requested on 2026-10-31: group events first, then at most two
// representative solo/small-group photos for each contributor.
const activities = [
  ['activity-liu-yuanhao-01', '2026年大湾区大学招生突出贡献者', true, true],
  ['activity-liu-yuanhao-02', '常平中学招生', true, true],
  ['activity-liu-yuanhao-03', '校园开放日活动与考生交流', true, true],
  ['activity-liu-yuanhao-04', '湾大教职工篮球赛压哨绝平跳投', true, true],
  ['activity-liu-yuanhao-05', '英国格拉斯哥 ICC 参会', true, false],
  ['activity-liu-yuanhao-06', '无线光通信感知技术会议志愿者', true, false],
  ['activity-liu-yuanhao-07', '法国 Avignon University 博士答辩', false, false],
  ['activity-chen-cao-shenzhen-expo-2026-09-09', 'Shenzhen optical expo', false, false],
  ['activity-chen-cao-ocs-roadshow-2026-09-08', 'OCS roadshow at the optical communications conference', true, false],
  ['activity-chen-cao-csc-2026-05-29', 'CSC 学友汇', true, false]
];

async function main() {
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ dataset: 'production' });
  for (const [id, title, showOnWebsite, spotlight] of activities) {
    const item = await client.getDocument(id);
    if (!item || item.title !== title) throw new Error(`Unexpected activity: ${id}`);
    const fields = { showOnWebsite, spotlight };
    if (id === 'activity-liu-yuanhao-05') {
      if (item.images?.length !== 2 || item.images[0]._key !== 'photo-5-1' || item.images[1]._key !== 'photo-5-2') {
        throw new Error('The ICC photo selection has changed; review before updating.');
      }
      fields.images = item.images.map((image) => ({
        ...image,
        showOnWebsite: image._key !== 'photo-5-2'
      }));
    }
    const unchanged = Object.entries(fields).every(([key, value]) =>
      key === 'images'
        ? item.images.every((image, index) => image.showOnWebsite === value[index].showOnWebsite)
        : item[key] === value
    );
    if (unchanged) continue;
    await client.patch(id).ifRevisionId(item._rev).set(fields).commit();
    console.log(`${showOnWebsite ? (spotlight ? 'Featured' : 'Individual') : 'Hidden'}: ${title}`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
