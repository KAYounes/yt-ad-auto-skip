let options = {
  adPlaybackSpeed: 10,
  adMute: true,
  adBlur: true,
};

let video = null;
let fail_safe = 0;

while (video === null && fail_safe < 10 ** 5) {
  video = document.querySelector('video');
  video.style.filter = 'blur(40px)';
  fail_safe = fail_safe + 1;
}

let playbackSpeed = 1;
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

// Attach Obserbers
const adObserver = new MutationObserver(handleAd);

// Wait for #ytd-player to load into the DOM
const documentObserver = new MutationObserver(function (mutations, obs) {
  const ytdPlayer = document.querySelector('#ytd-player');
  if (ytdPlayer == null) return;

  adObserver.observe(ytdPlayer, { childList: true, subtree: true });
  documentObserver.disconnect();
});

documentObserver.observe(document, { childList: true, subtree: true });

function handleAd() {
  if (video === null) video = document.querySelector('video');
  playbackSpeed = video.playbackRate;

  let adPlaying = document.querySelector('.video-ads.ytp-ad-module')?.hasChildNodes() ?? false;
  let adTextNodes = [...document.querySelectorAll('*[id^=ad-text]')];
  // let countDown = adTextNodes.filter((e) => ['1', '2', '3', '4', '5'].includes(e.innerText))[0];
  let skip = adTextNodes.filter((e) => e.innerText === 'Skip')[0];

  if (adPlaying) {
    if (options.adBlur) video.style.filter = 'blur(40px)';

    video.muted = options.adMute;
    video.playbackRate = options.adPlaybackSpeed > 16 ? 16 : options.adPlaybackSpeed;
    if (skip) {
      skip.click();
    }
  } else {
    video.style.filter = null;
    video.playbackRate = playbackSpeed;
  }
}
