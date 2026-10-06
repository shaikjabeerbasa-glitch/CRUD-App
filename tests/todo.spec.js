const { test, expect } = require('@playwright/test');

const APP_URL = 'https://to-do-app-coral-six-53.vercel.app/';

function getTaskRow(page, taskText) {
  return page.getByRole('listitem').filter({ hasText: taskText });
}

async function addTask(page, taskText) {
  const input = page.getByRole('textbox', { name: /task name/i });
  await input.fill(taskText);
  await page.getByRole('button', { name: /^add task$/i }).click();
}

test.describe('To-do app flow tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('F1: user can add a valid task', async ({ page }) => {
    await addTask(page, 'Buy groceries');

    await expect(getTaskRow(page, 'Buy groceries')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('1 task');
    await expect(page.getByRole('textbox', { name: /task name/i })).toHaveValue('');
  });

  test('F2: user can add multiple tasks and the counter updates', async ({ page }) => {
    const tasks = ['Write report', 'Pay bills', 'Call mom'];

    for (const task of tasks) {
      await addTask(page, task);
    }

    await expect(page.getByRole('listitem')).toHaveCount(3);
    await expect(page.locator('#task-count')).toHaveText('3 tasks');
  });

  test('F3: user can mark a task complete', async ({ page }) => {
    await addTask(page, 'Submit assignment');

    const row = getTaskRow(page, 'Submit assignment');
    const checkbox = row.getByRole('checkbox');

    await expect(checkbox).not.toBeChecked();
    await checkbox.check();

    await expect(checkbox).toBeChecked();
    await expect(row).toHaveClass(/completed/);
  });

  test('F4: user can edit an existing task', async ({ page }) => {
    await addTask(page, 'Read book');

    const row = getTaskRow(page, 'Read book');
    await row.getByRole('button', { name: /^edit$/i }).click();

    const input = page.getByRole('textbox', { name: /task name/i });
    await expect(page.getByRole('button', { name: /^save task$/i })).toBeVisible();
    await input.fill('Read Python book');
    await page.getByRole('button', { name: /^save task$/i }).click();

    await expect(getTaskRow(page, 'Read Python book')).toBeVisible();
    await expect(page.getByRole('button', { name: /^add task$/i })).toBeVisible();
  });

  test('F5: user can delete a task', async ({ page }) => {
    await addTask(page, 'Delete me');
    await addTask(page, 'Keep me');

    const latestTaskRow = page.getByRole('listitem').first();
    await latestTaskRow.getByRole('button', { name: /^delete$/i }).click();

    await expect(getTaskRow(page, 'Keep me')).not.toBeVisible();
    await expect(getTaskRow(page, 'Delete me')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('1 task');
  });

  test('F6: deleting the last task shows empty state', async ({ page }) => {
    await addTask(page, 'Only task');

    await getTaskRow(page, 'Only task').getByRole('button', { name: /^delete$/i }).click();

    await expect(page.getByText('No tasks yet. Add one above!')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('0 tasks');
  });

  test('F7: empty submissions are rejected', async ({ page }) => {
    await page.getByRole('textbox', { name: /task name/i }).fill('   ');
    await page.getByRole('button', { name: /^add task$/i }).click();

    await expect(page.locator('#task-count')).toHaveText('0 tasks');
    await expect(page.getByText('No tasks yet. Add one above!')).toBeVisible();
  });

  test('F8: tasks persist after a page refresh', async ({ page }) => {
    await addTask(page, 'Plan sprint');
    await addTask(page, 'Review pull request');

    await page.reload();

    await expect(getTaskRow(page, 'Plan sprint')).toBeVisible();
    await expect(getTaskRow(page, 'Review pull request')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('2 tasks');
  });

  test('F9: user can edit and save a task without breaking list state', async ({ page }) => {
    await addTask(page, 'Buy groceries');

    await getTaskRow(page, 'Buy groceries').getByRole('button', { name: /^edit$/i }).click();

    const input = page.getByRole('textbox', { name: /task name/i });
    await input.fill('Buy groceries and milk');
    await page.getByRole('button', { name: /^save task$/i }).click();

    await expect(getTaskRow(page, 'Buy groceries and milk')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('1 task');
  });

  test('F10: task count stays accurate across add, edit, and delete actions', async ({ page }) => {
    await addTask(page, 'Draft email');
    await addTask(page, 'Book flight');

    const firstRow = page.getByRole('listitem').first();
    await firstRow.getByRole('button', { name: /^edit$/i }).click();
    await page.getByRole('textbox', { name: /task name/i }).fill('Draft follow-up email');
    await page.getByRole('button', { name: /^save task$/i }).click();

    await page.getByRole('listitem').last().getByRole('button', { name: /^delete$/i }).click();

    await expect(getTaskRow(page, 'Draft follow-up email')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('1 task');
  });
});
