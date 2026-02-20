import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  FlatList,
  Animated,
  Image,
  useWindowDimensions,
} from "react-native";

const STRIP_BREAKPOINT = 700;

const LanguagePicker = ({
  language,
  languageList,
  languageNames,
  selectLanguageText,
  onLanguageChange,
  showTranslatedName = false,
  allTranslations = {},
  allPosters = {},
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const useStripMode = screenWidth >= STRIP_BREAKPOINT;
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(1)).current; // 1 = off screen, 0 = visible
  const flatListRef = useRef(null);

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
    ]).start(() => {
      scrollToCurrentLanguage();
    });
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

  // Scroll to current language position
  const scrollToCurrentLanguage = () => {
    const currentIndex = languageList.findIndex(
      (lang) => lang.code === language.code,
    );
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex,
        animated: false,
        viewPosition: 0,
      });
    }
  };

  const renderItem = ({ item: lang, index }) => {
    const hasTranslations = Object.keys(allTranslations).length > 0;
    const translatedTitle =
      allTranslations[lang.code] ||
      (lang.langCode === "en" ? allTranslations["_default"] : null);
    const poster = allPosters[lang.langCode];

    return (
      <TouchableOpacity
        style={[
          styles.listItem,
          language.code === lang.code && styles.listItemSelected,
        ]}
        onPress={() => handleSelect(index)}
      >
        <View style={styles.listItemContent}>
          <View style={styles.listItemTextContainer}>
            <Text
              style={[
                styles.listItemText,
                language.code === lang.code && styles.listItemTextSelected,
              ]}
            >
              {showTranslatedName && languageNames
                ? languageNames[lang.code]
                : lang.name}
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
                <View
                  style={[styles.previewPoster, styles.previewPosterEmpty]}
                />
              )}
              <Text
                style={[
                  styles.previewTitle,
                  !translatedTitle && styles.previewTitleEmpty,
                ]}
                numberOfLines={2}
              >
                {translatedTitle || "—"}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pickerButton} onPress={openPicker}>
        <Text style={styles.pickerButtonText}>
          {showTranslatedName && languageNames
            ? languageNames[language.code]
            : language.name}{" "}
          ▼
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
        <View
          style={[
            styles.modalContainer,
            { width: screenWidth, height: screenHeight },
          ]}
        >
          <Animated.View
            style={[
              styles.modalOverlay,
              { width: screenWidth, height: screenHeight, opacity: fadeAnim },
            ]}
          >
            <Pressable style={styles.overlayPressable} onPress={closePicker} />
          </Animated.View>
          <View
            style={[styles.modalFrame, useStripMode && styles.modalFrameStrip]}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 600],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectLanguageText || "Select Language"}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closePicker}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                ref={flatListRef}
                data={languageList}
                renderItem={renderItem}
                keyExtractor={(item) => item.code}
                style={styles.listContainer}
                onScrollToIndexFailed={() => {}}
              />
            </Animated.View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    direction: "ltr",
  },
  pickerButton: {
    paddingVertical: 5,
    paddingRight: 10,
    direction: "ltr",
  },
  pickerButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    writingDirection: "ltr",
  },
  modalContainer: {
    flex: 1,
  },
  modalFrame: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    justifyContent: "flex-end",
  },
  modalFrameStrip: {
    maxWidth: 414,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayPressable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    direction: "ltr",
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    direction: "ltr",
  },
  listItemTextContainer: {
    flex: 1,
    marginRight: 12,
    direction: "ltr",
  },
  listItemSelected: {
    backgroundColor: "#fff5f5",
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    writingDirection: "ltr",
  },
  listItemTextSelected: {
    color: "#333",
    fontWeight: "bold",
  },
  listItemSubtext: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    textAlign: "left",
    writingDirection: "ltr",
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    direction: "ltr",
  },
  previewPoster: {
    width: 33,
    height: 50,
    borderRadius: 4,
    backgroundColor: "#ddd",
    flexShrink: 0,
  },
  previewPosterEmpty: {
    backgroundColor: "#eee",
  },
  previewTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#555",
    textAlign: "left",
    writingDirection: "ltr",
  },
  previewTitleEmpty: {
    color: "#bbb",
  },
});

export default LanguagePicker;
