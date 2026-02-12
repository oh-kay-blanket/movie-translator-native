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
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const POSTER_WIDTH = screenWidth * 0.3;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;
import LanguagePicker from './LanguagePicker';
import AutocompleteDropdown from './AutocompleteDropdown';

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
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

  const handleTextChange = (text) => {
    onInput(text);
    setShowDropdown(text.length > 0);
  };

  const handleSuggestionSelect = (suggestion) => {
    onInput(suggestion.title);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    onInput('');
    setShowDropdown(false);
  };

  const hasContent = originalPoster || originalTitle;

  return (
    <View style={[styles.container, hasContent && styles.containerExpanded]}>
      <View style={[styles.section, hasContent && styles.sectionExpanded]}>
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
            placeholderTextColor="#999"
            value={query}
            onChangeText={handleTextChange}
            onFocus={() => setShowDropdown(query.length > 0)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          <AutocompleteDropdown
            suggestions={topHits}
            onSelect={handleSuggestionSelect}
            visible={showDropdown}
          />
        </View>

        {(originalPoster || originalTitle) && (
          <View style={styles.resultRow}>
            {originalPoster && (
              <TouchableOpacity onPress={() => setShowPosterModal(true)}>
                <Image source={{ uri: originalPoster }} style={styles.poster} />
              </TouchableOpacity>
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {loading ? translations.searching : originalTitle}
              </Text>
              {!loading && originalYear && (
                <Text style={styles.year}>({originalYear})</Text>
              )}
            </View>
          </View>
        )}

        <Modal
          visible={showPosterModal}
          transparent={true}
          animationType="fade"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  containerExpanded: {
    // flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  sectionExpanded: {
  },
  inputContainer: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 12,
    paddingBottom: 2,
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#d62b1e',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
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
  },
  clearButtonText: {
    color: '#999',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  year: {
    color: '#666',
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
