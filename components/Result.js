import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';

const Result = ({
  language,
  loading,
  movieDBOriginalResult,
  movieDBTRResult,
  originalPoster,
  translatedPoster,
}) => {
  const showPosters = originalPoster || translatedPoster;

  return (
    <View style={styles.container}>
      {showPosters && (
        <View style={styles.posterContainer}>
          <View style={styles.posterWrapper}>
            {originalPoster ? (
              <Image source={{ uri: originalPoster }} style={styles.poster} />
            ) : (
              <View style={[styles.poster, styles.noPoster]}>
                <Text style={styles.noPosterText}>No poster</Text>
              </View>
            )}
            <Text style={styles.posterLabel}>Original</Text>
          </View>
          <View style={styles.posterWrapper}>
            {translatedPoster ? (
              <Image source={{ uri: translatedPoster }} style={styles.poster} />
            ) : (
              <View style={[styles.poster, styles.noPoster]}>
                <Text style={styles.noPosterText}>No {language.engName} poster</Text>
              </View>
            )}
            <Text style={styles.posterLabel}>{language.engName}</Text>
          </View>
        </View>
      )}
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
  posterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  posterWrapper: {
    alignItems: 'center',
  },
  poster: {
    width: 140,
    height: 210,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  noPoster: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  noPosterText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    padding: 10,
  },
  posterLabel: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  resultRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  label: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    color: '#333',
    fontSize: 18,
    fontWeight: Platform.select({ web: '600', default: '500' }),
    flexShrink: 1,
  },
});

export default Result;
