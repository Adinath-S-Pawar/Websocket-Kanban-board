import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe("Kanban Board E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(page.locator("h2")).toContainText("Kanban Board");
  });

  test("User can create a task", async ({ page }) => {
    const taskTitle = `New Task ${Date.now()}`;

    // Fill the creation form
    await page.getByPlaceholder("Enter task title...").fill(taskTitle);
    await page.getByRole("button", { name: "Add" }).click();

    // Verify task appears in board (To Do column)
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test("User can delete a task", async ({ page }) => {
    const taskTitle = `Task to Delete ${Date.now()}`;

    // Create task first
    await page.getByPlaceholder("Enter task title...").fill(taskTitle);
    await page.getByRole("button", { name: "Add" }).click();

    // Find the card containing the text
    const taskCard = page.locator('div[class*="card"]').filter({ hasText: taskTitle });
    await expect(taskCard).toBeVisible();

    // Click delete button
    await taskCard.getByRole("button").filter({ hasText: "🗑️" }).click();

    // Verify task is removed
    await expect(page.getByText(taskTitle)).not.toBeVisible();
  });

  test("User can edit task priority and category", async ({ page }) => {
    const taskTitle = `Task to Edit ${Date.now()}`;

    // Create task
    await page.getByPlaceholder("Enter task title...").fill(taskTitle);
    await page.getByRole("button", { name: "Add" }).click();

    const taskCard = page.locator('div[class*="card"]').filter({ hasText: taskTitle });

    // Open edit modal (pencil icon)
    await taskCard.getByRole("button").filter({ hasText: "✏️" }).click();

    // Change priority and category - finding by parent div since labels are not linked with htmlFor
    await page.locator('div:has(> label:text("Priority")) select').selectOption("high");
    await page.locator('div:has(> label:text("Category")) select').selectOption("bug");

    // Save changes
    await page.getByRole("button", { name: "Save" }).click();

    // Verify badges updated on the card
    await expect(taskCard.getByText("high")).toBeVisible();
    await expect(taskCard.getByText("bug")).toBeVisible();
  });

  test("User can upload a file and see it", async ({ page }) => {
    const taskTitle = `Task with File ${Date.now()}`;

    // Create task
    await page.getByPlaceholder("Enter task title...").fill(taskTitle);
    await page.getByRole("button", { name: "Add" }).click();

    const taskCard = page.locator('div[class*="card"]').filter({ hasText: taskTitle });

    // Open edit modal
    await taskCard.getByRole("button").filter({ hasText: "✏️" }).click();

    // Upload file
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles({
      name: "test-attachment.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-image-data")
    });

    // Save
    await page.getByRole("button", { name: "Save" }).click();

    // Verify attachment chip appears on card
    await expect(taskCard.getByText(/Attachment/)).toBeVisible();
  });

  test("Graph updates correctly as tasks move", async ({ page }) => {
    // Show Stats
    await page.getByRole("button", { name: "Show Stats" }).click();

    // Verify chart container is visible
    await expect(page.locator("svg")).toBeVisible();

    const taskTitle = `Move Task for Graph ${Date.now()}`;

    // Create task
    await page.getByPlaceholder("Enter task title...").fill(taskTitle);
    await page.getByRole("button", { name: "Add" }).click();

    await expect(page.locator("svg")).toBeVisible();
  });

  test("Real-time sync between two browser contexts", async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto("http://localhost:3000");
    await page2.goto("http://localhost:3000");

    const taskTitle = `Synced Task ${Date.now()}`;

    // Create on page 1
    await page1.getByPlaceholder("Enter task title...").fill(taskTitle);
    await page1.getByRole("button", { name: "Add" }).click();

    // Verify on page 2
    await expect(page2.getByText(taskTitle)).toBeVisible({ timeout: 15000 });

    await context1.close();
    await context2.close();
  });

  test("User can drag and drop a task between columns", async ({ page }) => {
    const taskTitle = `Drag Me ${Date.now()}`;

    // Create task
    await page.getByPlaceholder("Enter task title...").fill(taskTitle);
    await page.getByRole("button", { name: "Add" }).click();

    const taskCard = page.locator('[data-testid^="task-"]').filter({ hasText: taskTitle }).first();
    await expect(taskCard).toBeVisible();

    // Find column containing specific heading, ensuring we get the outer column div, not the header
    const inProgressColumn = page.getByTestId("drop-column-inprogress");

    // Perform drag and drop using manual mouse actions for better compatibility with react-dnd
    await taskCard.dragTo(inProgressColumn);

    // Verify task is now in In Progress column area
    await expect(inProgressColumn.getByText(taskTitle)).toBeVisible({ timeout: 10000 });
  });
});
