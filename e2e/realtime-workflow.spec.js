import { test, expect } from "@playwright/test";
import process from "node:process";

test("E2E Realtime workflow Testing: User creates tickets ➔ Admin edit status ➔ User sees updated status", async ({
  browser,
}) => {
  // 1. Create two separate browser contexts for User and Admin
  const userContext = await browser.newContext();
  const adminContext = await browser.newContext();

  const userPage = await userContext.newPage();
  const adminPage = await adminContext.newPage();

  const userEmail = process.env.TEST_USER_EMAIL || "user@example.com";
  const userPassword = process.env.TEST_USER_PASSWORD || "user123";
  const adminEmail = process.env.TEST_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.TEST_ADMIN_PASSWORD || "admin123";

  // 2. User logs in
  await userPage.goto("/login");
  await userPage.fill('input[type="email"]', userEmail);
  await userPage.fill('input[type="password"]', userPassword);
  await Promise.all([
    userPage.waitForURL(/\/dashboard$/, { timeout: 10000 }),
    userPage.click('button[type="submit"]'),
  ]);
  console.log("Current URL after login:", userPage.url());

  // 2.5 Redirect to User personal dashboard
  await Promise.all([
    userPage.waitForURL(/\/dashboard\/.+/),
    userPage.getByRole("link", { name: /personal/i }).click(), // navigate to personal dashboard
  ]);
  console.log("Current URL after login:", userPage.url());

  // 3. Admin logs in
  await adminPage.goto("/login");
  await adminPage.fill('input[type="email"]', adminEmail);
  await adminPage.fill('input[type="password"]', adminPassword);
  await Promise.all([
    adminPage.waitForURL(/\/dashboard(\/.*)?$/, { timeout: 10000 }),
    adminPage.click('button[type="submit"]'),
  ]);

  // 4. User creates a new maintenance ticket
  const uniqueTitle = `Screen Auto-illumination Test_${Date.now()}`;
  const createBtn = userPage.getByTestId("create-ticket-btn");
  await createBtn.waitFor({ state: "visible" });
  await createBtn.click();

  await userPage.fill('input[name="title"]', uniqueTitle);
  await userPage.fill(
    'textarea[name="description"]',
    "Screen auto-illumination issue when brightness is set to 0.",
  );
  await userPage.getByRole("button", { name: "Submitted" }).click();

  // Verify that the ticket appears in the User's dashboard
  await expect(userPage.locator(`text=${uniqueTitle}`)).toBeVisible();

  // 5. Ticket also show up in Admin's dashboard (Also verify Realtime Workflow at admin side)
  await expect(adminPage.locator(`text=${uniqueTitle}`)).toBeVisible({
    timeout: 5000,
  });

  // 6. Admin edit ticket status to 'In Progress'

  // Redirect to personal dashboard
  await Promise.all([
    adminPage.waitForURL(/\/dashboard\/.+/),
    adminPage.getByRole("link", { name: /personal/i }).click(), // navigate to personal dashboard
  ]);
  console.log("Current URL after login:", adminPage.url());
  const ticketCardInAdmin = adminPage
    .locator('[data-slot="card"]')
    .filter({ hasText: uniqueTitle });

  // Ensure ticket visible in Admin dashboard
  await ticketCardInAdmin.waitFor({ state: "visible", timeout: 10000 });

  // Click the Edit button on the ticket card
  const editBtn = ticketCardInAdmin.getByRole("button", { name: /edit/i });
  await editBtn.click();

  // Handle Shadcn UI Select
  // Click the select that includs pending option
  await adminPage
    .getByRole("combobox")
    .filter({ hasText: /pending/i })
    .click();

  // Choose the "In Progress" option from the dropdown
  await adminPage.getByRole("option", { name: /in progress/i }).click();

  // Save the changes
  await adminPage.getByRole("button", { name: /submitted/i }).click();

  // 7. Verify that the ticket is updated without refreshing
  // Verify that the ticket appears in the User's personal dashboard
  const ticketCardInUser = userPage
    .locator('[data-slot="card"]')
    .filter({ hasText: uniqueTitle });

  // Verify that the status text is updated to "In Progress" in the User's dashboard
  await expect(ticketCardInUser).toContainText(/in progress/i, {
    timeout: 10000, // Set a longer timeout for theWebSocket
  });

  // Cleanup: Close the browser contexts
  await userContext.close();
  await adminContext.close();
});
