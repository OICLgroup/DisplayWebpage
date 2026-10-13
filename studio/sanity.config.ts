import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
  throw new Error('Set SANITY_STUDIO_PROJECT_ID before starting or building the content studio.');
}

export default defineConfig({
  name: 'oicl',
  title: 'OICL Content Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) => S.list().title('OICL content').items([
        S.listItem().title('Site settings').id('siteSettings').child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
        S.divider(),
        ...S.documentTypeListItems().filter((item) => item.getId() !== 'siteSettings')
      ])
    })
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== 'siteSettings')
  }
});
