export const DEFAULT_HEADER_IMAGE = 'homeold.jpg';
export const ABOUT_HEADER_IMAGE = 'about.jpg';
export const HEADER_IMAGE_HISTORY_LIMIT = 4;

export const HEADER_IMAGE_PAGE_CONFIGS = [
  {
    slug: 'home',
    label: 'Pagina principală',
    description: 'Fundalul hero-ului de pe pagina de start.',
    defaultImage: DEFAULT_HEADER_IMAGE,
  },
  {
    slug: 'about',
    label: 'Despre',
    description: 'Fundalul bannerului de pe pagina Despre.',
    defaultImage: ABOUT_HEADER_IMAGE,
  },
];

export const HEADER_IMAGE_DEFAULTS = Object.freeze(
  Object.fromEntries(
    HEADER_IMAGE_PAGE_CONFIGS.map(({ slug, defaultImage }) => [slug, defaultImage]),
  ),
);

function isDataUri(value) {
  return /^data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/i.test(value);
}

function isPresetHeaderImage(value) {
  return /^[A-Za-z0-9][A-Za-z0-9._-]*\.[A-Za-z0-9]+$/.test(value);
}

export function normalizeHeaderImage(value, fallbackImage = DEFAULT_HEADER_IMAGE) {
  const image = String(value || '').trim();
  if (!image) {
    return fallbackImage;
  }

  if (isDataUri(image) || isPresetHeaderImage(image)) {
    return image;
  }

  return fallbackImage;
}

export function getDefaultHeaderImage(pageSlug) {
  return HEADER_IMAGE_DEFAULTS[pageSlug] || DEFAULT_HEADER_IMAGE;
}
