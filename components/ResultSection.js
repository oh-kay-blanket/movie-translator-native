import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import * as Speech from "expo-speech";
import Svg, { Path } from "react-native-svg";
import LanguagePicker from "./LanguagePicker";

const getPosterSize = (frameHeight) => {
  // Limit poster height to 50% of frame, with 2:3 aspect ratio
  const maxHeight = frameHeight * 0.5;
  const height = Math.min(maxHeight, 180);
  const width = height / 1.5;
  return { width, height };
};

const latinScriptLanguages = [
  "ID",
  "CZ",
  "DK",
  "DE",
  "US",
  "ES",
  "FR",
  "HU",
  "IT",
  "NL",
  "NO",
  "PL",
  "BR",
  "PT",
  "RO",
  "FI",
  "SE",
  "VN",
  "TR",
];
const usesLatinScript = (langCode) => latinScriptLanguages.includes(langCode);

const SpeakerIcon = ({ size = 24, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 5L6 9H2v6h4l5 4V5z" fill={color} />
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
  backTranslation,
  allTranslations,
  allPosters,
  loading,
  translations,
  onLanguageChange,
  frameHeight,
}) => {
  const [showPosterModal, setShowPosterModal] = useState(false);

  const handleSpeak = async () => {
    if (translatedTitle && !translatedTitle.startsWith("No ")) {
      // Try to find a male voice for the selected language
      const voices = await Speech.getAvailableVoicesAsync();
      const langVoices = voices.filter(
        (v) =>
          v.language?.startsWith(language.langCode) ||
          v.language?.toLowerCase().includes(language.langCode.toLowerCase()),
      );

      // Prefer male voices (look for common male voice identifiers)
      const maleVoiceNames = [
        "male",
        // English
        "daniel",
        "alex",
        "tom",
        "fred",
        "bruce",
        "ralph",
        "albert",
        "oliver",
        "gordon",
        "lee",
        "aaron",
        "evan",
        "nathan",
        "rishi",
        "jamie",
        "grandpa",
        // German
        "markus",
        "yannick",
        "martin",
        "viktor",
        // French
        "thomas",
        "nicolas",
        "jacques",
        "anthony",
        // Spanish
        "jorge",
        "diego",
        "juan",
        "carlos",
        "pablo",
        "mónica",
        "andrés",
        "rodrigo",
        // Italian
        "luca",
        "paolo",
        "marco",
        "alice",
        // Portuguese
        "luciano",
        "felipe",
        "ricardo",
        "fernanda",
        // Russian
        "yuri",
        "milena",
        "maxim",
        "dmitri",
        // Japanese
        "otoya",
        "ichiro",
        "hattori",
        "takumi",
        // Korean
        "minsu",
        "joon",
        "hyunsu",
        // Chinese
        "binbin",
        "yunyang",
        "kangkang",
        "yaoyao",
        // Dutch
        "xander",
        "frank",
        // Polish
        "krzysztof",
        "adam",
        // Swedish
        "oskar",
        "erik",
        // Norwegian
        "henrik",
        "nora",
        // Danish
        "magnus",
        "lars",
        // Finnish
        "onni",
        "harri",
        // Turkish
        "tolga",
        "cem",
        // Arabic
        "tarik",
        "maged",
        // Hindi
        "ravi",
        "hemant",
        // Thai
        "krit",
        "niwat",
        // Vietnamese
        "an",
        "nam",
        // Indonesian
        "ardi",
        "gadis",
      ];

      // Android-specific patterns (found in voice identifier or name)
      const androidMalePatterns = [
        "#male",      // Google TTS pattern: "en-us-x-sfg#male_1-local"
        "male_",      // Samsung/other: "male_1", "male_2"
        "-male",      // Alternative pattern
        "_male",      // Alternative pattern
        "studio-m",   // Google Studio voices (male)
        "wavenet-b",  // Google WaveNet male voices
        "wavenet-d",  // Google WaveNet male voices
        "neural2-b",  // Google Neural2 male voices
        "neural2-d",  // Google Neural2 male voices
        "standard-b", // Google Standard male voices
        "standard-d", // Google Standard male voices
      ];

      const maleVoice =
        langVoices.find((v) => {
          const name = v.name?.toLowerCase() || "";
          const identifier = v.identifier?.toLowerCase() || "";
          const combined = name + " " + identifier;
          return (
            maleVoiceNames.some((male) => combined.includes(male)) ||
            androidMalePatterns.some((pattern) => combined.includes(pattern)) ||
            v.quality === "Enhanced"
          );
        }) || langVoices[0];

      Speech.speak(translatedTitle, {
        language: language.langCode,
        voice: maleVoice?.identifier,
        pitch: 0.9, // Lower pitch for deeper voice
        rate: 0.9, // Slightly slower for dramatic effect
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
              <Image
                source={{ uri: translatedPoster }}
                style={[styles.poster, getPosterSize(frameHeight)]}
              />
            </TouchableOpacity>
          ) : translatedTitle &&
            !translatedTitle.includes(translations.noTitleFound) ? (
            <View
              style={[
                styles.poster,
                styles.noPoster,
                getPosterSize(frameHeight),
              ]}
            >
              <Text style={styles.noPosterText}>{translations.noPoster}</Text>
            </View>
          ) : null}

          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  usesLatinScript(language.code)
                    ? styles.titleFontPrimary
                    : styles.titleFontFallback,
                  !usesLatinScript(language.code) && styles.titleLarger,
                  translatedTitle?.includes(translations.noTitleFound) &&
                    styles.titleMuted,
                ]}
              >
                {loading ? translations.searching : translatedTitle}
              </Text>
              {!loading &&
                translatedTitle &&
                !translatedTitle.includes(translations.noTitleFound) && (
                  <TouchableOpacity
                    style={styles.speakButton}
                    onPress={handleSpeak}
                  >
                    <SpeakerIcon size={24} color="#333" />
                  </TouchableOpacity>
                )}
            </View>
            {!loading && backTranslation && (
              <Text style={styles.backTranslation}>{backTranslation}</Text>
            )}
          </View>
        </View>
      )}

      {translatedPoster && (
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  poster: {
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  noPoster: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(74, 63, 56, 0.3)",
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  noPosterText: {
    color: "rgba(74, 63, 56, 0.5)",
    fontSize: 10,
    textAlign: "center",
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    color: "#333",
    fontSize: 18,
    flexShrink: 1,
  },
  titleFontPrimary: {
    fontFamily: "AlfaSlabOne_400Regular",
  },
  titleFontFallback: {
    fontWeight: Platform.select({ web: "700", default: "600" }),
  },
  titleLarger: {
    fontSize: 24,
  },
  titleMuted: {
    color: "#999",
  },
  backTranslation: {
    color: "#777",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 4,
  },
  speakButton: {
    marginLeft: 10,
    padding: 5,
  },
  posterModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  posterLarge: {
    width: "90%",
    height: "80%",
  },
});

export default ResultSection;
