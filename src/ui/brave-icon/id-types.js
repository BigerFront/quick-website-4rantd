/* eslint-disable */
/* Pickup from shared/js/brave-icon.min.js */
export const BRAVE_ICON_IDS = [
  'brave-android',
  'brave-ios',
  'brave-github',
  'brave-contact',
  'brave-profile',
  'brave-ethereum',
  'brave-quick',
];
export const checkBraveIconId = (id) => {
  let _key = id.startsWith('brave-') ? id : `brave-${id.toLowerCase()}`;
  return BRAVE_ICON_IDS.find((i) => i === _key);
};
