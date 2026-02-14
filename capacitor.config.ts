import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.heartgame.app',
  appName: 'Heart Game',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
