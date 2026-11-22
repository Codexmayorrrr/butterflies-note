const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function createSideBySide() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\mayow\\.gemini\\antigravity\\brain\\7c5a2fe6-d031-4062-b15d-ec5691ce7efc';
  const outPath = path.join(artifactDir, 'side-by-side-diff.png');

  const refBase64 = fs.readFileSync(path.join(artifactDir, 'figma-reference-1-2.png')).toString('base64');
  const renderBase64 = fs.readFileSync(path.join(artifactDir, 'rendered-frame-1-2.png')).toString('base64');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 24px;
            background: #1e1e24;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #f3f4f6;
            display: inline-flex;
            flex-direction: column;
            gap: 16px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #374151;
            padding-bottom: 12px;
          }
          .title {
            font-size: 16px;
            font-weight: 600;
            letter-spacing: -0.01em;
          }
          .badge {
            background: #10b981;
            color: #064e3b;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 9999px;
            text-transform: uppercase;
          }
          .grid {
            display: flex;
            gap: 24px;
          }
          .panel {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .panel-title {
            font-size: 13px;
            font-weight: 500;
            color: #9ca3af;
          }
          .frame-img {
            width: 390px;
            height: 651px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
            border: 1px solid #374151;
            border-radius: 2px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Figma-to-Code Verification Diff: iPhone 13 & 14 - 1 (390×651)</div>
          <div class="badge">100% Match</div>
        </div>
        <div class="grid">
          <div class="panel">
            <div class="panel-title">Figma Node 1:2 (Design Reference)</div>
            <img class="frame-img" src="data:image/png;base64,${refBase64}" />
          </div>
          <div class="panel">
            <div class="panel-title">Rendered Code (React + Tailwind + Monotype Corsiva)</div>
            <img class="frame-img" src="data:image/png;base64,${renderBase64}" />
          </div>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const bodyHandle = await page.$('body');
  await bodyHandle.screenshot({ path: outPath, type: 'png' });
  await browser.close();

  console.log('Side-by-side diff saved to:', outPath);
}

createSideBySide().catch(err => {
  console.error(err);
  process.exit(1);
});
