import { setStorageSync, getStorageSync } from './../scripts/storage.js';

// initial options
let options = {
  adPlaybackSpeed: 10,
  adMute: true,
};

// look for options in storage
let storage = await getStorageSync(Object.keys(options)).then(function (result) {
  console.log(1, result, Object.keys(result).length);
  if (Object.keys(result).length === 0) return null;
  return result;
});

if (storage === null) {
  // storage is empty
  // set initial options in storage
  await setStorageSync({ adPlaybackSpeed: options.adPlaybackSpeed, adMute: options.adMute });
} else {
  // update options from storage
  options = { ...storage };
}

// remove buffer and load UI
document.querySelector('.buffer').classList.add('hide');
document.querySelector('form').classList.remove('hide');
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
