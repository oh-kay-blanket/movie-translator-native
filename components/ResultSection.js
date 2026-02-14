import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const POSTER_WIDTH = screenWidth * 0.3;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;
import * as Speech from 'expo-speech';
import Svg, { Path } from 'react-native-svg';
import LanguagePicker from './LanguagePicker';

const latinScriptLanguages = ['ID', 'CZ', 'DK', 'DE', 'US', 'ES', 'FR', 'HU', 'IT', 'NL', 'NO', 'PL', 'BR', 'PT', 'RO', 'FI', 'SE', 'VN', 'TR'];
const usesLatinScript = (langCode) => latinScriptLanguages.includes(langCode);

const SpeakerIcon = ({ size = 24, color = '#4a3f38' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 5L6 9H2v6h4l5 4V5z"
      fill={color}
    />
    <Path
      d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const ResultSection = ({
  language,
  languageList,
  languageNames,
  translatedTitle,
  translatedPoster,
  allTranslations,
  allPosters,
  loading,
  translations,
  onLanguageChange,
  frameHeight,
}) => {
  const [showPosterModal, setShowPosterModal] = useState(false);

  const handleSpeak = () => {
    if (translatedTitle && !translatedTitle.startsWith('No ')) {
      Speech.speak(translatedTitle, {
        language: language.langCode,
      });
    }
  };

  const hasContent = translatedTitle || loading;

  return (
    <View style={styles.container}>
        <LanguagePicker
          language={language}
          languageList={languageList}
          languageNames={languageNames}
          selectLanguageText={translations.selectLanguage}
          onLanguageChange={onLanguageChange}
          showTranslatedName={true}
          allTranslations={allTranslations}
          allPosters={allPosters}
        />

        {(translatedTitle || loading) && (
          <View style={styles.resultRow}>
            {translatedPoster ? (
              <TouchableOpacity onPress={() => setShowPosterModal(true)}>
                <Image source={{ uri: translatedPoster }} style={styles.poster} />
              </TouchableOpacity>
            ) : translatedTitle && !translatedTitle.includes(translations.noTitleFound) ? (
              <View style={[styles.poster, styles.noPoster]}>
                <Text style={styles.noPosterText}>{translations.noPoster}</Text>
              </View>
            ) : null}

            <View style={styles.titleContainer}>
              <View style={styles.titleRow}>
                <Text style={[
                  styles.title,
                  usesLatinScript(language.code) ? styles.titleFontPrimary : styles.titleFontFallback,
                  translatedTitle?.includes(translations.noTitleFound) && styles.titleMuted
                ]}>
                  {loading ? translations.searching : translatedTitle}
                </Text>
                {!loading && translatedTitle && !translatedTitle.includes(translations.noTitleFound) && (
                  <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
                    <SpeakerIcon size={24} color="#4a3f38" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

      {translatedPoster && (
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
              source={{ uri: translatedPoster }}
              style={styles.posterLarge}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  noPoster: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a3f38',
    borderStyle: 'dashed',
    backgroundColor: '#f5f5f5',
  },
  noPosterText: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    color: '#333',
    fontSize: 18,
    flexShrink: 1,
  },
  titleFontPrimary: {
    fontFamily: 'AlfaSlabOne_400Regular',
  },
  titleFontFallback: {
    fontFamily: 'Montserrat_900Black',
  },
  titleMuted: {
    color: '#999',
  },
  speakButton: {
    marginLeft: 10,
    padding: 5,
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

export default ResultSection;
