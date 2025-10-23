# Technical Specification

## Architecture Overview

This is a client-side Progressive Web App built with React and TypeScript. All functionality runs in the browser with no backend required.

## Core Technologies

- **React 18**: Component framework
- **TypeScript**: Type safety
- **Tailwind CSS 4.0**: Utility-first styling
- **HTML5 Audio API**: Audio playback engine
- **LocalStorage API**: Data persistence
- **Touch Events API**: Gesture recognition

## Project Structure

```
/
├── App.tsx                      # Main app with routing logic
├── types/index.ts               # TypeScript type definitions
├── services/
│   ├── audio-player.ts         # Audio playback service
│   └── storage.ts              # LocalStorage wrapper
├── hooks/
│   └── useGestures.ts          # Gesture detection hook
├── screens/                    # Page-level components
│   ├── Splash.tsx              # Loading screen
│   ├── Home.tsx                # Main player
│   ├── Playlist.tsx            # Track list
│   ├── NowPlaying.tsx          # Full-screen player
│   ├── FileBrowser.tsx         # File import
│   ├── Settings.tsx            # Configuration
│   ├── GestureTutorial.tsx     # Interactive tutorial
│   └── About.tsx               # Info & debug
├── components/                 # Reusable components
│   ├── ProgressBar.tsx         # Seekable progress bar
│   ├── ControlButton.tsx       # Icon button wrapper
│   ├── TrackListItem.tsx       # Playlist item
│   ├── ModeIndicator.tsx       # Control mode badge
│   └── GestureOverlay.tsx      # Gesture detection layer
└── utils/
    └── test-tracks.ts          # Generate test audio
```

## Data Models

### Track
```typescript
interface Track {
  id: string;           // Unique identifier
  title: string;        // Track name
  artist?: string;      // Artist name
  album?: string;       // Album name
  duration?: number;    // Length in seconds
  uri: string;          // Blob URL or data URL
  artworkUri?: string;  // Cover image URL
}
```

### Playlist
```typescript
interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: string;
}
```

### AppSettings
```typescript
interface AppSettings {
  controlMode: 'touch' | 'gestures' | 'both' | 'disabled';
  gestureSensitivity: number; // 0-100
  visualFeedback: boolean;
}
```

### AppState
```typescript
interface AppState {
  currentTrackId: string | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  playlistId: string | null;
  volume: number;
}
```

## Services

### AudioPlayerService

Wrapper around HTML5 Audio API providing:
- Track loading with promise-based API
- Playback control (play, pause, seek)
- Volume control
- Status updates via callback
- Error handling

**Key Methods:**
```typescript
loadTrack(track: Track): Promise<void>
play(): Promise<void>
pause(): void
seek(position: number): Promise<void>
setVolume(volume: number): Promise<void>
getStatus(): PlayerStatus
onStatusUpdate(callback: StatusCallback): () => void
```

### StorageService

LocalStorage wrapper with async API for consistency:

**Key Methods:**
```typescript
getPlaylists(): Promise<Playlist[]>
savePlaylists(playlists: Playlist[]): Promise<void>
getSettings(): Promise<AppSettings>
saveSettings(settings: AppSettings): Promise<void>
getCurrentState(): Promise<AppState | null>
saveCurrentState(state: AppState): Promise<void>
clearAll(): Promise<void>
getLogs(): string[]
addLog(message: string): void
```

**Storage Keys:**
- `@APP:playlists` - Array of playlists
- `@APP:settings` - User settings
- `@APP:current` - Current playback state
- `@APP:logs` - Debug logs (max 100 entries)

## Hooks

### useGestures

Custom hook for gesture detection using Touch Events API.

**Configuration:**
```typescript
interface GestureConfig {
  enabled: boolean;
  sensitivity: number; // 0-100
  onGesture?: (gesture: GestureEvent) => void;
}
```

**Detected Gestures:**
- `swipe-left` / `swipe-right` - Horizontal swipes
- `swipe-up` / `swipe-down` - Vertical swipes
- `tap` - Single tap
- `double-tap` - Two quick taps
- `long-press` - Hold for 500ms

