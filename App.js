import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import SourceSection from './components/SourceSection';
import ResultSection from './components/ResultSection';
import Logo from './components/Logo';

const App = () => {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
  });
  const [loading, setLoading] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState({
    name: 'English',
    engName: 'English',
    code: 'US',
    langCode: 'en',
  });
  const [targetLanguage, setTargetLanguage] = useState({
    name: '日本語',
    engName: 'Japanese',
    code: 'JP',
    langCode: 'ja',
  });
  const [query, setQuery] = useState('');
  const [topHits, setTopHits] = useState([]);
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalYear, setOriginalYear] = useState('');
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [originalPoster, setOriginalPoster] = useState(null);
  const [translatedPoster, setTranslatedPoster] = useState(null);

  const languageList = [
    { name: 'Bahasa indonesia', engName: 'Indonesian', code: 'ID', langCode: 'id' },
    { name: 'български език', engName: 'Bulgarian', code: 'BG', langCode: 'bg' },
    { name: 'Český', engName: 'Czech', code: 'CZ', langCode: 'cs' },
    { name: 'Dansk', engName: 'Danish', code: 'DK', langCode: 'da' },
    { name: 'Deutsch', engName: 'German', code: 'DE', langCode: 'de' },
    { name: 'English', engName: 'English', code: 'US', langCode: 'en' },
    { name: 'Español', engName: 'Spanish', code: 'ES', langCode: 'es' },
    { name: 'Français', engName: 'French', code: 'FR', langCode: 'fr' },
    { name: 'ελληνικά', engName: 'Greek', code: 'GR', langCode: 'el' },
    { name: 'עִבְרִית', engName: 'Hebrew', code: 'IL', langCode: 'he' },
    { name: 'Italiano', engName: 'Italian', code: 'IT', langCode: 'it' },
    { name: '日本語', engName: 'Japanese', code: 'JP', langCode: 'ja' },
    { name: '조선말', engName: 'Korean', code: 'KR', langCode: 'ko' },
    { name: '普通话 (CN)', engName: 'Mandarin (CN)', code: 'CN', langCode: 'zh' },
    { name: '普通话 (TW)', engName: 'Mandarin (TW)', code: 'TW', langCode: 'zh' },
    { name: 'Nederlands', engName: 'Dutch', code: 'NL', langCode: 'nl' },
    { name: 'Norsk', engName: 'Norwegian', code: 'NO', langCode: 'no' },
    { name: 'فارسی', engName: 'Persian', code: 'IR', langCode: 'fa' },
    { name: 'Polski', engName: 'Polish', code: 'PL', langCode: 'pl' },
    { name: 'Português (BR)', engName: 'Portuguese (BR)', code: 'BR', langCode: 'pt' },
    { name: 'Português (PT)', engName: 'Portuguese (PT)', code: 'PT', langCode: 'pt' },
    { name: 'Pусский', engName: 'Russian', code: 'RU', langCode: 'ru' },
    { name: 'Română', engName: 'Romanian', code: 'RO', langCode: 'ro' },
    { name: 'Slovenčina', engName: 'Slovak', code: 'SK', langCode: 'sk' },
    { name: 'Srpski', engName: 'Serbian', code: 'RS', langCode: 'sr' },
    { name: 'Suomi', engName: 'Finnish', code: 'FI', langCode: 'fi' },
    { name: 'Svenska', engName: 'Swedish', code: 'SE', langCode: 'sv' },
    { name: 'ภาษาไทย', engName: 'Thai', code: 'TH', langCode: 'th' },
    { name: 'Türkçe', engName: 'Turkish', code: 'TR', langCode: 'tr' },
    { name: 'Український', engName: 'Ukranian', code: 'UK', langCode: 'uk' },
  ];

  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

  const handleSourceLanguage = (index) => {
    setSourceLanguage(languageList[index]);
  };

  const handleTargetLanguage = (index) => {
    setTargetLanguage(languageList[index]);
  };

  const handleInput = (text) => {
    setLoading(true);
    setQuery(text);
  };

  // MOVIEDB API
  useEffect(() => {
    if (query === '') {
      setLoading(false);
      setOriginalTitle('');
      setOriginalYear('');
      setTranslatedTitle('');
      setOriginalPoster(null);
      setTranslatedPoster(null);
    } else {
      const baseURL =
        'https://api.themoviedb.org/3/search/movie?api_key=09bef58264dfd94d2a9fc4dcd061da8f&query=';
      const url = ''.concat(baseURL, query);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (!data.results || data.results.length === 0) {
            setOriginalTitle('No movie found');
            setTranslatedTitle('No movie found');
            setLoading(false);
            return;
          }

          // Setup autocomplete suggestions with year
          setTopHits(data.results.slice(0, 6).map((hit) => ({
            title: hit.title,
            year: hit.release_date ? hit.release_date.substring(0, 4) : '',
          })));

          // Use first result
          const movieID = data.results[0].id;
          const altTitleURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=09bef58264dfd94d2a9fc4dcd061da8f&append_to_response=translations`;

          // Fetch images for localized posters
          const imagesURL = `https://api.themoviedb.org/3/movie/${movieID}/images?api_key=09bef58264dfd94d2a9fc4dcd061da8f&include_image_language=${targetLanguage.langCode},${sourceLanguage.langCode},en,null`;

          // Get translations array from top hit
          fetch(altTitleURL)
            .then((altTitleResponse) => altTitleResponse.json())
            .then((altTitleData) => {
              // Set original poster from movie data
              if (altTitleData.poster_path) {
                setOriginalPoster(`${TMDB_IMAGE_BASE}${altTitleData.poster_path}`);
              } else {
                setOriginalPoster(null);
              }

              // Fetch localized posters
              fetch(imagesURL)
                .then((imagesResponse) => imagesResponse.json())
                .then((imagesData) => {
                  // Look for poster in target language
                  const localizedPoster = imagesData.posters?.find(
                    (poster) => poster.iso_639_1 === targetLanguage.langCode
                  );
                  if (localizedPoster) {
                    setTranslatedPoster(`${TMDB_IMAGE_BASE}${localizedPoster.file_path}`);
                  } else {
                    setTranslatedPoster(null);
                  }
                })
                .catch(() => setTranslatedPoster(null));

              // Set original title and year
              setOriginalTitle(altTitleData.title);
              setOriginalYear(altTitleData.release_date ? altTitleData.release_date.substring(0, 4) : '');

              // Find translation for target language
              const translation = altTitleData.translations.translations.find(
                (t) => t.iso_3166_1 === targetLanguage.code
              );

              if (translation && translation.data.title) {
                setTranslatedTitle(translation.data.title);
              } else {
                setTranslatedTitle(`No ${targetLanguage.engName} title found`);
              }
              setLoading(false);
            })
            .catch(() => {
              setOriginalTitle('Error fetching movie');
              setTranslatedTitle('Error fetching movie');
              setLoading(false);
            });
        })
        .catch(() => {
          setOriginalTitle('No movie found');
          setTranslatedTitle('No movie found');
          setLoading(false);
        });
    }
  }, [targetLanguage, sourceLanguage, query]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#d62b1e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Logo size={90} color="#d62b1e" />
              <View style={styles.titleText}>
                <Text style={styles.mainTitle}>MOVIE TITLE</Text>
                <Text style={styles.mainTitle}>TRANSLATOR</Text>
              </View>
            </View>
          </View>

          {/* Source Section */}
          <SourceSection
            language={sourceLanguage}
            languageList={languageList}
            query={query}
            topHits={topHits}
            originalTitle={originalTitle}
            originalYear={originalYear}
            originalPoster={originalPoster}
            loading={loading}
            onLanguageChange={handleSourceLanguage}
            onInput={handleInput}
          />

          {/* Result Section */}
          <ResultSection
            language={targetLanguage}
            languageList={languageList.filter(lang => lang.code !== sourceLanguage.code)}
            translatedTitle={translatedTitle}
            translatedPoster={translatedPoster}
            loading={loading}
            onLanguageChange={(index) => {
              const filteredList = languageList.filter(lang => lang.code !== sourceLanguage.code);
              const selectedLang = filteredList[index];
              const originalIndex = languageList.findIndex(lang => lang.code === selectedLang.code);
              handleTargetLanguage(originalIndex);
            }}
          />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#dbdbd5',
  },
  container: {
    flex: 1,
    backgroundColor: '#dbdbd5',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 50,
    gap: 15,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 50,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 12,
  },
  mainTitle: {
    fontFamily: 'BebasNeue_400Regular',
    color: '#d62b1e',
    fontSize: 38,
    lineHeight: 40,
    letterSpacing: 3,
  },
});

export default App;
