import puppeteer from "puppeteer";

const urls = [
  "https://articulo.mercadolibre.com.ve/MLV-756889406-funko-pop-stranger-things-dustin-demogorgon-eleven-with-eggo-_JM#position=2&search_layout=grid&type=item&tracking_id=caf2aad3-89f4-4c37-bf4d-666492ca9641",
  "https://articulo.mercadolibre.com.ve/MLV-777905916-figura-tipo-funko-pop-lionel-messi-_JM#position=1&search_layout=grid&type=item&tracking_id=b2c8d702-8e0c-45ed-b13b-6a4885428c17"
];


async function scrapeUrls(urls) {
  for (const url of urls) {
    console.log(`Scraping: ${url}`);
    await openWebPage(url);
   
  }
}

async function openWebPage(url) {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 500, 
  });
  const page = await browser.newPage();

  await page.goto(url);
  // await page.waitForSelector(".andes-card");


  const isTitleAvailable = await page.evaluate(() => {
    return Boolean(document.querySelector(".ui-pdp-title"));
  });


  const isQtyAvailable = await page.evaluate(() => {
    return Boolean(document.querySelector(".ui-pdp-buybox__quantity__available"));
  });


  if (isTitleAvailable && isQtyAvailable) {
    const result = await page.evaluate(() => {
      const title = document.querySelector(".ui-pdp-title").innerText;
      const available = document.querySelector(".ui-pdp-buybox__quantity__available").innerText;
      const price = document.querySelectorAll(".andes-money-amount__fraction")[0].innerText;
      const qty = available.replace(/[^0-9]+/g, "");

      const images = document.querySelectorAll(".ui-pdp-gallery__figure__image");
      const imageLinks = [...images].map(image => image.src);



      return { title, qty, price, imageLinks };
    });
    console.log(result);
    // await new Promise((r) => setTimeout(r, 30000));
  } else {
    console.log("One or more required elements are missing.");
    return "No se encontro la clase"
  }

  await browser.close();


  // const result = await page.evaluate(() => {

  //     const title = document.querySelector(".ui-pdp-title").innerText;
  //     const available = document.querySelector(".ui-pdp-buybox__quantity__available").innerText;


      // 
      //  

      // const qty = available.replace(/[^0-9]+/g, "");

      // return { title, qty};
    // });
    // return data;
  // });

  // console.log(result);


}




scrapeUrls(urls);











































// import puppeteer from "puppeteer";

// async function openWebPage() {
//   const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 600,
//   });
//   const page = await browser.newPage();

//   await page.goto("https://listado.mercadolibre.com.ve/funko#D[A:funko]");
//   await new Promise((r) => setTimeout(r, 3000));

//   const result = await page.evaluate(() => {
//     const quotes = document.querySelectorAll(".andes-card");
//     console.log(quotes);
    // const data = [...quotes].map((quote) => {
    //   const tittle = quote.querySelector(
    //     ".ui-search-link__title-card"
    //   ).innerText;

//         const prices = quote.querySelector(".andes-money-amount__fraction").innerText

//         const image = quote.querySelector(".ui-search-result-image__element")


//       return {
//         tittle,
//         prices,
//         image
//       };
//     });
//     return data;
//   });
//   console.log(result);
//   await new Promise((r) => setTimeout(r, 30000));
//   await browser.close();
// }

// openWebPage();
