import en from './en.js';
import ko from './ko.js';

const locales = { en, ko };
let currentLocale = 'ko';
const missingKeys = new Set();

const readPath = (object, key) => String(key).split('.').reduce((value, segment) => value?.[segment], object);

export const setLocale = locale => {
  currentLocale = locales[locale] ? locale : 'ko';
  return currentLocale;
};

export const getLocale = () => currentLocale;

export const t = (key, params = {}) => {
  const translated = readPath(locales[currentLocale], key) ?? readPath(en, key);
  if (translated === undefined) {
    missingKeys.add(String(key));
    return String(key);
  }
  if (Array.isArray(translated)) return translated;
  return String(translated).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? `{${name}}`);
};

export const getMissingTranslationKeys = () => [...missingKeys];
export const clearMissingTranslationKeys = () => missingKeys.clear();
