import { defineField, defineType } from 'sanity';

const required = (Rule: any) => Rule.required();
const urlField = (name: string, title: string) => defineField({
  name, title, type: 'url',
  validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] })
});

const imageWithAlt = (name: string, title: string) => defineField({
  name, title, type: 'image', options: { hotspot: true },
  fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: required })]
});

const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({ name: 'labName', title: 'Short name', type: 'string', initialValue: 'OICL', validation: required }),
    defineField({ name: 'officialName', title: 'Official English name', type: 'string', description: 'Use the laboratory’s confirmed full name.', validation: required }),
    defineField({ name: 'chineseName', title: 'Chinese name', type: 'string' }),
    defineField({ name: 'affiliation', title: 'Institution / affiliation', type: 'string', validation: required }),
    defineField({ name: 'heroStatement', title: 'Home hero statement', type: 'string', description: 'One accurate sentence about the lab.' }),
    defineField({ name: 'intro', title: 'English introduction', type: 'text', rows: 4, validation: required }),
    defineField({ name: 'contactEmail', title: 'Collaboration email', type: 'email', validation: required }),
    defineField({ name: 'location', title: 'Location', type: 'string' })
  ]
});

const researchTheme = defineType({
  name: 'researchTheme', title: 'Research themes', type: 'document',
  fields: [
    defineField({ name: 'title', title: 'English title', type: 'string', validation: required }),
    defineField({ name: 'chineseTitle', title: 'Chinese title (optional)', type: 'string' }),
    defineField({ name: 'slug', title: 'Page anchor', type: 'slug', options: { source: 'title' }, validation: required }),
    defineField({ name: 'summary', title: 'Short summary', type: 'text', rows: 3, validation: required }),
    defineField({ name: 'detail', title: 'Detailed description', type: 'text', rows: 6 }),
    imageWithAlt('image', 'Verified research image'),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 10 })
  ],
  preview: { select: { title: 'title', subtitle: 'summary', media: 'image' } }
});

const publication = defineType({
  name: 'publication', title: 'Publications', type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Original publication title', type: 'string', validation: required }),
    defineField({ name: 'authors', title: 'Authors, in citation order', type: 'string', validation: required }),
    defineField({ name: 'year', title: 'Publication year', type: 'number', validation: (Rule) => Rule.required().integer().min(1900).max(2100) }),
    defineField({ name: 'venue', title: 'Journal / conference / repository', type: 'string', validation: required }),
    defineField({ name: 'type', title: 'Type', type: 'string', options: { list: ['Journal', 'Conference', 'Preprint', 'Other'] }, initialValue: 'Journal', validation: required }),
    defineField({ name: 'doi', title: 'DOI', type: 'string', description: 'Enter the DOI only, for example 10.1234/example.', validation: (Rule) => Rule.regex(/^10\.\d{4,9}\/\S+$/, { name: 'DOI' }) }),
    urlField('url', 'Original source URL (when no DOI)'),
    defineField({ name: 'language', title: 'Title language', type: 'string', options: { list: [{ title: 'English', value: 'en' }, { title: 'Chinese', value: 'zh' }] }, initialValue: 'en' }),
    defineField({ name: 'featured', title: 'Feature on home page', type: 'boolean', initialValue: false })
  ],
  preview: { select: { title: 'title', subtitle: 'venue' } }
});

const person = defineType({
  name: 'person', title: 'People', type: 'document',
  fields: [
    defineField({ name: 'name', title: 'English / romanized name', type: 'string', validation: required }),
    defineField({ name: 'chineseName', title: 'Chinese name (optional)', type: 'string' }),
    defineField({ name: 'role', title: 'Role', type: 'string', validation: required }),
    defineField({ name: 'focus', title: 'Research focus', type: 'text', rows: 2 }),
    defineField({ name: 'biography', title: 'Short English biography', type: 'text', rows: 5 }),
    defineField({ name: 'email', title: 'Public email (optional)', type: 'email' }),
    urlField('profileUrl', 'External profile URL'),
    imageWithAlt('portrait', 'Portrait'),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 10 })
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'portrait' } }
});

const newsItem = defineType({
  name: 'newsItem', title: 'News', type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Headline', type: 'string', validation: required }),
    defineField({ name: 'date', title: 'Date', type: 'date', validation: required }),
    defineField({ name: 'summary', title: 'Short summary', type: 'text', rows: 3 }),
    urlField('url', 'More information URL'),
    defineField({ name: 'language', title: 'Content language', type: 'string', options: { list: [{ title: 'English', value: 'en' }, { title: 'Chinese only', value: 'zh' }] }, initialValue: 'en' })
  ],
  preview: { select: { title: 'title', subtitle: 'date' } }
});

export const schemaTypes = [siteSettings, researchTheme, publication, person, newsItem];
