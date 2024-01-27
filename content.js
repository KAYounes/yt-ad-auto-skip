// // alert('THIS IS YOUTUBE 2');
// const video = document.querySelector('video');

// // document.querySelector('video').playbackRate = 5;

// console.log('VIDEO: ', video);

// function videoPlaying(event) {
//   console.log('event: ', event);
//   console.log('video.playbackRate: ', video.playbackRate);
// }

// video.addEventListener('playing', videoPlaying);
// video.removeEventListener('playing', videoPlaying);
const video = document.querySelector('video');
let prevPlaybackRate = video.playbackRate;

const observer = new MutationObserver((mutations) => {
  prevPlaybackRate = video.playbackRate === 10 ? prevPlaybackRate : video.playbackRate;
  console.log({ prevPlaybackRate });
  // Handle detected DOM changes here
  let adPlaying = document.querySelector('.video-ads.ytp-ad-module')?.hasChildNodes() ?? false;
  console.log(document.querySelector('.video-ads.ytp-ad-module'));
  console.log(document.querySelector('.video-ads.ytp-ad-module')?.hasChildNodes());
  console.log({ adPlaying });

  //   console.log('DOM change detected:', mutations);
  let allAdText = [...document.querySelectorAll('*[id^=ad-text]')];
  //   console.log({ allAdText });

  let countDown = allAdText.filter((e) => ['1', '2', '3', '4', '5'].includes(e.innerText))[0];
  let skip = allAdText.filter((e) => e.innerText === 'Skip')[0];
  console.log({ countDown, skip });

  if (adPlaying) {
    video.muted = true;
    video.playbackRate = 10;
    setTimeout(function () {
      video.muted = false;
      skip.click();
      console.log('skip');
      //   skip.dispatchEvent(new Event('click'));
      video.playbackRate = prevPlaybackRate;
    }, 200);
  }
});
// console.log(document.querySelector('.html5-video-player'));
observer.observe(document.querySelector('.html5-video-player    '), { childList: true, subtree: true }); // Observe entire document for changes
