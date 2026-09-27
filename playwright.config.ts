import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4321,
    reuseExistingServer: true,
    timeout: 180_000,
    // Testler gerçek Firebase'e asla yazmasın: .env'deki değerleri boşalt (gerçek ortam değişkenleri .env'den önceliklidir).
    env: { PUBLIC_FIREBASE_API_KEY: '', PUBLIC_FIREBASE_PROJECT_ID: '' },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
});
