import path from 'node:path';
import puppeteer from 'puppeteer-core';

const project = process.cwd();
const output = path.join(project, 'public', 'screens');
const executablePath = path.join(project, 'scripts', 'remotion-chrome');
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--single-process', '--disable-gpu', '--no-first-run', '--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({width: 1920, height: 1080, deviceScaleFactor: 1});

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const capture = async (name) => page.screenshot({path: path.join(output, `${name}.png`)});
const openFreshApp = async () => {
  await page.goto('http://127.0.0.1:8080/', {waitUntil: 'domcontentloaded'});
  await page.evaluate(() => localStorage.removeItem('kuna-fields-v2'));
  await page.reload({waitUntil: 'domcontentloaded'});
  await wait(2200);
};

await openFreshApp();
await capture('empty');

await page.click('#draw-field');
await wait(300);
await capture('draw-start');

for (const [index, point] of [[900, 360], [1020, 360], [1020, 435], [900, 435]].entries()) {
  await page.mouse.click(point[0], point[1]);
  await wait(220);
  await capture(`draw-${index + 1}`);
}

await page.click('#draw-field');
await wait(350);
await capture('rename');
await page.$eval('#rename-field-input', (input) => { input.value = 'Istočno polje'; });
await capture('rename-filled');
await page.click('#rename-field-form button');
await wait(400);
await page.click('#edit-field-crop');
await wait(250);
await capture('crop');
await page.$eval('#field-crop-input', (input) => { input.value = 'kukuruz'; });
await capture('crop-filled');
await page.click('#field-crop-form button');
await wait(900);
await capture('east-field');

await page.evaluate(() => {
  for (const layer of ['habitats', 'arkod', 'crop2022']) {
    const input = document.querySelector(`[data-map-layer="${layer}"]`);
    if (input && !input.checked) input.click();
  }
});
await wait(1400);
await capture('layers');

const modalScreen = async (modal, name) => {
  await page.evaluate((id) => document.querySelector(`[data-modal="${id}"]`)?.click(), modal);
  await wait(400);
  await capture(name);
  await page.evaluate(() => document.querySelector('dialog[open] .close-dialog')?.click());
  await wait(250);
};

await modalScreen('rizici', 'risks');
await modalScreen('scenariji', 'scenarios');
await modalScreen('bioraznolikost', 'biodiversity');
await page.click('#open-assistant');
await wait(450);
await capture('assistant');
await page.evaluate(() => document.querySelector('dialog[open] .close-dialog')?.click());
await wait(250);
await page.click('#download-field-pdf');
await wait(450);
await capture('report');

await browser.close();
