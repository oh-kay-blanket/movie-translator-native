import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';

const LanguagePicker = ({ language, languageList, onLanguageChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (index) => {
    onLanguageChange(index);
    setShowPicker(false);
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
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.listContainer}>
              {languageList.map((lang, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.listItem,
                    language.code === lang.code && styles.listItemSelected,
                  ]}
                  onPress={() => handleSelect(index)}
                >
                  <Text
                    style={[
                      styles.listItemText,
                      language.code === lang.code && styles.listItemTextSelected,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
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
});

export default LanguagePicker;
