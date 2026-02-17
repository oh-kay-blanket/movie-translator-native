import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Animated,
  Image,
  useWindowDimensions,
} from 'react-native';


const STRIP_BREAKPOINT = 700;

const LanguagePicker = ({ language, languageList, languageNames, deviceLanguage, selectLanguageText, onLanguageChange, showTranslatedName = false, allTranslations = {}, allPosters = {} }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const useStripMode = screenWidth >= STRIP_BREAKPOINT;
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(1)).current; // 1 = off screen, 0 = visible

  const openPicker = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(1);
    setModalVisible(true);
    setShowPicker(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closePicker = () => {
    setShowPicker(false);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  const handleSelect = (index) => {
    onLanguageChange(index);
    closePicker();
  };

  // Find the device language in the list and its index
  const deviceLangIndex = deviceLanguage
    ? languageList.findIndex(lang => lang.code === deviceLanguage.code)
    : -1;

  // Create reordered list with device language first (if it exists in the list)
  const reorderedList = deviceLangIndex >= 0
    ? [
        languageList[deviceLangIndex],
        ...languageList.filter((_, i) => i !== deviceLangIndex),
      ]
    : languageList;

  // Map reordered index back to original index
  const getOriginalIndex = (reorderedIndex) => {
    if (deviceLangIndex < 0) return reorderedIndex;
    if (reorderedIndex === 0) return deviceLangIndex;
    const lang = reorderedList[reorderedIndex];
    return languageList.findIndex(l => l.code === lang.code);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={openPicker}
      >
        <Text style={styles.pickerButtonText}>
          {showTranslatedName && languageNames ? languageNames[language.code] : language.name} ▼
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
        onRequestClose={closePicker}
      >
        <View style={[styles.modalContainer, { width: screenWidth, height: screenHeight }]}>
          <Animated.View style={[styles.modalOverlay, { width: screenWidth, height: screenHeight, opacity: fadeAnim }]}>
            <Pressable style={styles.overlayPressable} onPress={closePicker} />
          </Animated.View>
          <View style={[styles.modalFrame, useStripMode && styles.modalFrameStrip]}>
            <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 600] }) }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectLanguageText || 'Select Language'}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closePicker}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.listContainer}>
              {reorderedList.map((lang, index) => {
                const isDeviceLanguage = deviceLanguage && lang.code === deviceLanguage.code;
                const hasTranslations = Object.keys(allTranslations).length > 0;
                const translatedTitle = allTranslations[lang.code] || (lang.langCode === 'en' ? allTranslations['_default'] : null);
                const poster = allPosters[lang.langCode];
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.listItem,
                      language.code === lang.code && styles.listItemSelected,
                      isDeviceLanguage && styles.listItemDefault,
                    ]}
                    onPress={() => handleSelect(getOriginalIndex(index))}
                  >
                    <View style={styles.listItemContent}>
                      <View style={styles.listItemTextContainer}>
                        <Text
                          style={[
                            styles.listItemText,
                            language.code === lang.code && styles.listItemTextSelected,
                          ]}
                        >
                          {showTranslatedName && languageNames ? languageNames[lang.code] : lang.name}
                        </Text>
                        {languageNames && languageNames[lang.code] !== lang.name && (
                          <Text style={styles.listItemSubtext}>
                            {showTranslatedName ? lang.name : languageNames[lang.code]}
                          </Text>
                        )}
                      </View>
                      {hasTranslations && (
                        <View style={styles.previewContainer}>
                          {poster ? (
                            <Image source={{ uri: poster }} style={styles.previewPoster} />
                          ) : (
                            <View style={[styles.previewPoster, styles.previewPosterEmpty]} />
                          )}
                          <Text style={[styles.previewTitle, !translatedTitle && styles.previewTitleEmpty]} numberOfLines={2}>
                            {translatedTitle || '—'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    direction: 'ltr',
  },
  pickerButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    direction: 'ltr',
  },
  pickerButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  modalContainer: {
    flex: 1,
  },
  modalFrame: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  modalFrameStrip: {
    maxWidth: 414,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayPressable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    direction: 'ltr',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    direction: 'ltr',
  },
  listItemTextContainer: {
    flex: 1,
    marginRight: 12,
    direction: 'ltr',
  },
  listItemDefault: {
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  listItemSelected: {
    backgroundColor: '#fff5f5',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  listItemTextSelected: {
    color: '#333',
    fontWeight: 'bold',
  },
  listItemSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    direction: 'ltr',
  },
  previewPoster: {
    width: 33,
    height: 50,
    borderRadius: 4,
    backgroundColor: '#ddd',
    flexShrink: 0,
  },
  previewPosterEmpty: {
    backgroundColor: '#eee',
  },
  previewTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#555',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  previewTitleEmpty: {
    color: '#bbb',
  },
});

export default LanguagePicker;
