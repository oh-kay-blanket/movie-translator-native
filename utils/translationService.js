// Map app country codes to ISO 639-1 language codes for MyMemory API
const langCodeMap = {
  SA: 'ar',
  ID: 'id',
  BG: 'bg',
  CZ: 'cs',
  DK: 'da',
  DE: 'de',
  US: 'en',
  ES: 'es',
  FR: 'fr',
  GR: 'el',
  IL: 'he',
  IN: 'hi',
  HU: 'hu',
  IT: 'it',
  JP: 'ja',
  KR: 'ko',
  CN: 'zh-CN',
  TW: 'zh-TW',
  NL: 'nl',
  NO: 'no',
  IR: 'fa',
  PL: 'pl',
  BR: 'pt',
  PT: 'pt',
  RO: 'ro',
  RU: 'ru',
  FI: 'fi',
  SE: 'sv',
  TH: 'th',
  VN: 'vi',
  TR: 'tr',
  UA: 'uk',
};

let quotaExceeded = false;

export async function translateText(text, fromLangCode, toLangCode) {
  if (quotaExceeded || !text) return null;

  const from = langCodeMap[fromLangCode];
  const to = langCodeMap[toLangCode];

  if (!from || !to) return null;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

    const response = await fetch(url);
    const data = await response.json();

    // Check for quota exceeded
    if (data.responseStatus === 429 || data.quotaFinished) {
      quotaExceeded = true;
      return null;
    }

    // Check for successful response
    if (data.responseStatus !== 200) {
      return null;
    }

    return data.responseData?.translatedText || null;
  } catch (error) {
    // Silently fail - back-translation is optional
    return null;
  }
}

export function isQuotaExceeded() {
  return quotaExceeded;
}
