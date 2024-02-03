import { setStorageSync, getStorageSync } from './../scripts/storage.js';
// // chrome.runtime.openOptionsPage();
// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// await sleep(3000);

// chrome.storage.sync.clear();
// chrome.storage.sync.clear();
// await chrome.storage.sync.remove(Object.keys(defaults)).then((args) => console.log('removed: ', args));
console.log('-----------');
let options = {
  adPlaybackSpeed: 10,
  adMute: true,
};

let storage = await getStorageSync(Object.keys(options)).then(function (result) {
  console.log(1, result, Object.keys(result).length);
  if (Object.keys(result).length === 0) return null;
  //   document.querySelector('.buffer').classList.add('hide');
  //   document.querySelector('form').classList.remove('hide');
  return result;
});

if (storage === null) {
  console.log(2);
  await setStorageSync({ adPlaybackSpeed: options.adPlaybackSpeed, adMute: options.adMute });
  //   .then(function () {
  //     document.querySelector('.buffer').classList.add('hide');
  //     document.querySelector('form').classList.remove('hide');
  //   });
}
options = { ...storage };

document.querySelector('.buffer').classList.add('hide');
document.querySelector('form').classList.remove('hide');

// check for previous options in storage
// try {
//   console.log(1);
//   options = await getStorageSync(Object.keys(defaults)).then(function (result) {
//     console.log(1, 2, result);
//     document.querySelector('.buffer').classList.add('hide');
//     document.querySelector('form').classList.remove('hide');
//     return result;
//   });
// } catch {
//   console.log(2);
//   // handle no previous options found
//   try {
//     console.log(3);
//     setStorageSync({ adPlaybackSpeed: defaults.adPlaybackSpeed, adMute: defaults.adMute }).then(function () {
//       document.querySelector('.buffer').classList.add('hide');
//       document.querySelector('form').classList.remove('hide');
//     });
//   } catch (error) {}

//   options = { ...defaults };
// }

console.log(3, options);
document.querySelector('#adPlayBackSpeed').value = options.adPlaybackSpeed;
document.querySelector('#adMute').checked = options.adMute;

document.querySelector('#adPlayBackSpeed').addEventListener('input', function (event) {
  let value = event.target.value;
  value = value.replace(/[^0-9]/, '');
  options.adPlaybackSpeed = Number.parseInt(value) ?? 10;
  event.target.value = value;
  console.log(4, options);
  persistOptions();
});

document.querySelector('#adMute').addEventListener('change', function (event) {
  options.adMute = event.target.checked;
  persistOptions();
});

function persistOptions() {
  setStorageSync({ adPlaybackSpeed: options.adPlaybackSpeed, adMute: options.adMute });
}
