import { setStorageSync, getStorageSync } from './../scripts/storage.js';
// initial options
let options = JSON.parse(JSON.stringify(GLOBALS.settings));

// look for options in storage
let storage = await getStorageSync(Object.keys(options)).then(function (result) {
  if (Object.keys(result).length === 0) return null;
  return result;
});

if (storage === null) {
  // storage is empty
  // set initial options in storage
  await setStorageSync(options);
} else if (optionKeysWasModified(storage, options)) {
  // an option was manually added/removed from the options object
  await setStorageSync(options);
} else {
  // update options from storage
  options = { ...storage };
}

// remove buffer and load UI
document.querySelector('.buffer').classList.add('hide');
document.querySelector('form').classList.remove('hide');
document.querySelector('#adPlayBackSpeed').value = options.adPlaybackSpeed;
document.querySelector('#adMute').checked = options.adMute;
document.querySelector('#adBlur').checked = options.adBlur;

document.querySelector('#adPlayBackSpeed').addEventListener('input', function (event) {
  let value = event.target.value;
  value = value.replace(/[^0-9]/, '');
  options.adPlaybackSpeed = Number.parseInt(value) ?? 10;
  event.target.classList.remove('is-invalid');
  if (invalidPlaybackSpeed()) {
    options.adPlaybackSpeed = 10;
    event.target.classList.add('is-invalid');
  }

  event.target.value = value;
  persistOptions();
});

document.querySelector('#adMute').addEventListener('change', function (event) {
  options.adMute = event.target.checked;
  persistOptions();
});

document.querySelector('#adBlur').addEventListener('change', function (event) {
  options.adBlur = event.target.checked;
  persistOptions();
});

// // // // // // // //

function persistOptions() {
  setStorageSync(options);
}

function invalidPlaybackSpeed() {
  return options.adPlaybackSpeed < 0 || options.adPlaybackSpeed > 16;
}

function optionKeysWasModified(storage, options) {
  if (Object.keys(storage).length !== Object.keys(options).length) return true;

  for (let key in options) {
    if (!(key in storage)) return true;
  }

  return false;
}
