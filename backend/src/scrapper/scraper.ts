import { chromium } from "playwright";
import { saveToDatabase } from "./saveDataToDatabase";
const URL = "https://mediamarkt.pl/pl/category/laptopy-25867.html";

export async function scrapeMediaMarkt() {
  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  });

  await page.goto(URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  try {
    await page.click('button:has-text("Akceptuję")', {
      timeout: 5000,
    });
  } catch {}

  await page.waitForTimeout(5000);

  const products = await page.evaluate(() => {
    const cards = [
      ...document.querySelectorAll("[data-test='mms-product-card']"),
    ];

    return cards.map((card: any) => ({
      name:
        card.querySelector("[data-test='product-title']")?.innerText ?? null,

      price:
        card.querySelector("[data-test='mms-price'] span.mms-ui-mBgaT")
          ?.innerText ?? null,

      link: card.querySelector("a")?.href ?? null,
    }));
  });

  const results = [];

  for (let i = 0; i < 1; i++) {
    if (!products[i]?.link) continue;

    const detailPage = await browser.newPage();

    await detailPage.goto(products[i]?.link, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await detailPage.locator("#features-content").scrollIntoViewIfNeeded();

    await detailPage.waitForFunction(
      () => {
        return document.querySelectorAll("#features-content tr").length > 0;
      },
      null,
      {
        timeout: 15000,
      },
    );

    const data = await detailPage.evaluate(() => {
      const rows = [...document.querySelectorAll("#features-content tr")];
      const img = (
        document.querySelector("img.pdp-gallery-image") as HTMLImageElement
      )?.src;

      return {
        description:
          document.querySelector("#description-content")?.innerHTML ?? null,

        spec: rows
          .map((row) => {
            const cells = row.querySelectorAll("td");

            return {
              name: cells[0]?.textContent?.trim() ?? null,

              value: cells[1]?.textContent?.trim() ?? null,
            };
          })
          .filter((x) => x.name && x.value),
        img,
      };
    });

    results.push({
      ...products[i],
      ...data,
    });

    await detailPage.close();
  }

  await browser.close();

  return results;
}
