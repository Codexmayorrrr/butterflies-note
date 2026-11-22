const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testFullscreen() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\mayow\\.gemini\\antigravity\\brain\\7c5a2fe6-d031-4062-b15d-ec5691ce7efc';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Test 1: Desktop Viewport (1440x900)
  console.log('Testing Desktop Viewport (1440x900)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Verify background fill and styling
  const styles = await page.evaluate(() => {
    const main = document.querySelector('main');
    const article = document.querySelector('article');
    const firstWord = document.querySelector('.word-reveal, .word-revealed-instant');

    const mainStyle = window.getComputedStyle(main);
    const articleStyle = window.getComputedStyle(article);
    const wordStyle = firstWord ? window.getComputedStyle(firstWord) : null;

    return {
      mainBg: mainStyle.backgroundColor,
      mainWidth: mainStyle.width,
      mainHeight: mainStyle.height,
      articleWidth: articleStyle.width,
      fontFamily: articleStyle.fontFamily,
      fontSize: articleStyle.fontSize,
      lineHeight: articleStyle.lineHeight,
      textAlign: articleStyle.textAlign,
      wordAnimation: wordStyle ? wordStyle.animationName : null
    };
  });
  console.log('Desktop Computed Styles:', styles);

  // Capture mid-animation screenshot at 2 seconds
  await new Promise(r => setTimeout(r, 2000));
  const midAnimPath = path.join(artifactDir, 'desktop-mid-animation.png');
  await page.screenshot({ path: midAnimPath, type: 'png' });
  console.log('Saved mid-animation screenshot:', midAnimPath);

  // Click "Show All" to capture fully adapted layout
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const showAllBtn = buttons.find(b => b.textContent.includes('Show All'));
    if (showAllBtn) showAllBtn.click();
  });
  await new Promise(r => setTimeout(r, 200));

  const fullDesktopPath = path.join(artifactDir, 'desktop-fullscreen-revealed.png');
  await page.screenshot({ path: fullDesktopPath, type: 'png' });
  console.log('Saved full desktop screenshot:', fullDesktopPath);

  // Test 2: Mobile Viewport (390x844)
  console.log('Testing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  // Click Show All
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const showAllBtn = buttons.find(b => b.textContent.includes('Show All'));
    if (showAllBtn) showAllBtn.click();
  });
  await new Promise(r => setTimeout(r, 200));

  const mobilePath = path.join(artifactDir, 'mobile-fullscreen-revealed.png');
  await page.screenshot({ path: mobilePath, type: 'png' });
  console.log('Saved mobile screenshot:', mobilePath);

  await browser.close();
  console.log('All tests completed successfully!');
}

testFullscreen().catch(err => {
  console.error(err);
  process.exit(1);
});
