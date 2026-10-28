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

## Optional AI backend service

A small OpenAI-compatible proxy now lives in `backend/`. It keeps the provider key on the server rather than inside the mobile app.

### Deploy with a Docker host

- Use `backend/` as the service root directory, or build from the repository root with `backend/Dockerfile`.
- Set the environment variables from `backend/.env.example` in the hosting dashboard.
- Set `AI_API_KEY` to a valid provider API key; never commit the real key.
- Set `AI_BASE_URL` to the provider's OpenAI-compatible API base URL and `AI_MODEL` to a model supported by that provider.
- Confirm `https://YOUR-SERVICE/health` returns JSON with `ok: true` and `configured: true`.
- In Medhas.ai Settings, enter `https://YOUR-SERVICE` as the backend URL.

The backend forwards chat requests to the configured provider. It does not train or host a model itself. Provider usage may incur charges. Before public release, add authentication, per-user rate limits, request quotas, and monitoring; the current proxy is a development milestone, not a public multi-user production service.
