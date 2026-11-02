import { test, expect } from "@playwright/test";
import catalog from "../shared/catalog.json";

test("all generated pages, collection routes and local images load", async ({
  page,
  request,
}) => {
  const routes = [
    "/",
    "/shop/",
    "/categories/",
    "/cart/",
    "/wishlist/",
    "/checkout/",
    "/about/",
    "/contact/",
    "/bulk-enquiry/",
    ...catalog.categories.map((c) => "/collections/" + c.id + "/"),
    ...catalog.products.map((p) => "/products/" + p.slug + "/"),
  ];
  for (const route of routes) {
    const r = await request.get(route);
    expect(r.status(), route).toBe(200);
  }
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "POWERING EVERY SPACE." }),
  ).toBeVisible();
  await page.locator("footer").scrollIntoViewIfNeeded();
  const broken = await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs.flatMap((i) =>
        i instanceof HTMLImageElement && (!i.complete || i.naturalWidth === 0)
          ? [i.src]
          : [],
      ),
    );
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
});

test("slider, category navigation and live header search", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Next slide", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "LIGHT THAT FEELS LIKE HOME." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Previous slide", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "POWERING EVERY SPACE." }),
  ).toBeVisible();
  await page
    .locator(".category-tile")
    .filter({ hasText: "Fans & Fixtures" })
    .click();
  await expect(page).toHaveURL(/collections\/fans-fixtures/);
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page
    .getByRole("searchbox", { name: "Search products", exact: true })
    .fill("warm led");
  await expect(page.locator(".search-suggestions a")).toHaveCount(1);
  await page.locator(".search-suggestions a").click();
  await expect(
    page.getByRole("heading", { name: "Warm LED Bulb, 9W", exact: true }),
  ).toBeVisible();
});

test("catalog filters, sorting and empty search reset", async ({ page }) => {
  await page.goto("/shop/");
  await expect(page.locator(".product-card")).toHaveCount(16);
  await page.getByLabel("LED Lighting", { exact: false }).check();
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("radio", { name: "Luma Demo", exact: true }).check();
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("combobox").selectOption("price-desc");
  expect(await page.locator(".product-title").first().textContent()).toContain(
    "Recessed",
  );
  await page.getByLabel("Max price").fill("300");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page
    .getByRole("searchbox", { name: "Search catalog products" })
    .fill("no-such-product");
  await expect(
    page.getByRole("heading", { name: "No products found." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset filters", exact: true })
    .last()
    .click();
  await expect(page.locator(".product-card")).toHaveCount(16);
});

test("product gallery, specs, quantity, persistent cart and totals", async ({
  page,
}) => {
  await page.goto("/products/ivory-modular-switch/");
  await page
    .getByRole("button", { name: "Show specification checklist" })
    .click();
  await expect(page.locator(".main-product-image img")).toHaveAttribute(
    "src",
    "/assets/product-spec.svg",
  );
  await page.getByRole("tab", { name: "Specifications", exact: true }).click();
  await expect(page.locator(".spec-table")).toContainText("6A");
  await page
    .getByRole("button", { name: "Increase quantity", exact: true })
    .click();
  await page.getByRole("button", { name: "ADD TO CART", exact: true }).click();
  await page.goto("/cart/");
  await expect(page.getByTestId("cart-subtotal")).toHaveText("₹298");
  await page
    .getByRole("button", { name: "Increase Ivory Modular Switch, 6A quantity" })
    .click();
  await expect(page.getByTestId("cart-subtotal")).toHaveText("₹447");
  await page.reload();
  await expect(
    page.getByLabel("Ivory Modular Switch, 6A quantity", { exact: true }),
  ).toHaveValue("3");
  await page
    .getByRole("button", { name: "Remove Ivory Modular Switch, 6A from cart" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your next upgrade is waiting." }),
  ).toBeVisible();
});

test("wishlist persists, moves a product to cart, and supports removal", async ({
  page,
}) => {
  await page.goto("/shop/");
  await page
    .getByRole("button", {
      name: "Save Warm LED Bulb, 9W to wishlist",
      exact: true,
    })
    .click();
  await page.goto("/wishlist/");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Move to cart", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "A little inspiration goes a long way.",
    }),
  ).toBeVisible();
  await page.goto("/cart/");
  await expect(page.getByTestId("cart-subtotal")).toHaveText("₹199");
  await page.goto("/shop/");
  await page
    .getByRole("button", {
      name: "Save Warm LED Bulb, 9W to wishlist",
      exact: true,
    })
    .click();
  await page.goto("/wishlist/");
  await page
    .getByRole("button", {
      name: "Remove Warm LED Bulb, 9W from wishlist",
      exact: true,
    })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(0);
});

test("checkout validates and confirms demo without storing personal details", async ({
  page,
}) => {
  await page.goto("/products/warm-led-bulb-9w/");
  await page.getByRole("button", { name: "ADD TO CART", exact: true }).click();
  await page.goto("/checkout/");
  await page
    .getByRole("button", { name: "Complete demo checkout", exact: true })
    .click();
  await expect(
    page.getByText("Enter your full name (2–100 characters)."),
  ).toBeVisible();
  for (const [id, value] of Object.entries({
    "checkout-name": "Demo Customer",
    "checkout-phone": "9876543210",
    "checkout-email": "demo@example.com",
    "checkout-address": "12 Example Street, Hingna",
    "checkout-city": "Nagpur",
    "checkout-state": "Maharashtra",
    "checkout-pin": "441110",
  }))
    await page.locator("#" + id).fill(value);
  await page
    .getByLabel(
      "I understand this is a demonstration and no real order will be placed.",
    )
    .check();
  await page
    .getByRole("button", { name: "Complete demo checkout", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "That’s how easy it could be." }),
  ).toBeVisible();
  await expect(page.locator(".demo-reference")).toContainText("DEMO-");
  const storage = await page.evaluate(() => JSON.stringify(localStorage));
  expect(storage).not.toContain("Demo Customer");
  expect(storage).not.toContain("9876543210");
  expect(storage).not.toContain("Example Street");
  await page.goto("/cart/");
  await expect(
    page.getByRole("heading", { name: "Your next upgrade is waiting." }),
  ).toBeVisible();
});

