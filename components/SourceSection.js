import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

import LanguagePicker from './LanguagePicker';
import AutocompleteDropdown from './AutocompleteDropdown';

const getPosterSize = (frameHeight) => {
  // Limit poster height to 50% of frame, with 2:3 aspect ratio
  const maxHeight = frameHeight * 0.5;
  const height = Math.min(maxHeight, 180);
  const width = height / 1.5;
  return { width, height };
};

const latinScriptLanguages = ['ID', 'CZ', 'DK', 'DE', 'US', 'ES', 'FR', 'HU', 'IT', 'NL', 'NO', 'PL', 'BR', 'PT', 'RO', 'FI', 'SE', 'VN', 'TR'];
const usesLatinScript = (langCode) => latinScriptLanguages.includes(langCode);

const SourceSection = ({
  language,
  languageList,
  languageNames,
  deviceLanguage,
  query,
  topHits,
  originalTitle,
  originalYear,
  originalPoster,
  loading,
  translations,
  onLanguageChange,
  onInput,
  frameHeight,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

  const handleTextChange = (text) => {
    onInput(text);
    setShowDropdown(text.length > 0);
  };

  const handleSuggestionSelect = (suggestion) => {
    onInput(suggestion.title, suggestion.id);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    Keyboard.dismiss();
    onInput('');
    setShowDropdown(false);
  };

  const hasContent = originalPoster || originalTitle;

  return (
    <View style={styles.container}>
        <View style={styles.searchRow}>
          <LanguagePicker
            language={language}
            languageList={languageList}
            languageNames={languageNames}
            deviceLanguage={deviceLanguage}
            selectLanguageText={translations.selectLanguage}
            onLanguageChange={onLanguageChange}
          />

          <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={translations.placeholder}
            placeholderTextColor="#444"
            value={query}
            onChangeText={handleTextChange}
            onFocus={() => setShowDropdown(query.length > 0)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable
              style={styles.clearButton}
              onPress={handleClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </Pressable>
          )}
          <AutocompleteDropdown
            suggestions={topHits}
            onSelect={handleSuggestionSelect}
            visible={showDropdown}
          />
          </View>
        </View>

        <View style={styles.resultWrapper}>
          {!!(originalPoster || originalTitle) && (
            <View style={styles.resultRow}>
              {originalPoster && (
                <TouchableOpacity onPress={() => setShowPosterModal(true)}>
                  <Image source={{ uri: originalPoster }} style={[styles.poster, getPosterSize(frameHeight)]} />
                </TouchableOpacity>
              )}
              <View style={styles.titleContainer}>
                <Text style={[styles.title, usesLatinScript(language.code) ? styles.titleFontPrimary : styles.titleFontFallback]}>
                  {loading ? translations.searching : originalTitle}
                </Text>
                {!loading && originalYear && (
                  <Text style={styles.year}>({originalYear})</Text>
                )}
              </View>
            </View>
          )}
        </View>

      <Modal
        visible={showPosterModal}
        transparent={true}
        animationType="fade"
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
        onRequestClose={() => setShowPosterModal(false)}
      >
        <Pressable
          style={styles.posterModalOverlay}
          onPress={() => setShowPosterModal(false)}
        >
          <Image
            source={{ uri: originalPoster }}
            style={styles.posterLarge}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    position: 'relative',
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
    marginLeft: 10,
    paddingBottom: 2,
    zIndex: 1000,
  },
  input: {
    width: '100%',
    backgroundColor: '#f78e6a',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingLeft: 10,
    paddingRight: 35,
    fontSize: 16,
    color: '#333',
  },
  inputWithDropdown: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 5,
    zIndex: 10,
  },
  clearButtonText: {
    color: '#555',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultWrapper: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 1,
    position: 'relative',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    color: '#333',
    fontSize: 18,
  },
  titleFontPrimary: {
    fontFamily: 'AlfaSlabOne_400Regular',
  },
  titleFontFallback: {
    fontFamily: 'Montserrat_900Black',
  },
  year: {
    color: '#555',
    fontSize: 14,
    marginTop: 4,
  },
  posterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterLarge: {
    width: '90%',
    height: '80%',
  },
});

export default SourceSection;
