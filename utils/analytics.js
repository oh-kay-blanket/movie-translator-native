let analytics = null;

try {
  analytics = require('@react-native-firebase/analytics').default;
} catch {
  // Firebase not available (e.g., Expo Go)
}

const isAvailable = () => {
  try {
    return analytics && analytics();
  } catch {
    return null;
  }
};

export const logSearch = async (query, sourceLanguage) => {
  const instance = isAvailable();
  if (!instance) return;

  try {
    await instance.logSearch({ search_term: query });
    await instance.logEvent('movie_search', {
      query: query.substring(0, 100),
      source_language: sourceLanguage,
    });
  } catch (error) {
    // Silent fail
  }
};

export const logTranslationViewed = async (movieTitle, sourceLang, targetLang, found) => {
  const instance = isAvailable();
  if (!instance) return;

  try {
    await instance.logEvent('translation_viewed', {
      movie_title: movieTitle.substring(0, 100),
      source_language: sourceLang,
      target_language: targetLang,
      translation_found: found,
    });
  } catch (error) {
    // Silent fail
  }
};

export const logLanguageChanged = async (type, from, to) => {
  const instance = isAvailable();
  if (!instance) return;

  try {
    await instance.logEvent('language_changed', {
      change_type: type,
      from_language: from,
      to_language: to,
    });
  } catch (error) {
    // Silent fail
  }
};
