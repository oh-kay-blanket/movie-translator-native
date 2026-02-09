# Movie Translator Native

React Native/Expo app for finding translated movie titles.

## Tech Stack

- React Native 0.81 with Expo SDK 54
- The Movie Database (TMDB) API for movie data and translations

## Project Structure

- `App.js` - Main component with state management and API calls
- `components/Search.js` - Language picker and movie search input
- `components/Result.js` - Displays original and translated titles

## Key Patterns

- Language selection uses country codes (e.g., 'JP', 'DE', 'FR')
- TMDB API calls are in useEffect in App.js, triggered by query/language changes
- Supports 29 languages defined in `languageList` array
