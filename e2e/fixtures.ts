import { test as base, expect } from '@playwright/test';

// Dış yazı tipi isteklerini keser (yazı tipleri artık projede; bu yalnızca eski/dış istekler için bir güvenlik ağı).
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
    await use(page);
  },
});

export { expect };
