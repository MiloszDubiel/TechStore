const { chromium } = require("playwright");

const URL = "https://mediamarkt.pl/pl/category/laptopy-25867.html";

async function scrapeMediaMarkt() {
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

    console.log(cards.length);

    return cards.map((card) => {
      //   const text = card.innerText;

      const name =
        card.querySelector("[data-test='product-title']")?.innerText || null;

      const price = card.querySelector(".mms-ui-mBgaT")?.innerText || null;

      //   const img = card.querySelector("img")?.src || null;

      //   const link = card.querySelector("a")?.href || null;

      return {
        name,
        price,
        // img,
        // link,
        // raw: text,
      };
    });
  });

  console.log(JSON.stringify(products, null, 2));

  await browser.close();
}

scrapeMediaMarkt();
