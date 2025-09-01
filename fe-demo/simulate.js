// simulate.js
import { chromium } from 'playwright';

const CONFIG = {
  baseUrl:
    process.env.FRONTEND_URL || 'https://signoz-fe-monitoring.vercel.app',
  iterations: process.env.ITERATIONS || 0,
  actionDelay: 1000,
  iterationDelay: 5000,
  headless: process.env.HEADLESS !== 'false',
};

const SAMPLE_EXPENSES = [
  {
    title: 'Coffee Shop',
    amount: 4.5,
    category: 'Food & Dining',
    description: 'Morning coffee',
  },
  {
    title: 'Gas Station',
    amount: 45.0,
    category: 'Transportation',
    description: 'Fuel for week',
  },
  {
    title: 'Grocery Store',
    amount: 120.0,
    category: 'Food & Dining',
    description: 'Weekly groceries',
  },
  {
    title: 'Movie Tickets',
    amount: 28.0,
    category: 'Entertainment',
    description: 'Weekend movie',
  },
  {
    title: 'Electric Bill',
    amount: 85.0,
    category: 'Utilities',
    description: 'Monthly payment',
  },
];

const randomChoice = array => array[Math.floor(Math.random() * array.length)];
const log = msg => console.log(`[${new Date().toISOString()}] ${msg}`);

async function addExpense(page) {
  try {
    // Click the "Add Expense" button in the header navigation
    const addButton = await page.locator('a[href="/expense/new"]').first();
    if (addButton) {
      await addButton.click();
      await page.waitForTimeout(CONFIG.actionDelay);

      const expense = randomChoice(SAMPLE_EXPENSES);

      // Fill in the expense form with correct selectors
      await page.fill('input[id="title"]', expense.title);
      await page.fill('input[id="amount"]', expense.amount.toString());
      await page.selectOption('select[id="category"]', expense.category);
      await page.fill(
        'input[id="date"]',
        new Date().toISOString().split('T')[0]
      );
      if (expense.description) {
        await page.fill('textarea[id="description"]', expense.description);
      }

      // Submit the form using the submit button
      await page.click('button[type="submit"]');
      await page.waitForTimeout(CONFIG.actionDelay * 2);
      log(`Added expense: ${expense.title}`);
    }
  } catch (error) {
    log(`Error adding expense: ${error.message}`);
  }
}

async function scrollExpenses(page) {
  try {
    if (page.url() !== `${CONFIG.baseUrl}/`) {
      await page.goto(`${CONFIG.baseUrl}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(CONFIG.actionDelay);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(CONFIG.actionDelay);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(CONFIG.actionDelay);
    log('Scrolled through expenses');
  } catch (error) {
    log(`Error scrolling: ${error.message}`);
  }
}

async function editExpense(page) {
  try {
    if (page.url() !== `${CONFIG.baseUrl}/`) {
      await page.goto(`${CONFIG.baseUrl}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(CONFIG.actionDelay);
    }

    // Find edit button using the correct selector - it's a Link with href containing /edit
    const editButton = await page.locator('a[href*="/edit"]').first();
    if (editButton) {
      await editButton.click();
      await page.waitForTimeout(CONFIG.actionDelay);

      // Find and update the title field
      const titleInput = await page.locator('input[id="title"]').first();
      if (titleInput) {
        const currentTitle = await titleInput.inputValue();
        await titleInput.fill(`${currentTitle} (Updated)`);

        // Submit the form
        await page.click('button[type="submit"]');
        await page.waitForTimeout(CONFIG.actionDelay * 2);
        log('Edited expense');
      }
    }
  } catch (error) {
    log(`Error editing: ${error.message}`);
  }
}

async function deleteExpense(page) {
  try {
    if (page.url() !== `${CONFIG.baseUrl}/`) {
      await page.goto(`${CONFIG.baseUrl}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(CONFIG.actionDelay);
    }

    // Find delete button using the correct selector - it's a button with title="Delete expense"
    const deleteButton = await page
      .locator('button[title="Delete expense"]')
      .first();
    if (deleteButton) {
      await deleteButton.click();
      await page.waitForTimeout(CONFIG.actionDelay);

      log('Deleted expense');
    }
  } catch (error) {
    log(`Error deleting: ${error.message}`);
  }
}

async function simulateActions(page) {
  log('Starting simulation...');
  await page.goto(`${CONFIG.baseUrl}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(CONFIG.actionDelay);

  await addExpense(page);
  await scrollExpenses(page);
  await editExpense(page);
  await deleteExpense(page);

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(CONFIG.actionDelay);
  log('Simulation completed');
}

async function run() {
  let browser;
  let iteration = 0;

  try {
    log(`Starting simulation against: ${CONFIG.baseUrl}`);
    browser = await chromium.launch({ headless: CONFIG.headless });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });

    // Set up dialog handler once for the entire session
    page.on('dialog', async dialog => {
      if (dialog.type() === 'confirm') {
        await dialog.accept();
      }
    });

    do {
      iteration++;
      log(`Iteration ${iteration}`);
      try {
        await simulateActions(page);
      } catch (error) {
        log(`Error in iteration ${iteration}: ${error.message}`);
      }
      if (CONFIG.iterations === 0 || iteration < CONFIG.iterations) {
        await page.waitForTimeout(CONFIG.iterationDelay);
      }
    } while (CONFIG.iterations === 0 || iteration < CONFIG.iterations);

    log(`Completed ${iteration} iterations`);
  } catch (error) {
    log(`Fatal error: ${error.message}`);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

process.on('SIGINT', () => {
  log('Shutting down...');
  process.exit(0);
});

run();
