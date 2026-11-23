const puppeteer = require('puppeteer-core');
const path = require('path');

async function testSignoffAndMusic() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\mayow\\.gemini\\antigravity\\brain\\7c5a2fe6-d031-4062-b15d-ec5691ce7efc';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Verify music controller is present
  const musicButton = await page.$('aside[aria-label="Background Music"] button');
  console.log('Music controller present:', !!musicButton);

  // Instantly reveal all words to verify the signoff text and styling
  await page.evaluate(() => {
    const words = document.querySelectorAll('.word-reveal, .opacity-0');
    words.forEach(w => {
      w.style.animation = 'none';
      w.style.opacity = '1';
      w.style.transform = 'none';
      w.style.filter = 'none';
    });
  });

  await new Promise(r => setTimeout(r, 500));

  const signoffText = await page.evaluate(() => {
    const paragraphs = Array.from(document.querySelectorAll('article p'));
    const lastP = paragraphs[paragraphs.length - 1];
    return {
      text: lastP ? lastP.textContent : null,
      html: lastP ? lastP.innerHTML : null,
      align: lastP ? window.getComputedStyle(lastP).textAlign : null
    };
  });

  console.log('Signoff Details:', signoffText);

  const snapshotPath = path.join(artifactDir, 'signoff-and-music.png');
  await page.screenshot({ path: snapshotPath, type: 'png' });
  console.log('Saved screenshot:', snapshotPath);

  await browser.close();
}

testSignoffAndMusic().catch(err => {
  console.error(err);
  process.exit(1);
});
