import { test, expect } from "@playwright/test";


test.setTimeout(30_000);

test("Login-Flow und Auth-UI sichtbar", async ({ page }) => {
    await page.goto("/signin");

    await page.getByLabel(/^E-Mail$/i).fill("cto@techradar.com");
    await page.getByLabel(/^Passwort$/i).fill("mrboss123");
    await Promise.all([
        page.waitForURL("**/", { timeout: 10_000 }),
        page.getByRole("button", { name: /Anmelden/i }).click(),
    ]);

    await expect(
        page.getByRole("button", { name: /Logout/i })
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.locator('a[href="/admin/manage"]')).toBeVisible();
});
