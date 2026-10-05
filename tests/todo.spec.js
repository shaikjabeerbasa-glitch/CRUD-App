const { test, expect } = require('@playwright/test');

const APP_URL = 'https://to-do-app-coral-six-53.vercel.app/';

async function addTask(page, taskText) {
  await page.getByLabel('Task name').fill(taskText);
  await page.getByRole('button', { name: /add task/i }).click();
}

test.describe('To-do app flow tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('F1: user can add a valid task', async ({ page }) => {
    await addTask(page, 'Buy groceries');

    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('1 task');
    await expect(page.getByLabel('Task name')).toHaveValue('');
  });

  test('F2: user can add multiple tasks and the counter updates', async ({ page }) => {
    const tasks = ['Write report', 'Pay bills', 'Call mom'];

    for (const task of tasks) {
      await addTask(page, task);
    }

    await expect(page.locator('.todo-item')).toHaveCount(3);
    await expect(page.locator('#task-count')).toHaveText('3 tasks');
  });

  test('F3: user can mark a task complete', async ({ page }) => {
    await addTask(page, 'Submit assignment');

    const checkbox = page.locator('.todo-item input[type="checkbox"]').first();
    await expect(checkbox).not.toBeChecked();

    await checkbox.check();

    await expect(checkbox).toBeChecked();
    await expect(page.locator('.todo-item')).toHaveClass(/completed/);
  });

  test('F4: user can edit an existing task', async ({ page }) => {
    await addTask(page, 'Read book');

    await page.locator('.edit-btn').click();
    const input = page.getByLabel('Task name');

    await expect(page.getByRole('button', { name: /save task/i })).toBeVisible();
    await input.fill('Read Python book');
    await page.getByRole('button', { name: /save task/i }).click();

    await expect(page.getByText('Read Python book')).toBeVisible();
    await expect(page.getByRole('button', { name: /add task/i })).toBeVisible();
  });

  test('F5: user can delete a task', async ({ page }) => {
    await addTask(page, 'Delete me');
    await addTask(page, 'Keep me');

    await page.locator('.delete-btn').first().click();

    await expect(page.getByText('Keep me')).not.toBeVisible();
    await expect(page.getByText('Delete me')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('1 task');
  });

  test('F6: deleting the last task shows empty state', async ({ page }) => {
    await addTask(page, 'Only task');

    await page.locator('.delete-btn').click();

    await expect(page.getByText('No tasks yet. Add one above!')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('0 tasks');
  });

  test('F7: empty submissions are rejected', async ({ page }) => {
    await page.getByLabel('Task name').fill('   ');
    await page.getByRole('button', { name: /add task/i }).click();

    await expect(page.locator('#task-count')).toHaveText('0 tasks');
    await expect(page.getByText('No tasks yet. Add one above!')).toBeVisible();
  });

  test('F8: tasks persist after a page refresh', async ({ page }) => {
    await addTask(page, 'Plan sprint');
    await addTask(page, 'Review pull request');

    await page.reload();

    await expect(page.getByText('Plan sprint')).toBeVisible();
    await expect(page.getByText('Review pull request')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('2 tasks');
  });

  test('F9: user can edit and save a task without breaking list state', async ({ page }) => {
    await addTask(page, 'Buy groceries');

    await page.locator('.edit-btn').click();
    const input = page.getByLabel('Task name');
    await input.fill('Buy groceries and milk');
    await page.getByRole('button', { name: /save task/i }).click();

    await expect(page.getByText('Buy groceries and milk')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('1 task');
  });

  test('F10: task count stays accurate across add, edit, and delete actions', async ({ page }) => {
    await addTask(page, 'Draft email');
    await addTask(page, 'Book flight');

    await page.locator('.edit-btn').first().click();
    await page.getByLabel('Task name').fill('Draft follow-up email');
    await page.getByRole('button', { name: /save task/i }).click();

    await page.locator('.delete-btn').last().click();

    await expect(page.getByText('Draft follow-up email')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('1 task');
  });
});
