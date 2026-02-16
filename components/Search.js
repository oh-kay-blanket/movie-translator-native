import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AutocompleteDropdown from './AutocompleteDropdown';

const Search = ({
  language,
  languageList,
  query,
  topHits,
  handleLanguage,
  handleInput,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleTextChange = (text) => {
    handleInput(text);
    setShowDropdown(text.length > 0);
  };

  const handleSuggestionSelect = (suggestion) => {
    handleInput(suggestion);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const selectedIndex = languageList.findIndex(
    (lang) => lang.code === language.code
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MOVIE TITLES IN </Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {language.name} ▼
          </Text>
        </TouchableOpacity>
      </View>

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
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedIndex}
                onValueChange={(itemValue) => {
                  handleLanguage(itemValue);
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {languageList.map((lang, index) => (
                  <Picker.Item
                    key={index}
                    label={lang.name}
                    value={index}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="search for a movie"
          placeholderTextColor="#444"
          value={query}
          onChangeText={handleTextChange}
          onFocus={() => setShowDropdown(query.length > 0)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <AutocompleteDropdown
          suggestions={topHits}
          onSelect={handleSuggestionSelect}
          visible={showDropdown}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  pickerButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#333',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  pickerButtonText: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
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
    maxHeight: '50%',
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
  pickerWrapper: {
    height: 200,
  },
  picker: {
    color: '#333',
    backgroundColor: 'transparent',
  },
  pickerItem: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 30,
    shadowColor: '#333',
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  input: {
    width: '100%',
    backgroundColor: '#f78e6a',
    borderWidth: 2,
    borderColor: '#333',
    textAlign: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#333',
  },
});

export default Search;
