# 🎵 Angoro

A music player app built with React Native CLI, featuring background playback,
lock screen controls, and a Redux-powered architecture.

Built with a red-to-black dark theme.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native CLI (TypeScript) |
| State Management | Redux Toolkit |
| Audio Engine | react-native-track-player |
| Navigation | React Navigation (Bottom Tabs) |
| API | Google Apps Script (REST) |
| Testing | Jest + React Testing Library |

---

## Architecture
Native Player → TrackPlayer Service → Redux Store → React UI


The UI never talks to the native player directly.
It dispatches Redux actions. The service listens to the
native player and syncs state back to Redux.
This keeps everything predictable and testable.

---

## Key Features

- 🎵 Stream audio from a remote API
- 🔒 Background playback — audio continues when app is closed
- 📱 Lock screen controls — play, pause, next, previous
- 🎧 Hardware button support — headphones and Bluetooth
- 📻 Audio focus handling — pauses on phone calls automatically
- 🎨 Red-to-black dark theme throughout

---

## Anti-Corruption Layer

API field names are transformed once at the Redux layer
and never leak into the UI:

| API field | Internal model |
|---|---|
| `nom_song` | `title` |
| `autor` | `artist` |
| `logo` | `artwork` |
| `link` | `url` |

---

## Android Native Config

Background audio requires the following in `AndroidManifest.xml`:

- `FOREGROUND_SERVICE` — keeps audio alive in background
- `FOREGROUND_SERVICE_MEDIA_PLAYBACK` — required on Android 14+
- `WAKE_LOCK` — prevents CPU sleep during playback
- `RECEIVE_BOOT_COMPLETED` — restores service after reboot
- `HeadlessJsMediaService` — handles lock screen and notification controls

---

## Getting Started

### Prerequisites
- Node 20+
- Android device or emulator
- `adb` in your PATH

### Run

```bash
# 1. Install dependencies
npm install

# 2. Start Metro
npx react-native start --reset-cache

# 3. In a new terminal
adb reverse tcp:8081 tcp:8081
npx react-native run-android
```

---

## iOS

iOS builds require Xcode 16.1+. Android is the primary
development target for this project.

---

## Development Workflow

| Branch | Purpose |
|---|---|
| `main` | Stable releases only |
| `development` | All active development |

---

## License

MIT