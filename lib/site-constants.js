export const DEFAULT_HEADER_IMAGE = 'homeold.jpg';
export const HEADER_IMAGE_HISTORY_LIMIT = 4;

function isDataUri(value) {
  return /^data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/i.test(value);
}

function isPresetHeaderImage(value) {
  return /^[A-Za-z0-9][A-Za-z0-9._-]*\.[A-Za-z0-9]+$/.test(value);
}

export function normalizeHeaderImage(value) {
  const image = String(value || '').trim();
  if (!image) {
    return DEFAULT_HEADER_IMAGE;
  }

  if (isDataUri(image) || isPresetHeaderImage(image)) {
    return image;
  }

  return DEFAULT_HEADER_IMAGE;
}
