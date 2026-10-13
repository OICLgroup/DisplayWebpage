import type { NewsItem, Person, Publication, ResearchTheme, SiteSettings } from '../lib/content';

// Preview content is based on the laboratory biography supplied by the user.
// The public build still requires these records to be reviewed and entered in Sanity.
export const previewSettings: SiteSettings = {
  labName: 'OICL',
  affiliation: 'Great Bay University',
  heroStatement: 'Research at the intersection of light, networks and computing.',
  intro: 'OICL explores optical communications, optical switching networks, networks for AI computing, and optical information display.',
  contactEmail: 'ndeng@gbu.edu.cn',
  location: 'Dongguan, Guangdong, China'
};

export const previewThemes: ResearchTheme[] = [
  {
    id: 'optical-communications', slug: 'optical-communications',
    title: 'Optical communications', chineseTitle: '光信息通信',
    summary: 'Exploring light-based transmission systems and the networks that carry information.'
  },
  {
    id: 'optical-switching', slug: 'optical-switching',
    title: 'Optical switching networks', chineseTitle: '光交换网络',
    summary: 'Studying flexible optical paths and switching architectures for communication and computing networks.'
  },
  {
    id: 'ai-computing-networks', slug: 'ai-computing-networks',
    title: 'Networks for AI computing', chineseTitle: '人工智能算力网络',
    summary: 'Investigating network infrastructure that connects and supports distributed AI computing.'
  },
  {
    id: 'optical-display', slug: 'optical-display',
    title: 'Optical display & immersive systems', chineseTitle: '光信息呈现与虚拟现实融合技术',
    summary: 'Exploring the intersection of optical information display and virtual reality experiences.'
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
    id: 'ning-deng', name: 'Ning Deng', chineseName: '邓宁', role: 'Professor',
    focus: 'Optical communications, optical switching and networks for AI computing',
    biography: 'Prof. Deng received his bachelor’s degree from the University of Science and Technology of China in 2002 and his PhD from the Chinese University of Hong Kong in 2007. After research and industry roles, he joined Great Bay University in 2024.',
    email: 'ndeng@gbu.edu.cn', order: 1
  }
];

export const previewNews: NewsItem[] = [];
