import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import en from './en';
import es from './es';

i18n.translations = { en, es };
i18n.locale = Localization.locale;
i18n.fallbacks = true;

/**
 * Translation helper.
 * @param key Translation key
 */
export function t(key: string) {
  return i18n.t(key);
}
