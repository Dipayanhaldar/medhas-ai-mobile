# Medhas.ai Mobile

A dedicated React Native + Expo mobile application for Medhas.ai. This is a mobile app repository, not a website.

## What's included

- Chat interface for Android and iOS using one shared codebase
- Local chat history and editable memory notes
- Configurable OpenAI-compatible backend endpoint
- Read-aloud support using the device speech engine
- Expo EAS preview build profile configured for Android APK output

## Current limitations

This is an early starter scaffold and has **not been build-tested**. A deployed AI backend is not included. Configure your own compatible backend URL in Settings before expecting AI responses.

- No model is trained or hosted by this repository.
- Document text extraction and web search are not implemented.
- Speech-to-text is not implemented.
- Memory is stored locally on the device; it is not synced across devices.
- Do not place provider API keys in the mobile app. Keep secrets on a secured backend.
- Before public launch, add authentication, per-user isolation, rate limits, HTTPS, privacy disclosures, abuse controls, and testing.

## Run locally

Requires a current Node.js LTS release.

```bash
npm install
npx expo start
```

## Build Android APK

Install and sign in to Expo Application Services, then run:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

The preview profile is configured for an APK. A successful cloud build is required before you can distribute the APK.

## Build iOS

Use `eas build --platform ios` after configuring Apple signing and the required Apple developer account. An Android APK cannot be installed on iPhone.

## Repository status

The source files in this repository are a first implementation, not a finished public AI service. The app build and backend integration still need verification.
