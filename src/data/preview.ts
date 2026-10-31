import type { Activity, ImportantLink, Outcome, Person, Publication, ResearchTheme, SiteSettings } from '../lib/content';

// Local redesign preview from the laboratory PPT. It is never used by production builds.
export const previewSettings: SiteSettings = {
  labName: 'OICL',
  officialName: 'Optical Information and Communications Laboratory',
  chineseName: '光信息通信实验室',
  affiliation: 'Great Bay University',
  heroStatement: 'Optical networks for the next era of AI computing.',
  intro: 'Optical Information and Communications Laboratory (OICL) focuses on enhancing AI computing through cutting-edge research and practical applications in three key areas: short-reach optical interconnects, flexible optical switching, and resilient optical networks for AI computing.',
  chineseIntro: '光信息通信实验室聚焦提升人工智能算力，围绕三个方向开展前沿研究与应用落地：算内短距光互连、灵活光交换、高韧性智算光网络。',
  applicationStatement: 'Optical Systems and Networks for AI and 6G',
  applicationChinese: '面向AI基座、6G承载的高可靠、高性能光子交换网络',
  networkStandards: '下一代固定网络：ION-2030（ITU）、F6G（ETSI）',
  contactEmail: 'ndeng@gbu.edu.cn',
  location: 'Dongguan, Guangdong, China'
};

export const previewThemes: ResearchTheme[] = [
  {
    id: 'short-reach', slug: 'short-reach-optical-interconnects',
    title: 'Short-reach optical interconnects', chineseTitle: '算内短距光互连',
    summary: 'Optical links that connect high-performance computing systems over short distances.',
    imageUrl: '/images/research/short-reach-system.png', imageAlt: 'Experimental system diagram for short-reach optical interconnects'
  },
  {
    id: 'flexible-switching', slug: 'flexible-optical-switching',
    title: 'Flexible optical switching', chineseTitle: '灵活光交换',
    summary: 'Adaptable optical circuit switching for the changing traffic patterns of AI infrastructure.',
    imageUrl: '/images/research/optical-switching-bench.png', imageAlt: 'Optical circuit switching research bench with labeled components'
  },
  {
    id: 'resilient-networks', slug: 'resilient-optical-networks',
    title: 'Resilient optical networks for AI computing', chineseTitle: '高韧性智算光网络',
    summary: 'High-capacity optical networks designed to sustain computing connectivity under changing conditions.',
    imageUrl: '/images/research/resilient-ocs-topology.png', imageAlt: 'Resilient optical circuit switching network with redundant links'
  }
];

export const previewPublications: Publication[] = [
  {
    id: 'dcon-2025', title: 'Disaster-Resilient Provisioning Leveraging Shared Adaptive Unequal Multi-Path Protection in DCONs',
    authors: 'Y. Liu and N. Deng', year: 2025, venue: 'IEEE GLOBECOM', type: 'Conference',
    doi: '10.1109/GLOBECOM59602.2025.11432195', featured: true, language: 'en'
  },
  {
    id: 'computing-center-2024', title: 'Optical Switching for Inter and Intra Computing Center Networks',
    authors: 'N. Deng, Z. Chang and R. Chen', year: 2024, venue: 'CLEO-PR', type: 'Conference',
    url: 'https://opg.optica.org/abstract.cfm?uri=CLEOPR-2024-Mo3K_1', featured: true, language: 'en'
  },
  {
    id: 'multiband-2022', title: 'Challenges and Enabling Technologies for Multi-Band WDM Optical Networks',
    authors: 'N. Deng, L. Zong, H. Jiang, Y. Duan and K. Zhang', year: 2022,
    venue: 'Journal of Lightwave Technology 40(11), 3385–3394', type: 'Journal',
    doi: '10.1109/JLT.2022.3162725', featured: true, language: 'en'
  },
  {
    id: 'ultradense-2017', title: 'An Ultradense Wavelength Switched Network',
    authors: 'X. Zhou, W. Jia, Y. Ma, N. Deng, G. Shen and A. Lord', year: 2017,
    venue: 'Journal of Lightwave Technology 35(11), 2063–2069', type: 'Journal',
    url: 'https://opg.optica.org/jlt/abstract.cfm?uri=jlt-35-11-2063', language: 'en'
  }
];

export const previewPeople: Person[] = [
  {
    id: 'ning-deng', name: 'Ning Deng', chineseName: '邓宁', slug: 'ning-deng', group: 'Professors', role: 'Professor · Principal Investigator',
    focus: 'Optical communications, optical switching and networks for AI computing.',
    biography: 'Dr. Ning Deng is currently a Full Professor at Great Bay University (GBU) and Director of the Dongguan Key Laboratory of Intelligence and Information Technology. He is a Fellow of Optica (formerly OSA), Associate Editor of the Journal of Optical Communications and Networking (JOCN), and editor of multiple ITU-T and CCSA standards. Before joining GBU, he was a Technology Expert at Huawei for about 15 years, making significant contributions to optical switching networks, high-speed transmission systems, and advanced display and lighting for vehicles. He has more than 70 patents granted or pending and has published about 85 papers in refereed conferences and journals.',
    portraitUrl: '/images/ning-deng.jpeg',
    portraitAlt: 'Portrait of Prof. Ning Deng',
    email: 'ndeng@gbu.edu.cn',
    profileUrl: 'https://www.gbu.edu.cn/sz_details_g7yU_92/785.html', order: 1
  }
];

export const previewActivities: Activity[] = [];
export const previewOutcomes: Outcome[] = [];
export const previewLinks: ImportantLink[] = [
  { id: 'dg-key-lab', title: 'Dongguan Key Laboratory of Intelligence and Information Technology', chineseTitle: '东莞市智能信息技术重点实验室', description: 'Official laboratory profile.', url: 'https://scit.gbu.edu.cn/lab_35.html' },
  { id: 'gbu', title: 'Great Bay University', chineseTitle: '大湾区大学', url: 'https://www.gbu.edu.cn/' },
  { id: 'school-cit', title: 'School of Computing and Information Technology', chineseTitle: '信息科学技术学院', description: 'Official school homepage.', url: 'https://scit.gbu.edu.cn/' }
];
