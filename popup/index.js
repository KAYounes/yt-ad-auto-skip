import { setStorageSync, getStorageSync } from './../scripts/storage.js';
// initial options
let options = JSON.parse(JSON.stringify(GLOBALS.settings));
let manafist = null;
let repoRelease = null;

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    console.log(`HTTP error! Status: ${response.status}`);
    return '{}';
  }
  return response.json();
}

async function fetchManifest() {
  const url = chrome.runtime.getURL('../manifest.json');
  return fetchJSON(url);
}

async function fetchRepoRelease() {
  const url = 'https://api.github.com/repos/KAYounes/yt-ad-auto-skip/releases/latest';
  const options = {
    headers: { Accept: 'application/vnd.github.v3+json' },
  };
  return fetchJSON(url, options);
}

async function checkForUpdates() {
  try {
    const [manifest, repoRelease] = await Promise.all([fetchManifest(), fetchRepoRelease()]);
    console.log({ manifest, repoRelease });
    const manafistVersion = extractVersion(manifest.version);
    const repoVersion = extractVersion(repoRelease.tag_name);

    if (manafistVersion === '' || repoVersion === '') return;
    const currentVersionDiv = document.querySelector('.current_version');
    currentVersionDiv.textContent = `v${manafistVersion}`;

    const updateFound = isUpdateFound(repoVersion, manafistVersion);
    console.log(updateFound);

    if (!updateFound) return;

    const updatesDiv = document.querySelector('.updates');
    const messageSpan = document.querySelector('.updates > .message');
    const versionSpan = document.querySelector('.updates > .version');

    updatesDiv.classList.remove('hide');
    messageSpan.textContent = `A new ${updateFound.toUpperCase()} update is found`;
    versionSpan.textContent = `v${repoVersion}`;

    return;
  } catch (error) {
    console.log('Error checking for updates', error);
  }
}

checkForUpdates();

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

function isUpdateFound(remote, local) {
  // Helper function to clean and parse version string to an array of numbers
  const remoteVersionSemantic = remote.split('.').map(Number);
  const localVersionSemantic = local.split('.').map(Number);
  const diff = remoteVersionSemantic.map((e, i) => e - localVersionSemantic[i]);

  if (diff[0] > 0) return 'Major';
  if (diff[1] > 0) return 'Minor';
  if (diff[2] > 0) return 'Patch';

  // No updates found
  return false;
}

function extractVersion(version) {
  const rawVersion = version.replaceAll(/[^0-9\.]/g, '');

  if (!/^\d+\.\d+\.\d+$/.test(rawVersion)) {
    console.log(`Invalid version format: ${rawVersion}`);
    // throw new Error(console.log(`Invalid version format: ${rawVersion}`))
    return '';
  }

  return rawVersion;
}
