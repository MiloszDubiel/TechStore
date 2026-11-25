import { chromium } from "playwright";

const URLS = [
  {
    url: "https://mediamarkt.pl/pl/category/laptopy-25867.html",
    type: "laptop",
    categoryId: 2,
    subcategoryId: 9,
  },
  {
    url: "https://mediamarkt.pl/pl/category/komputery-stacjonarne-aio-25871.html",
    type: "desktop",
    categoryId: 1,
    subcategoryId: 1,
  },
];

const getUrl = (url: string, page: number) => `${url}?page=${page}`;

export async function scrapeMediaMarkt() {
  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  });

  const detailPage = await browser.newPage();

  const results: any[] = [];

  let cookiesAccepted = false;

  for (const category of URLS) {
    {
      for (let pageNumber = 1; pageNumber <= 1; pageNumber++) {
        console.log(`Pobieram: ${getUrl(category.url, pageNumber)}`);

        await page.goto(getUrl(category.url, pageNumber), {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });

        if (!cookiesAccepted) {
          try {
            await page.click('button:has-text("Akceptuję")', {
              timeout: 5000,
            });
          } catch {}

          cookiesAccepted = true;
        }

        await page.waitForTimeout(2000);

        const products = await page.evaluate(() => {
          const cards = [
            ...document.querySelectorAll("[data-test='mms-cofr-product-card']"),
          ];

          return cards.map((card: any) => ({
            link: card.querySelector("a.mms-ui-cJiGkM")?.href ?? null,
          }));
        });

        console.log(`Znaleziono ${products.length} produktów`);

        for (const product of products) {
          if (!product.link) continue;

          try {
            await detailPage.goto(product.link, {
              waitUntil: "domcontentloaded",
              timeout: 60000,
            });

            await detailPage
              .locator("#features-content")
              .scrollIntoViewIfNeeded();

            const data = await detailPage.evaluate(() => {
              const brand =
                document.querySelector(
                  '[data-test="mms-select-details-header"] span',
                )?.textContent ?? null;

              const img = (
                document.querySelector(
                  "img.pdp-gallery-image",
                ) as HTMLImageElement
              )?.src;

              return {
                description: document.querySelector("#description-content")
                  ?.textContent,
                img,
                brand,
                model: document
                  .querySelector(
                    "[data-test=mms-select-details-header] [data-test=pdp-article-number] ",
                  )
                  ?.textContent.replace("Numer produktu:", brand || ""),
                name: document.querySelector(
                  "[data-sctrack=pdp-product-headline]",
                )?.textContent,

                price: document.querySelectorAll(
                  "[data-test=mms-product-price] span",
                )[1]?.textContent,
              };
            });

            results.push({
              ...product,
              ...data,

              type: category.type,
              categoryId: category.categoryId,
              subcategoryId: category.subcategoryId,
            });
          } catch (err) {
            console.error(`Błąd produktu: ${product.link}`);
            console.error(err);
          }
        }
      }
    }

    console.log(`Pobrano ${results.length} produktów`);
  }
  await detailPage.close();
  await page.close();
  await browser.close();

  return results;
}
