let options = { adPlaybackSpeed: 10, adMute: true };
const video = document.querySelector('video');
let prevPlaybackRate = video.playbackRate;

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
  console.log(
    `
    Sometimes site loads before teh <video> tag, so the querySelector fails.
    Right now the video tag is
    `,
    video,
  );
  console.log(options);

  prevPlaybackRate = video.playbackRate === 10 ? prevPlaybackRate : video.playbackRate;
  let adPlaying = document.querySelector('.video-ads.ytp-ad-module')?.hasChildNodes() ?? false;

  let allAdText = [...document.querySelectorAll('*[id^=ad-text]')];

  let countDown = allAdText.filter((e) => ['1', '2', '3', '4', '5'].includes(e.innerText))[0];
  let skip = allAdText.filter((e) => e.innerText === 'Skip')[0];

  if (adPlaying) {
    video.muted = true;
    video.playbackRate = 0.5;
    console.log(`Ad Is Playing Now`);
    // setTimeout(function () {
    //   video.muted = false;
    //   skip.click();
    //   video.playbackRate = prevPlaybackRate;
    // }, 200);
  }
});
observer.observe(document.querySelector('.html5-video-player    '), { childList: true, subtree: true }); // Observe entire document for changes
