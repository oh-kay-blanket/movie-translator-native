import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Result = ({ language, loading, movieDBOriginalResult, movieDBTRResult }) => {
  return (
    <View style={styles.container}>
      <View style={styles.resultRow}>
        <Text style={styles.label}>Original: </Text>
        <Text style={styles.title}>
          {loading ? 'searching...' : movieDBOriginalResult}
        </Text>
      </View>
      <View style={styles.resultRow}>
        <Text style={styles.label}>
          {language.name} ({language.engName}):{' '}
        </Text>
        <Text style={styles.title}>
          {loading ? 'searching...' : movieDBTRResult}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
  },
  resultRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  label: {
    color: '#d62b1e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    color: '#d62b1e',
    fontSize: 18,
    flexShrink: 1,
  },
});

export default Result;
