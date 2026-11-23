const puppeteer = require('puppeteer-core');
const path = require('path');

async function verifyCleanup() {
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

  // Verify pills/buttons are completely gone
  const buttonCount = await page.evaluate(() => document.querySelectorAll('button, aside').length);
  console.log('Visible buttons or aside elements:', buttonCount);

  // Check animation properties (should have NO filter: blur)
  const animStyles = await page.evaluate(() => {
    const styleSheet = Array.from(document.styleSheets);
    let keyframeText = '';
    for (const sheet of styleSheet) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.name === 'mechanicalFluidAppear') {
            keyframeText = rule.cssText;
          }
        }
      } catch (e) {}
    }
    return {
      hasBlur: keyframeText.includes('blur'),
      hasTranslate3d: keyframeText.includes('translate3d')
    };
  });
  console.log('Optimized Animation Check:', animStyles);

  const snapshotPath = path.join(artifactDir, 'clean-no-pill-optimized.png');
  await page.screenshot({ path: snapshotPath, type: 'png' });
  console.log('Saved clean screenshot:', snapshotPath);

  await browser.close();
}

verifyCleanup().catch(err => {
  console.error(err);
  process.exit(1);
});
