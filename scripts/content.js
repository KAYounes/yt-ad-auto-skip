let options = {
  adPlaybackSpeed: 10,
  adMute: true,
  adBlur: true,
};
let video;
let fail_safe = 0;
let playbackSpeed = 1;
let logStack = [];
let ALLOW_LOGS = false;

while (!(video instanceof HTMLElement) && fail_safe < 10 ** 5) {
  video = document.querySelector('video');
  fail_safe = fail_safe + 1;
}

if (!(video instanceof HTMLElement)) {
  throw Error('Cannot find video element');
}

video.style.filter = 'blur(40px)';

// Listen for configuration changes
async function getOptions() {
  options = await chrome.storage.sync.get(Object.keys(options), (r) => (options = r));
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    for (let key in changes) {
      options[key] = changes[key].newValue;
    }
  }
});

getOptions();
// END

// Wait for #ytd-player to load into the DOM
const documentObserver = new MutationObserver(waitForYTDPlayer);
documentObserver.observe(document, { childList: true, subtree: true });

///////////////////////////
// // // functions // // //

function waitForYTDPlayer() {
  console.log('waitForYTDPlayer');
  const ytdPlayer = document.querySelector('#ytd-player');
  if (ytdPlayer == null) return;

  // Attach Obserbers
  const adObserver = new MutationObserver(handleAd);
  adObserver.observe(ytdPlayer, { childList: true, subtree: true });

  documentObserver.disconnect();
}

function handleAd() {
  logStack.push('handleAd');

  const AD_IS_PLAYING =
    (document.querySelector('.ad-showing') ??
      document.querySelector('.ad-interrupting') ??
      document.querySelector('.ytp-ad-player-overlay')) !== null;

  if (!(video instanceof HTMLElement)) {
    logStack.push('video IS NOT instanceof HTMLElement');
    logStack.push({ before: video });
    video = document.querySelector('video');
    logStack.push({ after: video });

    return log(true);
  }

  playbackSpeed = video.playbackRate;

  logStack.push(
    { AD_IS_PLAYING },
    { video },
    { playbackSpeed },
    {
      '.ad-showing': document.querySelector('.ad-showing'),
      '.ad-interrupting': document.querySelector('.ad-interrupting'),
      '.ytp-ad-player-overlay': document.querySelector('.ytp-ad-player-overlay'),
      'con':
        document.querySelector('.ad-showing') ??
        document.querySelector('.ad-interrupting') ??
        document.querySelector('.ytp-ad-player-overlay'),
    },
  );

  if (AD_IS_PLAYING) {
    logStack.push('AD_IS_PLAYING');
    let adPlaying = document.querySelector('.video-ads.ytp-ad-module')?.hasChildNodes() ?? false;
    let adTextNodes = [...document.querySelectorAll('*[id^=ad-text]')];
    // let countDown = adTextNodes.filter((e) => ['1', '2', '3', '4', '5'].includes(e.innerText))[0];
    let skip = adTextNodes.filter((e) => e.innerText === 'Skip')[0];

    logStack.push({ skip });
    if (options.adBlur) video.style.filter = 'blur(40px)';

    video.muted = options.adMute;
    video.playbackRate = options.adPlaybackSpeed > 16 ? 16 : options.adPlaybackSpeed;
    if (skip) {
      skip.click();
    }
  } else {
    logStack.push('VIDEO_IS_PLAYING');
    video.style.filter = null;
    video.playbackRate = playbackSpeed;
  }

  return log(true);
}

function log(flush) {
  if (ALLOW_LOGS === true) logStack.forEach((l) => console.log(l));
  if (flush === true) logStack = [];
}

function _print(obj) {
  if (obj instanceof Object) return console.table(obj);
  return console.log(obj);
}
