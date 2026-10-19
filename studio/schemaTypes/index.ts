import { defineArrayMember, defineField, defineType } from 'sanity';

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
    defineField({ name: 'chineseIntro', title: 'Chinese introduction (optional)', type: 'text', rows: 4 }),
    defineField({ name: 'applicationStatement', title: 'Application scenarios', type: 'string' }),
    defineField({ name: 'applicationChinese', title: 'Application scenarios (Chinese)', type: 'string' }),
    defineField({ name: 'networkStandards', title: 'Next-generation fixed network initiatives', type: 'string', description: 'For example, the initiative names shown in the approved research presentation.' }),
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
    defineField({ name: 'active', title: 'Show on website', type: 'boolean', initialValue: true, description: 'Turn off to retain an older theme without publishing it.' }),
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
    defineField({ name: 'name', title: 'English / romanized name', type: 'string', description: 'Use given name first, family name last (for example, Cao Chen for 陈操). Keep publication author lists in their published citation format.', validation: required }),
    defineField({ name: 'chineseName', title: 'Chinese name (optional)', type: 'string' }),
    defineField({ name: 'slug', title: 'Profile URL', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'group', title: 'People group', type: 'string', options: { list: ['Professors', 'Researchers', 'Students'] }, initialValue: 'Researchers' }),
    defineField({ name: 'role', title: 'Role', type: 'string', validation: required }),
    defineField({ name: 'focus', title: 'Research focus', type: 'text', rows: 2 }),
    defineField({ name: 'biography', title: 'Short English biography', type: 'text', rows: 5 }),
    defineField({ name: 'featuredPublications', title: 'Selected publications on profile', type: 'array', of: [
      defineArrayMember({ type: 'reference', to: [{ type: 'publication' }] })
    ] }),
    defineField({ name: 'academicRecords', title: 'Full publication and patent record', type: 'array', of: [
      defineArrayMember({ type: 'object', name: 'academicRecord', fields: [
        defineField({ name: 'kind', title: 'Category', type: 'string', options: { list: [
          { title: 'Journal article', value: 'journal' },
          { title: 'Conference paper', value: 'conference' },
          { title: 'Patent', value: 'patent' }
        ] }, validation: required }),
        defineField({ name: 'citation', title: 'Citation as supplied', type: 'text', rows: 3, validation: required }),
        urlField('url', 'Verified publication or patent URL (optional)'),
        defineField({ name: 'language', title: 'Citation language', type: 'string', options: { list: [
          { title: 'English', value: 'en' }, { title: 'Chinese', value: 'zh' }
        ] }, initialValue: 'en' })
      ], preview: { select: { title: 'citation', subtitle: 'kind' } } })
    ] }),
    defineField({ name: 'email', title: 'Public email (optional)', type: 'email' }),
    urlField('profileUrl', 'External profile URL'),
    imageWithAlt('portrait', 'Portrait'),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 10 })
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'portrait' } }
});

const newsItem = defineType({
  name: 'newsItem', title: 'Activities', type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Headline', type: 'string', validation: required }),
    defineField({ name: 'date', title: 'Exact date (when known)', type: 'date' }),
    defineField({ name: 'month', title: 'Month (when only month is known)', type: 'string', description: 'Use YYYY-MM. Leave exact date empty when the day is not confirmed.', validation: (Rule) => Rule.regex(/^\d{4}-(0[1-9]|1[0-2])$/, { name: 'YYYY-MM' }) }),
    defineField({ name: 'summary', title: 'Short summary', type: 'text', rows: 3 }),
    defineField({ name: 'featuredPerson', title: 'Person involved', type: 'reference', to: [{ type: 'person' }], description: 'Name the confirmed lab member involved in this activity. Do not infer identities from photos.' }),
    defineField({ name: 'images', title: 'Photos', type: 'array', of: [
      defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [
        defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: required })
      ] })
    ] }),
    urlField('url', 'More information URL'),
    defineField({ name: 'language', title: 'Content language', type: 'string', options: { list: [{ title: 'English', value: 'en' }, { title: 'Chinese only', value: 'zh' }] }, initialValue: 'en' })
  ],
  preview: { select: { title: 'title', subtitle: 'date' } }
});

const outcome = defineType({
  name: 'outcome', title: 'Prototypes and applications', type: 'document',
  fields: [
    defineField({ name: 'kind', title: 'Category', type: 'string', options: { list: ['Prototype', 'Application'] }, validation: required }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: required }),
    defineField({ name: 'summary', title: 'Description', type: 'text', rows: 4, validation: required }),
    defineField({ name: 'year', title: 'Year', type: 'number' }),
    urlField('url', 'Verified external source'),
    imageWithAlt('image', 'Verified image'),
    defineField({ name: 'language', title: 'Content language', type: 'string', options: { list: [{ title: 'English', value: 'en' }, { title: 'Chinese only', value: 'zh' }] }, initialValue: 'en' }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 10 })
  ],
  preview: { select: { title: 'title', subtitle: 'kind', media: 'image' } }
});

const importantLink = defineType({
  name: 'importantLink', title: 'Important links', type: 'document',
  fields: [
    defineField({ name: 'title', title: 'English label', type: 'string', validation: required }),
    defineField({ name: 'chineseTitle', title: 'Chinese label (optional)', type: 'string' }),
    urlField('url', 'Verified website URL'),
    defineField({ name: 'description', title: 'Short description', type: 'string' }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 10 })
  ],
  preview: { select: { title: 'title', subtitle: 'url' } }
});

export const schemaTypes = [siteSettings, researchTheme, publication, person, newsItem, outcome, importantLink];
