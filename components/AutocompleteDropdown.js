import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

const AutocompleteDropdown = ({
  suggestions,
  onSelect,
  visible,
  inputLayout,
}) => {
  if (!visible || suggestions.length === 0 || !inputLayout) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          left: inputLayout.x,
          width: inputLayout.width,
          top: inputLayout.y + inputLayout.height - 10,
        },
      ]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
        bounces={false}
        overScrollMode="always"
      >
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={`${item.id}-${index}`}
            style={styles.item}
            onPress={() => onSelect(item)}
            activeOpacity={0.7}
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
    position: "absolute",
    backgroundColor: "#f78e6a",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#333",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingTop: 8,
    zIndex: 1000,
    maxHeight: Platform.OS === "web" ? 180 : 240,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(51, 51, 51, 0.35)",
  },
  poster: {
    width: 35,
    height: 52,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  noPoster: {
    width: 35,
    height: 52,
    borderRadius: 4,
    backgroundColor: "#fdf8f2",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  itemText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
  },
  yearText: {
    color: "#555",
    fontSize: 13,
    marginTop: 2,
  },
});

export default AutocompleteDropdown;
