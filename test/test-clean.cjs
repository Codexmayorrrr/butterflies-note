const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testCleanFullscreen() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\mayow\\.gemini\\antigravity\\brain\\7c5a2fe6-d031-4062-b15d-ec5691ce7efc';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // 1. Mobile Viewport (390x844)
  console.log('Capturing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Wait for all words to animate into view
  await new Promise(r => setTimeout(r, 6000));

  const mobilePath = path.join(artifactDir, 'mobile-clean-fullscreen.png');
  await page.screenshot({ path: mobilePath, type: 'png' });
  console.log('Saved clean mobile screenshot:', mobilePath);

  // 2. Desktop Viewport (1440x900)
  console.log('Capturing Desktop Viewport (1440x900)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 6000));

  const desktopPath = path.join(artifactDir, 'desktop-clean-fullscreen.png');
  await page.screenshot({ path: desktopPath, type: 'png' });
  console.log('Saved clean desktop screenshot:', desktopPath);

  await browser.close();
}

testCleanFullscreen().catch(err => {
  console.error(err);
  process.exit(1);
});
