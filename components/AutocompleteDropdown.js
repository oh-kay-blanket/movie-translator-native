import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const AutocompleteDropdown = ({ suggestions, onSelect, visible }) => {
  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.itemText}>
              {item.title}
              {item.year && <Text style={styles.yearText}> ({item.year})</Text>}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#dbdbd5',
    borderWidth: 1,
    borderColor: '#d62b1e',
    borderTopWidth: 0,
    zIndex: 1000,
    maxHeight: 200,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemText: {
    color: '#d62b1e',
    fontSize: 16,
  },
  yearText: {
    color: '#888',
    fontSize: 14,
  },
});

export default AutocompleteDropdown;
