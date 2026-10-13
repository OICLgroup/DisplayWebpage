import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  deployment: {
    appId: 'nsts8wkkldctlqpnf0jr8kzc'
  },
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'missing-project-id',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  }
});
