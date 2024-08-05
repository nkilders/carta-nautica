import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.nkilders.cartanautica',
  appName: 'Carta Nautica',
  webDir: 'www',
  plugins: {
    BackgroundRunner: {
      label: 'de.nkilders.cartanautica.bgtask',
      src: 'runners/background.js',
      event: 'myCustomEvent',
      repeat: true,
      interval: 1,
      autoStart: true,
    },
  },
};

export default config;
