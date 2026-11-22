const puppeteer = require('puppeteer-core');
const path = require('path');

async function captureSequence() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\mayow\\.gemini\\antigravity\\brain\\7c5a2fe6-d031-4062-b15d-ec5691ce7efc';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Capture at 3s into the slowed mechanical flow
  await new Promise(r => setTimeout(r, 3000));
  const t3Path = path.join(artifactDir, 'mechanical-flow-3s.png');
  await page.screenshot({ path: t3Path, type: 'png' });
  console.log('Saved 3s snapshot:', t3Path);

  // Capture at 6s into the flow
  await new Promise(r => setTimeout(r, 3000));
  const t6Path = path.join(artifactDir, 'mechanical-flow-6s.png');
  await page.screenshot({ path: t6Path, type: 'png' });
  console.log('Saved 6s snapshot:', t6Path);

  await browser.close();
}

captureSequence().catch(err => {
  console.error(err);
  process.exit(1);
});
