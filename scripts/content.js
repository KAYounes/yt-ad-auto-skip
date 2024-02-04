let options = { adPlaybackSpeed: 10, adMute: true };
let video = document.querySelector('video');
// let prevPlaybackRate = video.playbackRate;

console.log(`
\n\n\n
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
FIRST RUN
\n\n\n
`);

async function getOptions() {
  options = await chrome.storage.sync.get(Object.keys(options), (r) => (options = r));
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    console.log('>>> ', changes);
    for (let key in changes) {
      options[key] = changes[key].newValue;
    }
  }
});

getOptions();

const observer = new MutationObserver((mutations) => {
  if (video === null) video = document.querySelector('video');
  let adPlaying = document.querySelector('.video-ads.ytp-ad-module')?.hasChildNodes() ?? false;
  let adTextNodes = [...document.querySelectorAll('*[id^=ad-text]')];
  let countDown = adTextNodes.filter((e) => ['1', '2', '3', '4', '5'].includes(e.innerText))[0];
  let skip = adTextNodes.filter((e) => e.innerText === 'Skip')[0];
  console.log({ adTextNodes, countDown, skip });
  console.log({ video, options });

  if (adPlaying) {
    video.muted = options.adMute;
    video.playbackRate = options.adPlaybackSpeed;
    console.log(`${'='.repeat(20)}\nAd Is Playing Now\n${'='.repeat(20)}\n`);
    if (skip) {
      skip.click();
    }
    // setTimeout(function () {
    //   video.muted = false;
    //   skip.click();
    //   video.playbackRate = prevPlaybackRate;
    // }, 200);
  } else {
    prevPlaybackRate = video.playbackRate === 10 ? prevPlaybackRate : video.playbackRate;
  }
});
observer.observe(document.querySelector('.html5-video-player'), { childList: true, subtree: true }); // Observe entire document for changes