**Algorithm:**
1. `touchstart`: Record position and time
2. `touchmove`: Cancel long-press if moved
3. `touchend`: Calculate delta and classify gesture
   - If delta > threshold: Swipe (direction based on larger axis)
   - Else: Tap (single vs double based on timing)

**Sensitivity Mapping:**
```
threshold = 50 - (sensitivity * 0.3)
```
Higher sensitivity = lower threshold = easier to trigger

## Routing

Simple state-based routing (no external router):

```typescript
type Screen = 
  | 'splash'
  | 'home'
  | 'playlist'
  | 'now-playing'
  | 'file-browser'
  | 'settings'
  | 'gesture-tutorial'
  | 'about';
```

Navigation via `setCurrentScreen(screen)` function passed to components.

## State Management

### App-Level State (in App.tsx)

```typescript
// Core player state
currentTrack: Track | null
isPlaying: boolean
position: number
duration: number

// Playlist state
tracks: Track[]

// Settings state
settings: AppSettings

// Playback options
shuffle: boolean
repeat: 'off' | 'one' | 'all'
```

### State Persistence

Auto-saved to localStorage on changes using `useEffect`:
- Playlists: When `tracks` changes
- Settings: When `settings` changes
- Current state: When playback state changes

### State Restoration

On app load:
1. Load settings from storage
2. Load playlists from storage
3. Load last playback state
4. Restore current track (but don't auto-play)

## Audio Playback Flow

### Loading a Track
```
1. User selects track
2. loadAndPlayTrack(track) called
3. AudioPlayerService.loadTrack()
   - Creates new Audio element
   - Sets src to track.uri
   - Waits for 'loadeddata' event
4. AudioPlayerService.play()
5. Update UI state via status callback
```

### Status Updates
```
1. Audio events (timeupdate, play, pause, etc.)
2. AudioPlayerService emits status update
3. App.tsx receives update via callback
4. State updated (isPlaying, position, duration)
5. React re-renders affected components
```

### Auto-Next Track
```
1. useEffect watches position >= duration
2. Check repeat mode:
   - 'one': Seek to 0, play again
   - 'all': Play next track
   - 'off': Pause if last track
3. If shuffle: Random track
4. Else: Sequential track
```

## File Import

### Web File API
```
1. User clicks "Select Files"
2. <input type="file" accept="audio/*">
3. File list received
4. For each file:
   - Create blob URL: URL.createObjectURL(file)
   - Load in Audio element to get duration
   - Create Track object with blob URL
5. Add tracks to playlist
```

### Blob URL Management
- Created: When file is imported
- Used: As Track.uri for playback
- Lifetime: Until page reload
- Note: Not persisted in localStorage (only metadata)

### Test Tracks
Generated using Web Audio API:
```
1. Create AudioContext
2. Create AudioBuffer with sine wave data
3. Encode as WAV (manual PCM encoding)
4. Create Blob
5. Generate blob URL
```

## Gesture Detection Algorithm

### Touch Event Flow
```
touchstart:
  - Record: x, y, timestamp
  - Start long-press timer (500ms)

touchmove:
  - Cancel long-press timer
  
touchend:
  - Calculate: deltaX, deltaY
  - If |delta| > threshold:
      - Horizontal swipe: abs(deltaX) > abs(deltaY)
      - Vertical swipe: abs(deltaY) > abs(deltaX)
  - Else:
      - Increment tap counter
      - Wait 300ms for double-tap
      - Emit tap or double-tap
```

### Sensitivity Calculation
```typescript
const SWIPE_THRESHOLD = 50 - (sensitivity * 0.3);
// sensitivity = 0   → threshold = 50px (hard)
// sensitivity = 50  → threshold = 35px (normal)
// sensitivity = 100 → threshold = 20px (easy)
```

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Screens only mount when navigated to
2. **Debouncing**: Progress bar updates throttled to 100ms
3. **Blob URLs**: Efficient in-memory file handling
4. **Event Cleanup**: All listeners properly removed
5. **Minimal Re-renders**: useCallback for stable function refs

### Memory Management
- Blob URLs kept in memory during session
- Audio element reused (single instance)
- Old blob URLs not explicitly revoked (browser handles on navigation)

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS requires user interaction for play)
- Mobile: Optimized for touch events

