import puppeteer from "puppeteer";
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { supabase } from './config/supabase.js'

const currentDir = path.dirname(decodeURI(new URL(import.meta.url).pathname));

const projectRoot = path.join(currentDir, '..');

async function downloaderImages() {
  let { data: inc_products, error } = await supabase
    .from('inc_products')
    .select('link')

  for (const prod of inc_products) {
    if (prod.link && !prod.link.includes('google')) {
        console.log(`Downloading images of: ${prod.link}`);
        await startDownload(prod.link);
    }
  }
}

async function startDownload(url) {
  const browser = await puppeteer.launch({
    headless: true, // Cambia a true para modo sin cabeza
    slowMo: 50,
  });

  const page = await browser.newPage();

  await page.goto(url);

  const result = await page.evaluate(() => {
    const title = document.querySelector(".ui-pdp-title").innerText;
    const images = document.querySelectorAll(".ui-pdp-gallery__figure__image");
    let imageLinks = [...images].map(image => image.src);
    imageLinks = imageLinks.filter(link => link.match(/\.(webp|png|jpg|jpeg|avif)$/));

    return { title, imageLinks };
  });

  console.log(result);

  for (let index = 0; index < result.imageLinks.length; index++) {
    const imageUrl = result.imageLinks[index];
    await downloadImage(imageUrl, `${result.title}-${index+1}`);    
  }

  await browser.close();
}

async function downloadImage(url, name) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = path.extname(new URL(url).pathname);
  const fileName = `${name}${extension}`;

  const storagePath = path.join(projectRoot, 'storage');
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }

  const filePath = path.join(storagePath, fileName);
  fs.writeFile(filePath, buffer, () =>
  console.log(`Downloaded ${fileName}`));
}

const imagesDir = './storage';
if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
}

downloaderImages();
