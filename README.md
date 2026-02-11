# The Badass Smartass

Offline-first Expo managed mobile assistant for motorcycle maintenance guidance for Virginia (2004 Harley-Davidson Road King Police, FLHP-I).

## Requirements
- Node 18+
- npm
- Expo Go app on device

## Setup
```bash
npm install
npx expo start
```

Scan the QR code in Expo Go.

## Expo Go Compatibility
- Managed workflow only
- No custom native modules
- On-device SQLite for storage
- On-device file imports with Expo Document Picker
- On-device speech playback via `expo-speech`
- Speech-to-text via Expo-compatible speech recognition API

## Offline-First Behavior
- Imports and stores manual files locally.
- Chunks, embeddings, keyword index, retrieval, and answer formatting run locally.
- If no answer found in imported manuals the app returns: `Not in the provided manuals.`
- If retrieval confidence is too low the app returns: `They can't all be golden.`

## Test
```bash
npm test
```
