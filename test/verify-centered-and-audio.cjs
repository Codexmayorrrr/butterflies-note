const puppeteer = require('puppeteer-core');
const path = require('path');

async function testCenteredAndAudio() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\mayow\\.gemini\\antigravity\\brain\\7c5a2fe6-d031-4062-b15d-ec5691ce7efc';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test 1: Desktop Viewport (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Verify Centering Math on Desktop
  const desktopCentering = await page.evaluate(() => {
    const container = document.querySelector('[data-testid="welcome-screen-14-2"]');
    const rect = container.getBoundingClientRect();
    const childrenRect = {
      avatar: container.querySelector('img').getBoundingClientRect(),
      text: container.querySelector('p').getBoundingClientRect()
    };
    const totalContentHeight = childrenRect.text.bottom - childrenRect.avatar.top;
    const contentCenterY = childrenRect.avatar.top + totalContentHeight / 2;
    const viewportCenterY = window.innerHeight / 2;
    const contentCenterX = childrenRect.avatar.left + childrenRect.avatar.width / 2;
    const viewportCenterX = window.innerWidth / 2;

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      contentCenterY,
      viewportCenterY,
      diffY: Math.abs(contentCenterY - viewportCenterY),
      contentCenterX,
      viewportCenterX,
      diffX: Math.abs(contentCenterX - viewportCenterX)
    };
  });

  console.log('Desktop Centering Math:\n', JSON.stringify(desktopCentering, null, 2));

  // Save desktop centered screenshot
  const desktopImgPath = path.join(artifactDir, 'desktop-dead-centered.png');
  await page.screenshot({ path: desktopImgPath, type: 'png' });
  console.log('Saved desktop centered screenshot to:', desktopImgPath);

  // Test 2: Mobile Viewport (390x844)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const mobileCentering = await page.evaluate(() => {
    const container = document.querySelector('[data-testid="welcome-screen-14-2"]');
    const avatar = container.querySelector('img').getBoundingClientRect();
    const text = container.querySelector('p').getBoundingClientRect();
    const totalContentHeight = text.bottom - avatar.top;
    const contentCenterY = avatar.top + totalContentHeight / 2;
    const viewportCenterY = window.innerHeight / 2;

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      contentCenterY,
      viewportCenterY,
      diffY: Math.abs(contentCenterY - viewportCenterY)
    };
  });
  console.log('Mobile Centering Math:\n', JSON.stringify(mobileCentering, null, 2));

  const mobileImgPath = path.join(artifactDir, 'mobile-dead-centered.png');
  await page.screenshot({ path: mobileImgPath, type: 'png' });
  console.log('Saved mobile centered screenshot to:', mobileImgPath);

  // Test 3: Audio Playback Quality & Health
  console.log('Clicking to play audio...');
  await page.click('[data-testid="welcome-screen-14-2"]');
  await new Promise(r => setTimeout(r, 2000));

  const audioCheck = await page.evaluate(() => {
    const audio = document.querySelector('audio');
    return {
      paused: audio.paused,
      currentTime: audio.currentTime,
      duration: audio.duration,
      currentSrc: audio.currentSrc,
      readyState: audio.readyState
    };
  });
  console.log('Audio Playback Check:\n', JSON.stringify(audioCheck, null, 2));

  await browser.close();
}

testCenteredAndAudio().catch(err => {
  console.error(err);
  process.exit(1);
});
