import { createReadStream, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCliClient } from 'sanity/cli';

const sourceDirectory = process.argv.find((argument) => argument.includes('课题组照片'));
if (!sourceDirectory) throw new Error('Pass the source photo directory as the final argument.');

const activities = [
  {
    id: 'activity-group-2026-10-freshmen', month: '2026-10',
    title: 'Introducing the lab to new students',
    summary: 'Prof. Ning Deng introduces OICL to incoming students.',
    photos: [{ file: '202610 Prof Deng intro the lab to freshmen.jpg', alt: 'Prof. Ning Deng introduces the optical communications laboratory to a group of new students.' }]
  },
  {
    id: 'activity-group-2026-10-westlake', month: '2026-10',
    title: 'Visit to Westlake University',
    summary: 'OICL members visit Westlake University and Prof. Shieh’s group.',
    photos: [
      { file: "202610a Visit Westlake Univ and Prof. Shieh's group.jpg", alt: 'OICL members and hosts stand together outside a building at Westlake University.' },
      { file: "202610b Visit Westlake Univ and Prof. Shieh's group.jpg", alt: 'Researchers discuss a presentation during the visit to Westlake University.' }
    ]
  },
  {
    id: 'activity-group-2026-08-photo', month: '2026-08',
    title: 'OICL group photo',
    summary: 'An all-member photo of OICL.',
    photos: [{ file: '202608groupPhoto.jpg', alt: 'OICL members pose together for a group photo at Great Bay University.' }]
  },
  {
    id: 'activity-group-2026-08-goinc', month: '2026-08',
    title: 'Invited talk at GoInc Conf 2026',
    photos: [{ file: '202608 Invited talk at GoInc Conf 2026.jpg', alt: 'A speaker presents an invited talk at GoInc Conf 2026.' }]
  },
  {
    id: 'activity-group-2026-07-recruitment', month: '2026-07',
    title: 'Undergraduate recruitment at Dongguan Middle School',
    photos: [{ file: '202607 Enroll undergraduate students at Dongguan Middle School.jpg', alt: 'A group of university representatives stands with a banner at Dongguan Middle School.' }]
  },
  {
    id: 'activity-group-2026-05-csc-talk', month: '2026-05',
    title: 'Invited talk at a CSC conference',
    summary: 'Prof. Ning Deng gives an invited talk.',
    photos: [{ file: '202605 Prof Deng gave an invited talk at CSC conference.jpg', alt: 'Prof. Ning Deng speaks at a CSC conference podium.' }]
  },
  {
    id: 'activity-group-2026-05-songshan', month: '2026-05',
    title: 'Hiking around Songshan Lake',
    photos: [{ file: '202605松山湖北.jpg', alt: 'OICL members pose together during a hike around Songshan Lake.' }]
  },
  {
    id: 'activity-group-2026-04-visitors', month: '2026-04',
    title: 'Visit by experts from China Unicom and Zhejiang University',
    photos: [{ file: '202604 Expert visitors from China Unicom and ZJU.jpg', alt: 'OICL members and visitors from China Unicom and Zhejiang University stand together on campus.' }]
  },
  {
    id: 'activity-group-2025-12-founding', month: '2025-12',
    title: 'GBU founding ceremony',
    summary: 'A photo with guests at the Great Bay University founding ceremony.',
    photos: [{ file: '202512 Photo with guests at GBU Founding Ceremony.jpg', alt: 'Guests pose beside the Great Bay University founding ceremony display.' }]
  },
  {
    id: 'activity-group-2025-12-ustc', month: '2025-12',
    title: 'USTC alumni visit GBU and OICL',
    photos: [{ file: '202512 USTC alumni visited GBU and OICL lab.jpg', alt: 'USTC alumni and hosts pose together during a visit to Great Bay University and OICL.' }]
  },
  {
    id: 'activity-group-2025-05-conference', month: '2025-05',
    title: 'Optical communications conference at GBU',
    summary: 'A conference held with the Chinese Society for Optical Engineering.',
    photos: [{ file: '202505 A Conference in GBU with China Opt Eng Society.jpg', alt: 'Conference participants pose in front of a Great Bay University sign.' }]
  },
  {
    id: 'activity-group-2025-04-outing', month: '2025-04',
    title: 'Spring outing',
    photos: [{ file: 'b861fe6280747e5bbc69761ab307054.jpg', alt: 'Members pose together outside a campus building during a spring outing.' }]
  },
  {
    id: 'activity-group-2024-11-sharing', month: '2024-11',
    title: 'Postgraduate student experience sharing',
    photos: [{ file: '202411 First experience sharing meeting among postgraduate students.jpg', alt: 'Postgraduate students attend an experience-sharing meeting in a classroom.' }]
  },
  {
    id: 'activity-group-2024-07-summer-course', month: '2024-07',
    title: 'First summer course on optical communication',
    photos: [{ file: '202407 First summer course on optical communication.jpg', alt: 'Participants discuss optical communications around a conference table at the summer course.' }]
  },
  {
    id: 'activity-group-undated-visit',
    title: 'Lab visit and discussion',
    photos: [{ file: '05fecc776cb59ce679c15cc25b15faa.jpg', alt: 'Three people talk together in a laboratory meeting room.' }]
  },
  {
    id: 'activity-group-undated-gathering',
    title: 'Lab gathering',
    photos: [{ file: '0d625fca327a4c8fd12e10f9820a979.jpg', alt: 'A group gathers around a table for a meal.' }]
  }
];

const client = getCliClient({ apiVersion: '2026-10-01' });
for (const activity of activities) {
  if (await client.getDocument(activity.id)) {
    console.log(`Already exists: ${activity.id}`);
    continue;
  }
  const images = [];
  for (const [index, photo] of activity.photos.entries()) {
    const path = join(sourceDirectory, photo.file);
    if (!existsSync(path)) throw new Error(`Missing photo: ${path}`);
    const asset = await client.assets.upload('image', createReadStream(path), { filename: photo.file });
    images.push({
      _type: 'image', _key: `photo-${index + 1}`, alt: photo.alt,
      asset: { _type: 'reference', _ref: asset._id }
    });
  }
  await client.createIfNotExists({
    _id: activity.id, _type: 'newsItem', title: activity.title,
    month: activity.month, summary: activity.summary, language: 'en', images
  });
  console.log(`Published: ${activity.id} (${images.length} photo${images.length === 1 ? '' : 's'})`);
}
