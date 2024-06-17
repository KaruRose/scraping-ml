import puppeteer from 'puppeteer'
import { supabase } from './config/supabase.js'

async function updateProductAvailabilities () {
  const { data: incProducts } = await supabase
    .from('inc_products')
    .select('*')

  const listProd = []
  let counter = 1

  for (const prod of incProducts) {
    if (prod.link) {
      console.log(`${counter}/${incProducts.length} - Updating stock of: ${prod.name}`)
      try {
        const { qty } = await startDownload(prod.link)
        listProd.push({
          ...prod,
          available: qty > 0,
          stock: qty
        })
      } catch (error) {
        listProd.push({
          ...prod,
          available: false,
          stock: -1
        })
      }
    }
    counter++
  }

  console.log('upsert')
  const { error } = await supabase
    .from('inc_products')
    .upsert(listProd)
    .select()

  if (error) {
    console.log(error)
  } else {
    // console.log(data.length())
  }
}

async function startDownload (url) {
  const browser = await puppeteer.launch({
    headless: true, // Cambia a true para modo sin cabeza
    slowMo: 50
  })

  const page = await browser.newPage()
  await page.goto(url)

  const isQtyAvailable = await page.evaluate(() => {
    return Boolean(document.querySelector('.ui-pdp-buybox__quantity__available'))
  })

  let result = {
    qty: 0
  }
  if (isQtyAvailable) {
    result = await page.evaluate(() => {
      const available = document.querySelector('.ui-pdp-buybox__quantity__available').innerText
      const qty = parseInt(available.replace(/[^0-9]+/g, ''))

      return { qty }
    })
  }

  await browser.close()

  return result
}

updateProductAvailabilities()
