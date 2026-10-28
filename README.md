# Medhas.ai Mobile

A dedicated React Native + Expo mobile-app project for Medhas.ai. This repository is for the Android and iOS app, not a website.

## Current status

The initial source package is provided as `medhas-ai-mobile-source.zip`. It is an early starter scaffold and has not yet been build-tested. A deployed AI backend is not included; configure a compatible backend URL in app settings before expecting AI responses.

## Build targets

- Android: Expo EAS preview build can produce an APK after dependencies and backend are configured.
- iOS: requires an Apple signing setup and a compatible EAS build.

## Important limitations

This is not yet production-ready. Document text extraction and web search are not implemented, speech-to-text is not implemented, and memory is local to the device. Never ship API secrets in the mobile app. A public backend should implement authentication, per-user isolation, rate limits, HTTPS, and abuse controls.
