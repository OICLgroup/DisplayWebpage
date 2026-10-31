import { createClient } from '@sanity/client';
import { previewSettings, previewThemes, previewPublications, previewPeople, previewActivities, previewOutcomes, previewLinks } from '../data/preview';

export type SiteSettings = {
  labName: string; chineseName?: string; officialName?: string; affiliation?: string;
  heroStatement?: string; intro?: string; chineseIntro?: string; applicationStatement?: string;
  applicationChinese?: string; networkStandards?: string;
  contactEmail?: string; location?: string;
};
export type ResearchTheme = {
  id: string; title: string; chineseTitle?: string; slug: string; summary: string;
  detail?: string; imageUrl?: string; imageAlt?: string;
};
export type Publication = {
  id: string; title: string; authors: string; year: number; venue: string;
  type: 'Journal' | 'Conference' | 'Preprint' | 'Other';
  doi?: string; url?: string; featured?: boolean; hideFromOutcomes?: boolean; language?: 'en' | 'zh';
};
export type AcademicRecord = {
  kind: 'journal' | 'conference' | 'book' | 'patent'; citation: string;
  url?: string; language?: 'en' | 'zh';
};
export type ResearchProject = {
  title: string; year?: number; note?: string; language?: 'en' | 'zh';
};
export type Person = {
  id: string; name: string; chineseName?: string; slug?: string;
  group?: 'Professors' | 'Researchers' | 'Students'; role: string;
  focus?: string; biography?: string; email?: string; profileUrl?: string;
  portraitUrl?: string; portraitAlt?: string; order?: number;
  featuredPublications?: Publication[];
  academicRecords?: AcademicRecord[];
  researchProjects?: ResearchProject[];
};
export type Activity = {
  id: string; date?: string; month?: string; title: string; summary?: string; url?: string;
  featuredPerson?: { name: string; chineseName?: string; slug?: string };
  language?: 'en' | 'zh'; images?: { url: string; alt: string; width?: number; height?: number }[];
};
export type Outcome = {
  id: string; kind: 'Prototype' | 'Application'; title: string; summary: string;
  year?: number; url?: string; imageUrl?: string; imageAlt?: string; language?: 'en' | 'zh';
};
export type ImportantLink = {
  id: string; title: string; chineseTitle?: string; url?: string; description?: string;
};
export type SiteContent = {
  settings: SiteSettings; themes: ResearchTheme[]; publications: Publication[];
  people: Person[]; activities: Activity[]; outcomes: Outcome[]; links: ImportantLink[];
  connected: boolean; readyToPublish: boolean;
};

function safeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined;
  } catch { return undefined; }
}
function cleanEmail(value?: string): string | undefined {
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : undefined;
}
export function personSlug(person: Pick<Person, 'name' | 'slug'>): string {
  return person.slug || person.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function previewContent(): SiteContent {
  return {
    settings: previewSettings, themes: previewThemes, publications: previewPublications,
    people: previewPeople, activities: previewActivities, outcomes: previewOutcomes,
    links: previewLinks, connected: false, readyToPublish: false
  };
}

async function loadSiteContent(): Promise<SiteContent> {
  const projectId = import.meta.env.SANITY_PROJECT_ID?.trim();
  const dataset = import.meta.env.SANITY_DATASET?.trim() || 'production';
  const production = import.meta.env.PUBLICATION_MODE === 'production';
  const siteUrl = import.meta.env.SITE_URL?.trim();

  // The redesign preview remains local until the laboratory approves its content.
  // CONTENT_SOURCE=sanity lets editors inspect current CMS records locally.
  if (!production && import.meta.env.CONTENT_SOURCE !== 'sanity') return previewContent();
  if (production && (!siteUrl || siteUrl === 'https://example.org' || !siteUrl.startsWith('https://'))) {
    throw new Error('Production build requires a real HTTPS SITE_URL.');
  }
  if (!projectId) {
    if (production) throw new Error('Production build requires SANITY_PROJECT_ID and verified content.');
    return previewContent();
  }
  const client = createClient({
    projectId, dataset, apiVersion: import.meta.env.SANITY_API_VERSION || '2026-10-01',
    useCdn: false, perspective: 'published', token: import.meta.env.SANITY_READ_TOKEN || undefined
  });
  const [rawSettings, rawThemes, rawPublications, rawPeople, rawActivities, rawOutcomes, rawLinks] = await Promise.all([
    client.fetch<SiteSettings | null>('*[_type == "siteSettings"][0]{labName, chineseName, officialName, affiliation, heroStatement, intro, chineseIntro, applicationStatement, applicationChinese, networkStandards, contactEmail, location}'),
    client.fetch<ResearchTheme[]>('*[_type == "researchTheme" && active != false] | order(order asc, title asc){"id": _id, title, chineseTitle, "slug": slug.current, summary, detail, "imageUrl": image.asset->url, "imageAlt": image.alt}'),
    client.fetch<Publication[]>('*[_type == "publication"] | order(year desc, title asc){"id": _id, title, authors, year, venue, type, doi, url, featured, hideFromOutcomes, language}'),
    client.fetch<Person[]>('*[_type == "person"] | order(order asc, name asc){"id": _id, name, chineseName, "slug": slug.current, group, role, focus, biography, email, profileUrl, "portraitUrl": portrait.asset->url, "portraitAlt": portrait.alt, order, "featuredPublications": featuredPublications[]->{"id": _id, title, authors, year, venue, type, doi, url, featured, language}, "academicRecords": academicRecords[]{kind,citation,url,language}, "researchProjects": researchProjects[]{title,year,note,language}}'),
    client.fetch<Activity[]>('*[_type == "newsItem"]{"id": _id, date, month, title, summary, url, language, "featuredPerson": featuredPerson->{name, chineseName, "slug": slug.current}, "images": images[]{"url": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height}}'),
    client.fetch<Outcome[]>('*[_type == "outcome"] | order(year desc, order asc){"id": _id, kind, title, summary, year, url, language, "imageUrl": image.asset->url, "imageAlt": image.alt}'),
    client.fetch<ImportantLink[]>('*[_type == "importantLink"] | order(order asc, title asc){"id": _id, title, chineseTitle, url, description}')
  ]);
  const settings: SiteSettings = { ...rawSettings, labName: rawSettings?.labName?.trim() || 'OICL', contactEmail: cleanEmail(rawSettings?.contactEmail) };
  const themes = (rawThemes || []).filter((item) => item.title && item.summary).map((item) => ({ ...item, imageUrl: safeExternalUrl(item.imageUrl) }));
  const publications = (rawPublications || []).filter((item) => item.title && item.authors && item.year).map((item) => ({
    ...item, url: safeExternalUrl(item.url), doi: item.doi?.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim()
  }));
  const people = (rawPeople || []).filter((item) => item.name && item.role).map((item) => ({
    ...item, email: cleanEmail(item.email), profileUrl: safeExternalUrl(item.profileUrl), portraitUrl: safeExternalUrl(item.portraitUrl),
    featuredPublications: (item.featuredPublications || []).filter((publication) => publication?.title && publication?.authors && publication?.year).map((publication) => ({
      ...publication, doi: publication.doi?.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim(), url: safeExternalUrl(publication.url)
    })),
    academicRecords: (item.academicRecords || []).filter((record) => record?.citation && ['journal', 'conference', 'book', 'patent'].includes(record.kind)).map((record) => ({
      ...record, url: safeExternalUrl(record.url)
    })),
    researchProjects: (item.researchProjects || []).filter((project) => project?.title)
  }));
  const activities = (rawActivities || []).filter((item) => item.title && (item.date || item.month || item.images?.length)).map((item) => ({
    ...item, url: safeExternalUrl(item.url),
    images: (item.images || []).filter((image) => safeExternalUrl(image.url) && image.alt).map((image) => ({ ...image, url: safeExternalUrl(image.url)! }))
  })).sort((a, b) => (b.date || b.month || '').localeCompare(a.date || a.month || ''));
  const outcomes = (rawOutcomes || []).filter((item) => item.title && item.summary && (item.kind === 'Prototype' || item.kind === 'Application')).map((item) => ({
    ...item, url: safeExternalUrl(item.url), imageUrl: safeExternalUrl(item.imageUrl)
  }));
  const links = (rawLinks || []).filter((item) => item.title).map((item) => ({ ...item, url: safeExternalUrl(item.url) }));
  const readyToPublish = Boolean(
    rawSettings?.officialName?.trim() && rawSettings?.affiliation?.trim() && rawSettings?.intro?.trim() &&
    settings.contactEmail && themes.length && publications.some((item) => publicationUrl(item)) && people.length
  );
  if (production && !readyToPublish) {
    throw new Error('Production build blocked: add verified name, affiliation, introduction, contact email, research theme, publication and person in Sanity.');
  }
  return { settings, themes, publications, people, activities, outcomes, links, connected: true, readyToPublish };
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
export function activityDateLabel(activity: Activity): string {
  const value = activity.date || activity.month;
  if (!value || !/^\d{4}-(0[1-9]|1[0-2])(?:-\d{2})?$/.test(value)) return '';
  const date = new Date(`${activity.date || `${activity.month}-01`}T00:00:00Z`);
  return date.toLocaleDateString('en-US', activity.date
    ? { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }
    : { year: 'numeric', month: 'long', timeZone: 'UTC' });
}
