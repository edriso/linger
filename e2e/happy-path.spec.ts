import { expect, test } from '@playwright/test';

test('open a shelf piece in the reader, then leave', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Good (morning|afternoon|evening)/ }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Library' }).click();
  await expect(page.getByRole('heading', { name: 'Library' })).toBeVisible();

  await page.getByRole('button', { name: /Read Why You/ }).click();

  // The full-screen reader opens with the prose.
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('On the vanished art of staying')).toBeVisible();

  await page.getByRole('button', { name: 'Leave' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('paste a text and see it in the library', async ({ page }) => {
  await page.goto('/library');

  await page.getByRole('button', { name: 'Paste text' }).click();
  await page.getByLabel('Title').fill('My Essay');
  await page
    .getByLabel('Text to read')
    .fill('This is a long enough pasted paragraph to be worth saving and reading later.');
  await page.getByRole('button', { name: 'Add to library' }).click();

  await expect(page.getByText('Your texts')).toBeVisible();
  await expect(page.getByText('My Essay')).toBeVisible();
});
