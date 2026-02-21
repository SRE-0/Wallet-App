import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import en from './en';
import es from './es';

i18n.translations = { en, es };
i18n.locale = Localization.locale;
i18n.fallbacks = true;

/**
 * Helper `t` wraps `i18n.t` to provide a typed entry point
 * for translator keys used across the app.
 *
 * @param key - Translation key (dot-separated)
 * @returns Translated string or the key when missing
 */
export function t(key: string) {
  return i18n.t(key);
}