test("contact validation and encoded WhatsApp bulk enquiry are clearly demos", async ({
  page,
}) => {
  await page.goto("/contact/");
  await expect(
    page.getByText("Unverified contact · Confirm before calling"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Validate demo message" }).click();
  await expect(
    page.getByText("Enter your name (2–100 characters)."),
  ).toBeVisible();
  await page.getByLabel("Full name", { exact: false }).fill("Demo Visitor");
  await page
    .getByLabel("Email address", { exact: false })
    .fill("visitor@example.com");
  await page
    .getByLabel("How can we help?", { exact: false })
    .fill("I am looking for lighting products.");
  await page.getByRole("button", { name: "Validate demo message" }).click();
  await expect(
    page.getByRole("heading", { name: "Your message looks good." }),
  ).toBeVisible();
  await expect(
    page.getByText("No message was delivered to the shop", { exact: false }),
  ).toBeVisible();
  await page.goto("/bulk-enquiry/");
  await page
    .getByLabel("Customer name", { exact: false })
    .fill("Demo Contractor");
  await page.getByLabel("Company name", { exact: false }).fill("A & B Example");
  await page.getByLabel("Mobile number", { exact: false }).fill("9876543210");
  await page.getByLabel("Approximate quantity", { exact: false }).fill("50");
  await page
    .getByLabel("Product requirements", { exact: false })
    .fill("Switches & cables, 6A / 16A");
  await page
    .getByLabel("Additional message", { exact: false })
    .fill("Project: home #2 + office");
  await page.getByRole("button", { name: "Prepare bulk enquiry" }).click();
  const link = page.getByRole("link", { name: "Review on WhatsApp" });
  await expect(link).toBeVisible();
  const url = new URL((await link.getAttribute("href"))!);
  expect(url.hostname).toBe("wa.me");
  expect(url.pathname).toBe("/919322172834");
  expect(url.searchParams.get("text")).toContain("A & B Example");
  expect(url.searchParams.get("text")).toContain("Project: home #2 + office");
  await expect(
    page.getByText("Number not yet verified:", { exact: false }),
  ).toBeVisible();
});

test("mobile navigation and all page layouts have no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator("#mobile-nav")
    .getByRole("link", { name: "Shop all products" })
    .click();
  await expect(page).toHaveURL(/\/shop\//);
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await expect(page.locator(".filter-panel")).toBeVisible();
  await page.getByLabel("LED Lighting", { exact: false }).check();
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Close filters" }).click();
  for (const route of [
    "/",
    "/shop/",
    "/categories/",
    "/collections/smart-electricals/",
    "/products/aero-ceiling-fan/",
    "/cart/",
    "/wishlist/",
    "/checkout/",
    "/about/",
    "/contact/",
    "/bulk-enquiry/",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
});
