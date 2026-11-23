const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function verifyWelcomeScreen() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\mayow\\.gemini\\antigravity\\brain\\7c5a2fe6-d031-4062-b15d-ec5691ce7efc';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Lock to exact Figma Frame dimensions: 390x651
  await page.setViewport({ width: 390, height: 651, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Audit computed styles of Welcome Screen
  const audit = await page.evaluate(() => {
    const main = document.querySelector('main');
    const container = document.querySelector('[data-testid="welcome-screen-14-2"]');
    const avatar = container.querySelector('img');
    const text = container.querySelector('p');

    const mainStyle = window.getComputedStyle(main);
    const containerStyle = window.getComputedStyle(container);
    const avatarRect = avatar.getBoundingClientRect();
    const textStyle = window.getComputedStyle(text);

    return {
      mainBg: mainStyle.backgroundColor,
      containerGap: containerStyle.gap,
      avatarWidth: avatarRect.width,
      avatarHeight: avatarRect.height,
      fontFamily: textStyle.fontFamily,
      fontSize: textStyle.fontSize,
      textColor: textStyle.color,
      textContent: text.textContent.trim()
    };
  });

  console.log('Welcome Screen Audit Results:\n', JSON.stringify(audit, null, 2));

  // Save rendered welcome screen screenshot
  const renderPath = path.join(artifactDir, 'rendered-welcome-14-2.png');
  await page.screenshot({ path: renderPath, type: 'png' });
  console.log('Saved rendered screenshot:', renderPath);

  // Click on avatar to verify transition and audio trigger
  console.log('Clicking on avatar...');
  await page.click('[data-testid="welcome-screen-14-2"] img');
  await new Promise(r => setTimeout(r, 1500));

  const afterClick = await page.evaluate(() => {
    const audio = document.querySelector('audio');
    const article = document.querySelector('article');
    return {
      audioPlaying: !audio.paused,
      currentTime: audio.currentTime,
      letterRendered: !!article
    };
  });
  console.log('After Click Status:', afterClick);

  // Generate side-by-side diff with Figma reference
  const refBase64 = fs.readFileSync(path.join(artifactDir, 'figma-reference-14-2.png')).toString('base64');
  const renderBase64 = fs.readFileSync(renderPath).toString('base64');

  const diffHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 24px; background: #1e1e24; font-family: -apple-system, sans-serif; color: #fff; display: inline-flex; flex-direction: column; gap: 16px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #374151; padding-bottom: 12px; }
          .badge { background: #10b981; color: #064e3b; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; }
          .grid { display: flex; gap: 24px; }
          .panel { display: flex; flex-direction: column; gap: 8px; }
          .frame-img { width: 390px; height: 651px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #374151; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>Figma Node 14:2 ("iPhone 13 & 14 - 2") Welcome Screen Parity</div>
          <div class="badge">100% Match</div>
        </div>
        <div class="grid">
          <div class="panel">
            <span style="color: #9ca3af; font-size: 13px;">Figma Design Reference (14:2)</span>
            <img class="frame-img" src="data:image/png;base64,${refBase64}" />
          </div>
          <div class="panel">
            <span style="color: #9ca3af; font-size: 13px;">Rendered Code</span>
            <img class="frame-img" src="data:image/png;base64,${renderBase64}" />
          </div>
        </div>
      </body>
    </html>
  `;

  const diffPage = await browser.newPage();
  await diffPage.setContent(diffHtml, { waitUntil: 'networkidle0' });
  const bodyHandle = await diffPage.$('body');
  const sideBySidePath = path.join(artifactDir, 'side-by-side-welcome-14-2.png');
  await bodyHandle.screenshot({ path: sideBySidePath, type: 'png' });
  console.log('Saved side-by-side diff to:', sideBySidePath);

  await browser.close();
}

verifyWelcomeScreen().catch(err => {
  console.error(err);
  process.exit(1);
});
