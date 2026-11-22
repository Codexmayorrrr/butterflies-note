const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function runAudit() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\mayow\\.gemini\\antigravity\\brain\\7c5a2fe6-d031-4062-b15d-ec5691ce7efc';
  const referenceImgPath = path.join(artifactDir, 'figma-reference-1-2.png');
  const renderedImgPath = path.join(artifactDir, 'rendered-frame-1-2.png');

  console.log('1. Launching Headless Chrome for Computed-Style Audit...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 651, deviceScaleFactor: 1 });

  console.log('2. Navigating to pure artboard view (390x651)...');
  await page.goto('http://localhost:5174/?artboard=1', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Verify loaded fonts
  const fontStatus = await page.evaluate(() => {
    const fonts = [];
    for (const font of document.fonts) {
      fonts.push({
        family: font.family,
        status: font.status,
        weight: font.weight,
        style: font.style
      });
    }
    return fonts;
  });
  console.log('Loaded fonts in document.fonts:', JSON.stringify(fontStatus, null, 2));

  // Run Computed Style Audit
  const auditResults = await page.evaluate(() => {
    const frame = document.querySelector('[data-testid="figma-frame-1-2"]');
    const content = document.querySelector('[data-testid="figma-content-1-3"]');

    const frameStyle = window.getComputedStyle(frame);
    const contentStyle = window.getComputedStyle(content);
    const frameRect = frame.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    return {
      frame: {
        width: frameStyle.width,
        height: frameStyle.height,
        rectWidth: frameRect.width,
        rectHeight: frameRect.height,
        backgroundColor: frameStyle.backgroundColor,
        paddingTop: frameStyle.paddingTop,
        paddingBottom: frameStyle.paddingBottom,
        paddingLeft: frameStyle.paddingLeft,
        paddingRight: frameStyle.paddingRight,
        boxSizing: frameStyle.boxSizing
      },
      content: {
        width: contentStyle.width,
        height: contentStyle.height,
        rectWidth: contentRect.width,
        rectHeight: contentRect.height,
        color: contentStyle.color,
        fontFamily: contentStyle.fontFamily,
        fontSize: contentStyle.fontSize,
        lineHeight: contentStyle.lineHeight,
        textAlign: contentStyle.textAlign
      }
    };
  });

  console.log('3. Computed Style Audit Output:\n', JSON.stringify(auditResults, null, 2));

  // Capture screenshot of rendered frame
  console.log('4. Capturing rendered screenshot...');
  const frameElement = await page.$('[data-testid="figma-frame-1-2"]');
  await frameElement.screenshot({ path: renderedImgPath, type: 'png' });
  console.log('Saved rendered frame screenshot to:', renderedImgPath);

  await browser.close();

  // Save audit results to a JSON file
  fs.writeFileSync(
    path.join(artifactDir, 'audit-results.json'),
    JSON.stringify({ fontStatus, auditResults }, null, 2),
    'utf-8'
  );

  return { fontStatus, auditResults, renderedImgPath, referenceImgPath };
}

runAudit()
  .then(() => {
    console.log('Audit completed successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
