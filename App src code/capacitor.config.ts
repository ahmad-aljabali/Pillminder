import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Pillwise',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
    cleartext: true
  }
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
      allowWhileIdle: true
    },
  },
};

export default config;
