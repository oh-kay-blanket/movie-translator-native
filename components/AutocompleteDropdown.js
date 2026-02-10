import React from 'react';
import {
  View,
  Text,
  Image,
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
            {item.poster ? (
              <Image source={{ uri: item.poster }} style={styles.poster} />
            ) : (
              <View style={styles.noPoster} />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.itemText} numberOfLines={2}>
                {item.title}
              </Text>
              {item.year && <Text style={styles.yearText}>{item.year}</Text>}
            </View>
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
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#d62b1e',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 1000,
    maxHeight: 250,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  poster: {
    width: 35,
    height: 52,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  noPoster: {
    width: 35,
    height: 52,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  itemText: {
    color: '#d62b1e',
    fontSize: 15,
    fontWeight: '500',
  },
  yearText: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
});

export default AutocompleteDropdown;
