import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedIndex}
            onValueChange={(itemValue) => handleLanguage(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {languageList.map((lang, index) => (
              <Picker.Item
                key={index}
                label={lang.name.toUpperCase()}
                value={index}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="search for a title"
          placeholderTextColor="#999"
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
    color: '#d62b1e',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  pickerContainer: {
    borderBottomWidth: 3,
    borderBottomColor: '#d62b1e',
    minWidth: 150,
  },
  picker: {
    color: '#d62b1e',
    backgroundColor: 'transparent',
  },
  pickerItem: {
    color: '#d62b1e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 30,
    shadowColor: '#d62b1e',
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  input: {
    width: '100%',
    backgroundColor: '#dbdbd5',
    borderWidth: 2,
    borderColor: '#d62b1e',
    textAlign: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#333',
  },
});

export default Search;
