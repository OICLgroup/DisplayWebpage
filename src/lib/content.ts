import { createClient } from '@sanity/client';
import { previewSettings, previewThemes, previewPublications, previewPeople, previewNews } from '../data/preview';

export type SiteSettings = {
  labName: string;
  chineseName?: string;
  officialName?: string;
  affiliation?: string;
  heroStatement?: string;
  intro?: string;
  contactEmail?: string;
  location?: string;
};

export type ResearchTheme = {
  id: string;
  title: string;
  chineseTitle?: string;
  slug: string;
  summary: string;
  detail?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type Publication = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  type: 'Journal' | 'Conference' | 'Preprint' | 'Other';
  doi?: string;
  url?: string;
  featured?: boolean;
  language?: 'en' | 'zh';
};

export type Person = {
  id: string;
  name: string;
  chineseName?: string;
  role: string;
  focus?: string;
  biography?: string;
  email?: string;
  profileUrl?: string;
  portraitUrl?: string;
  portraitAlt?: string;
  order?: number;
};

export type NewsItem = {
  id: string;
  date: string;
  title: string;
  summary?: string;
  url?: string;
  language?: 'en' | 'zh';
};

export type SiteContent = {
  settings: SiteSettings;
  themes: ResearchTheme[];
  publications: Publication[];
  people: Person[];
  news: NewsItem[];
  connected: boolean;
  readyToPublish: boolean;
};

function safeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function cleanEmail(value?: string): string | undefined {
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : undefined;
}

async function loadSiteContent(): Promise<SiteContent> {
  const projectId = import.meta.env.SANITY_PROJECT_ID?.trim();
  const dataset = import.meta.env.SANITY_DATASET?.trim() || 'production';
  const production = import.meta.env.PUBLICATION_MODE === 'production';
  const siteUrl = import.meta.env.SITE_URL?.trim();

  if (production && (!siteUrl || siteUrl === 'https://example.org' || !siteUrl.startsWith('https://'))) {
    throw new Error('Production build requires a real HTTPS SITE_URL.');
  }

  if (!projectId) {
    if (production) throw new Error('Production build requires SANITY_PROJECT_ID and verified content.');
    return {
      settings: previewSettings,
      themes: previewThemes,
      publications: previewPublications,
      people: previewPeople,
      news: previewNews,
      connected: false,
      readyToPublish: false
    };
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: import.meta.env.SANITY_API_VERSION || '2026-10-01',
    useCdn: false,
    perspective: 'published',
    token: import.meta.env.SANITY_READ_TOKEN || undefined
  });

  const [rawSettings, rawThemes, rawPublications, rawPeople, rawNews] = await Promise.all([
    client.fetch<SiteSettings | null>('*[_type == "siteSettings"][0]{labName, chineseName, officialName, affiliation, heroStatement, intro, contactEmail, location}'),
    client.fetch<ResearchTheme[]>('*[_type == "researchTheme"] | order(order asc, title asc){"id": _id, title, chineseTitle, "slug": slug.current, summary, detail, "imageUrl": image.asset->url, "imageAlt": image.alt}'),
    client.fetch<Publication[]>('*[_type == "publication"] | order(year desc, title asc){"id": _id, title, authors, year, venue, type, doi, url, featured, language}'),
    client.fetch<Person[]>('*[_type == "person"] | order(order asc, name asc){"id": _id, name, chineseName, role, focus, biography, email, profileUrl, "portraitUrl": portrait.asset->url, "portraitAlt": portrait.alt, order}'),
    client.fetch<NewsItem[]>('*[_type == "newsItem"] | order(date desc)[0...5]{"id": _id, date, title, summary, url, language}')
  ]);

  const settings: SiteSettings = {
    ...rawSettings,
    labName: rawSettings?.labName?.trim() || 'OICL',
    contactEmail: cleanEmail(rawSettings?.contactEmail)
  };
  const themes = (rawThemes || []).filter((item) => item.title && item.summary).map((item) => ({
    ...item,
    imageUrl: safeExternalUrl(item.imageUrl)
  }));
  const publications = (rawPublications || []).filter((item) => item.title && item.authors && item.year).map((item) => ({
    ...item,
    url: safeExternalUrl(item.url),
    doi: item.doi?.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim()
  }));
  const people = (rawPeople || []).filter((item) => item.name && item.role).map((item) => ({
    ...item,
    email: cleanEmail(item.email),
    profileUrl: safeExternalUrl(item.profileUrl),
    portraitUrl: safeExternalUrl(item.portraitUrl)
  }));
  const news = (rawNews || []).filter((item) => item.title && item.date).map((item) => ({
    ...item,
    url: safeExternalUrl(item.url)
  }));

  const readyToPublish = Boolean(
    rawSettings?.officialName?.trim() && rawSettings?.affiliation?.trim() && rawSettings?.intro?.trim() &&
    settings.contactEmail && themes.length && publications.some((item) => publicationUrl(item)) && people.length
  );
  if (production && !readyToPublish) {
    throw new Error('Production build blocked: add verified name, affiliation, introduction, contact email, research theme, publication and person in Sanity.');
  }

  return { settings, themes, publications, people, news, connected: true, readyToPublish };
}

let contentPromise: Promise<SiteContent> | undefined;
export function getSiteContent(): Promise<SiteContent> {
  contentPromise ??= loadSiteContent();
  return contentPromise;
}

export function publicationUrl(publication: Publication): string | undefined {
  if (publication.doi && /^10\.\d{4,9}\/\S+$/.test(publication.doi)) {
    return `https://doi.org/${encodeURIComponent(publication.doi).replace(/%2F/gi, '/')}`;
  }
  return publication.url;
}
