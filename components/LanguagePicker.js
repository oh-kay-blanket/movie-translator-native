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
  Dimensions,
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

const LanguagePicker = ({ language, languageList, languageNames, deviceLanguage, selectLanguageText, onLanguageChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (showPicker) {
      setModalVisible(true);
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
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [showPicker, fadeAnim, slideAnim]);

  const handleSelect = (index) => {
    onLanguageChange(index);
    setShowPicker(false);
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
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.pickerButtonText}>
          {language.name.toUpperCase()} ▼
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <Pressable style={styles.overlayPressable} onPress={() => setShowPicker(false)} />
          </Animated.View>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectLanguageText || 'Select Language'}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.listContainer}>
              {reorderedList.map((lang, index) => {
                const isDeviceLanguage = deviceLanguage && lang.code === deviceLanguage.code;
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
                    <Text
                      style={[
                        styles.listItemText,
                        language.code === lang.code && styles.listItemTextSelected,
                      ]}
                    >
                      {lang.name}
                    </Text>
                    {languageNames && languageNames[lang.code] !== lang.name && (
                      <Text style={styles.listItemSubtext}>
                        {languageNames[lang.code]}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pickerButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  pickerButtonText: {
    color: '#d62b1e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
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
    color: '#d62b1e',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  },
  listItemTextSelected: {
    color: '#d62b1e',
    fontWeight: 'bold',
  },
  listItemSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});

export default LanguagePicker;
