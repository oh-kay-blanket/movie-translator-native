import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Search from './components/Search';
import Result from './components/Result';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState({
    name: '日本語',
    engName: 'Japanese',
    code: 'JP',
    key: 11,
  });
  const [query, setQuery] = useState('');
  const [topHits, setTopHits] = useState(['Star Wars IV', 'Star Wars V']);
  const [movieDBOriginalResult, setMovieDBOriginalResult] = useState('Nothing yet');
  const [movieDBTRResult, setmovieDBTRResult] = useState('Nothing yet');

  const languageList = [
    { name: 'Bahasa indonesia', engName: 'Indonesian', code: 'ID' },
    { name: 'български език', engName: 'Bulgarian', code: 'BG' },
    { name: 'Český', engName: 'Czech', code: 'CZ' },
    { name: 'Dansk', engName: 'Danish', code: 'DK' },
    { name: 'Deutsch', engName: 'German', code: 'DE' },
    { name: 'English', engName: 'English', code: 'US' },
    { name: 'Español', engName: 'Spanish', code: 'ES' },
    { name: 'Français', engName: 'French', code: 'FR' },
    { name: 'ελληνικά', engName: 'Greek', code: 'GR' },
    { name: 'עִבְרִית', engName: 'Hebrew', code: 'IL' },
    { name: 'Italiano', engName: 'Italian', code: 'IT' },
    { name: '日本語', engName: 'Japanese', code: 'JP' },
    { name: '조선말', engName: 'Korean', code: 'KR' },
    { name: '普通话 (CN)', engName: 'Mandarin (CN)', code: 'CN' },
    { name: '普通话 (TW)', engName: 'Mandarin (TW)', code: 'TW' },
    { name: 'Nederlands', engName: 'Dutch', code: 'NL' },
    { name: 'Norsk', engName: 'Norwegian', code: 'NO' },
    { name: 'فارسی', engName: 'Persian', code: 'IR' },
    { name: 'Polski', engName: 'Polish', code: 'PL' },
    { name: 'Português (BR)', engName: 'Portuguese (BR)', code: 'BR' },
    { name: 'Português (PT)', engName: 'Portuguese (PT)', code: 'PT' },
    { name: 'Pусский', engName: 'Russian', code: 'RU' },
    { name: 'Română', engName: 'Romanian', code: 'RO' },
    { name: 'Slovenčina', engName: 'Slovak', code: 'SK' },
    { name: 'Srpski', engName: 'Serbian', code: 'RS' },
    { name: 'Suomi', engName: 'Finnish', code: 'FI' },
    { name: 'Svenska', engName: 'Swedish', code: 'SE' },
    { name: 'ภาษาไทย', engName: 'Thai', code: 'TH' },
    { name: 'Türkçe', engName: 'Turkish', code: 'TR' },
    { name: 'Український', engName: 'Ukranian', code: 'UK' },
  ];

  const handleLanguage = (index) => {
    setLanguage(languageList[index]);
  };

  const handleInput = (text) => {
    setLoading(true);
    setQuery(text);
  };

  // MOVIEDB API
  useEffect(() => {
    if (query === '') {
      setLoading(false);
      setMovieDBOriginalResult('Nothing yet');
      setmovieDBTRResult('Nothing yet');
    } else {
      const baseURL =
        'https://api.themoviedb.org/3/search/movie?api_key=09bef58264dfd94d2a9fc4dcd061da8f&query=';
      const url = ''.concat(baseURL, query);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // Setup autocomplete suggestions
          setTopHits(data.results.slice(0, 5).map((hit) => hit.title));

          // Use first result
          const movieID = data.results[0].id;
          const altTitleURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=09bef58264dfd94d2a9fc4dcd061da8f&append_to_response=translations`;

          // Get translations array from top hit
          fetch(altTitleURL)
            .then((altTitleResponse) => altTitleResponse.json())
            .then((altTitleData) => {
              // Does translation exist for selected language?
              if (
                altTitleData.translations.translations.some(
                  (translation) => translation.iso_3166_1 === language.code
                )
              ) {
                // Find matching language
                altTitleData.translations.translations.forEach((translation) => {
                  if (translation.iso_3166_1 === language.code) {
                    // Title not empty
                    if (translation.data.title !== '') {
                      setmovieDBTRResult(translation.data.title);
                    } else {
                      setmovieDBTRResult(`No ${language.name} title found`);
                    }
                    setMovieDBOriginalResult(altTitleData.title);
                    setLoading(false);
                  }
                });
              } else {
                // No translation for that lang
                setMovieDBOriginalResult(altTitleData.title);
                setmovieDBTRResult(`No ${language.name} title found`);
                setLoading(false);
              }
            })
            // No film found
            .catch((altTitleErr) => {
              setMovieDBOriginalResult(`No ${language.name} title found`);
              setmovieDBTRResult(`No ${language.name} title found`);
              setLoading(false);
            });
        })
        // No film found
        .catch((err) => {
          setMovieDBOriginalResult('No title found');
          setmovieDBTRResult('No title found');
          setLoading(false);
        });
    }
  }, [language, query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.container}>
          <Search
            language={language}
            languageList={languageList}
            query={query}
            topHits={topHits}
            handleLanguage={handleLanguage}
            handleInput={handleInput}
          />
          <Result
            language={language}
            loading={loading}
            movieDBOriginalResult={movieDBOriginalResult}
            movieDBTRResult={movieDBTRResult}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#dbdbd5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#dbdbd5',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});

export default App;