## Testing Strategy

### Unit Testing Targets
1. **AudioPlayerService**: Mock Audio element
2. **StorageService**: Mock localStorage
3. **useGestures**: Mock touch events
4. **Test track generation**: Validate WAV encoding

### Integration Testing
1. Full user flows (add track → play → seek)
2. Persistence (save → reload → verify)
3. Gesture detection (simulate touches)

### Manual Testing Checklist
See README.md "Test Cases" section

## Debug Tools

### Built-in Logging
```typescript
StorageService.addLog(message)
```
- Timestamps all logs
- Max 100 entries (FIFO)
- Viewable in About screen

### Console Logging
- Audio player events
- Storage operations
- Errors with stack traces

### Storage Inspection
About screen shows:
- What data is stored
- Log viewer
- Clear data button

## Future Extension Points

### Camera Gestures (Planned)
- Add MediaPipe or TensorFlow.js
- Detect hand gestures from webcam
- Map to same GestureEvent types
- Toggle in settings

### Bluetooth (Planned)
- Use Web Bluetooth API
- Connect to game controllers
- Map buttons to controls
- Persistence for paired devices

### Themes
- Add theme context
- CSS custom properties
- User-selectable palettes

### Visualizer
- Use Web Audio API AnalyserNode
- Canvas-based spectrum display
- Animation loop during playback

## Deployment

### Build Process
Standard React build:
```bash
npm run build
```

### PWA Manifest
Create `manifest.json`:
```json
{
  "name": "Audio Player",
  "short_name": "Player",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [...]
}
```

### Service Worker
For offline support:
```javascript
// Cache assets
// Cache API responses
// Serve from cache when offline
```

### Hosting
Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

## Security Considerations

### Data Privacy
- ✅ No external API calls
- ✅ No data sent to servers
- ✅ Files stay in browser
- ✅ No analytics/tracking

### XSS Prevention
- ✅ React escapes strings automatically
- ✅ No dangerouslySetInnerHTML
- ✅ No eval() or Function()

### File Safety
- ✅ Audio files only (MIME type check)
- ✅ Blob URLs scoped to origin
- ✅ No arbitrary code execution

## Accessibility

### Keyboard Support
- Future enhancement
- Tab navigation
- Space = Play/Pause
- Arrow keys = Seek

### Screen Readers
- All buttons have aria-label
- Meaningful alt text
- Semantic HTML structure

### Color Contrast
- WCAG AA compliant
- High contrast mode support
- No color-only information

## Known Limitations

1. **File Persistence**: Blob URLs don't survive page reload
   - Workaround: Re-import files after reload
   - Future: Use IndexedDB for binary storage

2. **iOS Auto-play**: Safari blocks programmatic play()
   - Workaround: User must interact first
   - Status: Standard browser behavior

3. **Large Files**: Memory limited by browser
   - Recommendation: Keep files < 50MB
   - Future: Streaming playback

4. **Playlist Size**: LocalStorage has 5-10MB limit
   - Affects: Number of tracks with metadata
   - Future: Use IndexedDB

## Contributing Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Functional components
- Hooks over classes

### Component Patterns
```typescript
// Props interface
interface ComponentProps {
  // ... props
}

// Component
export function Component({ prop1, prop2 }: ComponentProps) {
  // ... implementation
}
```

### File Organization
- One component per file
- Co-locate related files
- Barrel exports for directories

### Naming Conventions
- Components: PascalCase
- Hooks: use* prefix
- Services: PascalCase classes
- Utils: camelCase functions

---

**Last Updated**: October 2025
**Version**: 1.0.0
