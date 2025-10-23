# Audio Player PWA

A fully-functional Progressive Web App audio player built with React, featuring gesture controls, playlist management, and local file playback.

## 🎵 Features

### Core Functionality
- **Audio Playback**: Play local audio files (MP3, WAV, OGG, M4A)
- **Playlist Management**: Create, edit, and manage playlists
- **Seek Controls**: Interactive progress bar with drag-to-seek
- **Transport Controls**: Play, Pause, Next, Previous
- **Advanced Controls**: Shuffle, Repeat (Off/One/All), Skip ±15s

### Control Modes
- **Touch Controls**: Traditional button-based interface
- **Gesture Controls**: Swipe and tap gestures for hands-free control
- **Both**: Combine touch and gestures
- **Disabled**: Lock all controls

### Gestures Supported
- **Swipe Left**: Next track
- **Swipe Right**: Previous track
- **Double Tap**: Play/Pause
- **Swipe Up/Down**: Volume control (optional)
- **Long Press**: Restart track

### User Experience
- **Splash Screen**: Loading animation on startup
- **Visual Feedback**: Toast notifications for gesture detection
- **Gesture Tutorial**: Interactive tutorial to learn gestures
- **Settings**: Customize control mode and sensitivity
- **Persistent State**: Automatically saves and restores playback state

## 📱 Screens

1. **Splash** - Loading screen with progress indicator
2. **Home / Player** - Main player interface with mini controls
3. **Playlist** - Track list with add/remove functionality
4. **Now Playing** - Full-screen player with large artwork
5. **File Browser** - Import local audio files or test tracks
6. **Settings** - Configure control modes and preferences
7. **Gesture Tutorial** - Learn and practice gestures
8. **About / Debug** - App info, logs, and storage management

## 🚀 Getting Started

### Quick Start

The app is ready to use immediately:

1. **Launch the app** - It will start with the splash screen
2. **Add tracks** - Navigate to Playlist → Add button
3. **Choose an option**:
   - Upload your own audio files
   - Add test tracks (3 generated sine wave tones)
4. **Start playing** - Tap a track to play

### Adding Your Own Music

1. Click the **Playlist** button on the home screen
2. Click the **+** button in the top right
3. Click **Select Files** to choose audio files from your device
4. Selected files will appear in the list
5. Click **Add to Playlist** to import them

### Using Gestures

1. Go to **Settings** (gear icon on home screen)
2. Select a control mode:
   - **Both** (recommended for beginners)
   - **Gestures Only** (for advanced users)
3. Optionally adjust **Gesture Sensitivity**
4. Try the **Gesture Tutorial** to practice

## 🎮 Controls Reference

### Touch Controls
- **Play/Pause Button**: Toggle playback
- **Previous/Next Buttons**: Change tracks
- **Progress Bar**: Drag to seek
- **Cover Art**: Tap to open detailed view

### Gesture Controls (when enabled)
| Gesture | Action |
|---------|--------|
| Swipe Left | Next track |
| Swipe Right | Previous track |
| Double Tap | Play/Pause |
| Swipe Up | Increase volume |
| Swipe Down | Decrease volume |
| Long Press | Restart track |

## 🔧 Technical Details

### Architecture

```
/
├── App.tsx                 # Main app component with routing
├── types/                  # TypeScript type definitions
├── services/
│   ├── audio-player.ts    # HTML5 Audio API wrapper
│   └── storage.ts         # localStorage persistence
├── hooks/
│   └── useGestures.ts     # Custom gesture detection hook
├── screens/               # Screen components
│   ├── Splash.tsx
│   ├── Home.tsx
│   ├── Playlist.tsx
│   ├── NowPlaying.tsx
│   ├── FileBrowser.tsx
│   ├── Settings.tsx
│   ├── GestureTutorial.tsx
│   └── About.tsx
├── components/            # Reusable components
│   ├── ProgressBar.tsx
│   ├── ControlButton.tsx
│   ├── TrackListItem.tsx
│   ├── ModeIndicator.tsx
│   └── GestureOverlay.tsx
└── utils/
    └── test-tracks.ts     # Test audio generation
```

### Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4.0** - Styling
- **HTML5 Audio API** - Audio playback
- **Web Storage API** - Data persistence
- **Touch Events API** - Gesture detection
- **Shadcn/ui** - Component library
- **Lucide Icons** - Icon set
- **Sonner** - Toast notifications

### Data Storage

All data is stored locally in your browser's `localStorage`:

- `@APP:playlists` - Your playlists and tracks
- `@APP:settings` - Control preferences
- `@APP:current` - Current playback state
- `@APP:logs` - Debug logs

**Privacy Note**: Nothing is sent to any server. All audio files and data stay on your device.

## 🧪 Test Cases

### TC1: Initial Launch
1. Open the app
2. ✅ Splash screen appears
3. ✅ App loads to Home screen
4. ✅ "No track selected" message shown

### TC2: Add Test Tracks
1. Navigate to Playlist
2. Click Add button
3. Click "Add Test Tracks"
4. ✅ 3 test tracks appear in playlist

### TC3: Playback
1. Tap a track in the playlist
2. ✅ Track starts playing
3. ✅ Progress bar moves
4. Tap pause
5. ✅ Playback stops
6. ✅ Position is maintained

### TC4: Gesture Control
1. Go to Settings
2. Enable gesture mode
3. Return to home screen
4. Swipe left
5. ✅ Next track plays
6. Swipe right
7. ✅ Previous track plays

### TC5: Seek Control
1. Play a track
2. Drag progress bar to middle
3. ✅ Playback jumps to new position

### TC6: Persistence
1. Play a track
2. Close/refresh the browser
3. ✅ App reopens with same track
4. ✅ Position is restored

### TC7: Settings Save
1. Change control mode to "Touch Only"
2. Close/refresh the browser
3. ✅ Setting is preserved

## 🎨 UI/UX Design

### Design Principles
- **Mobile-First**: Optimized for touch screens
- **Minimalist**: Clean, focused interface
- **Readable**: Large text and buttons
- **Accessible**: High contrast, labeled controls
- **Responsive**: Works on all screen sizes

### Color Scheme
- **Background**: Black (#000) to dark zinc
- **Accent**: Blue (#3b82f6) for interactive elements
- **Text**: White with zinc shades for hierarchy
- **Feedback**: Green (success), Red (error)

## 📱 PWA Features

This is a Progressive Web App, which means:

- ✅ **Works Offline**: Once loaded, works without internet
- ✅ **Installable**: Can be added to home screen
- ✅ **Responsive**: Adapts to any screen size
- ✅ **Fast**: Loads quickly, even on slow connections
- ✅ **Secure**: Uses HTTPS (when deployed)

### Installing to Home Screen

#### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

#### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home screen"

## 🐛 Debugging

### View Debug Logs
1. Go to Settings
2. Tap "About & Debug"
3. Scroll to "Debug Logs" section
4. View chronological log of all app events

### Clear All Data
1. Go to Settings
2. Scroll to "Data Management"
3. Tap "Reset All Data"
4. Confirm the action

### Browser Console
Open browser DevTools (F12) to see:
- Audio player events
- Storage operations
- Error messages

## 🔮 Future Enhancements

### Planned Features (not in MVP)
- 🎥 **Camera Gestures**: Control with hand gestures via webcam
- 📱 **Bluetooth Controls**: Connect to external controllers
- 🎨 **Themes**: Custom color schemes
- 📊 **Visualizer**: Audio spectrum visualization
- 📝 **Lyrics**: Display synchronized lyrics
- 🎯 **Equalizer**: Audio frequency controls
- ☁️ **Cloud Sync**: Backup playlists to cloud
- 🔄 **Import/Export**: Share playlists as files

## 📄 License

MIT License - Feel free to use and modify!

## 🙏 Acknowledgments

Built with modern web technologies to demonstrate Progressive Web App capabilities.

---

**Enjoy your music! 🎵**
