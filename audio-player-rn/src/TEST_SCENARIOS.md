# Test Scenarios & Acceptance Criteria

## Test Environment Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Audio output device
- Test audio files OR use built-in test tracks

### Test Data
- **Built-in**: 3 generated test tracks (sine waves)
- **External**: Sample MP3/WAV files from device

---

## TC1: Initial Launch & Splash Screen

### Steps
1. Open the application for the first time
2. Observe splash screen

### Expected Results
- ✅ Splash screen appears immediately
- ✅ App logo/icon is visible
- ✅ Loading progress bar animates from 0% to 100%
- ✅ "Loading your music..." message appears
- ✅ After ~1 second, transitions to Home screen
- ✅ No console errors

### Acceptance Criteria
- Splash duration: ~1 second
- Smooth transition to Home
- Loading state visible throughout

---

## TC2: Add Test Tracks

### Steps
1. From Home screen, click "Playlist" button
2. Click "+" button in top-right
3. Click "Add Test Tracks" button
4. Navigate back to Playlist screen

### Expected Results
- ✅ File Browser screen opens
- ✅ "Add Test Tracks" option is visible
- ✅ After clicking, immediately navigates to Playlist
- ✅ 3 test tracks appear in the playlist
- ✅ Each track shows title, artist, and duration
- ✅ Track counter shows "3 tracks"

### Acceptance Criteria
- Tracks added: Exactly 3
- Track details populated: Title, artist, duration
- No loading delay

---

## TC3: Play/Pause Controls

### Steps
1. Ensure at least 1 track in playlist
2. Tap first track in playlist
3. Observe playback starts
4. Wait 2 seconds
5. Tap pause button
6. Wait 1 second
7. Tap play button

### Expected Results
- ✅ Track loads and plays immediately
- ✅ Progress bar begins moving
- ✅ Current time increases
- ✅ Play button changes to Pause button
- ✅ Track is highlighted in playlist
- ✅ On pause: playback stops, position maintained
- ✅ On resume: playback continues from same position

### Acceptance Criteria
- Audio output audible
- UI state matches playback state
- Position preserved on pause/resume

---

## TC4: Next/Previous Track Navigation

### Steps
1. Load 3 test tracks
2. Play first track
3. Click "Next" button
4. Wait 1 second
5. Click "Previous" button

### Expected Results
- ✅ Next: Second track starts playing
- ✅ Progress bar resets to 0
- ✅ Track title updates in UI
- ✅ Previous: First track starts playing
- ✅ Playback continues without gaps

### Acceptance Criteria
- Smooth track transitions
- No audio glitches
- Current track indicator updates

---

## TC5: Seek Control (Progress Bar)

### Steps
1. Play any track
2. Wait until progress bar is ~25% complete
3. Click/drag progress bar to 50% position
4. Observe playback

### Expected Results
- ✅ Playback jumps to new position immediately
- ✅ Audio output matches new position
- ✅ Progress bar handle moves to clicked position
- ✅ Time display updates
- ✅ Playback continues from new position

### Acceptance Criteria
- Click-to-seek: Works anywhere on bar
- Drag-to-seek: Follows cursor/finger
- Audio sync: Position matches visual

---

## TC6: Swipe Gestures (Left/Right)

### Steps
1. Go to Settings
2. Select control mode: "Gestures" or "Both"
3. Return to Home screen
4. Perform swipe left gesture on screen
5. Wait 1 second
6. Perform swipe right gesture

### Expected Results
- ✅ Swipe left: Next track plays
- ✅ If visual feedback enabled: Toast shows "Next track"
- ✅ Swipe right: Previous track plays
- ✅ If visual feedback enabled: Toast shows "Previous track"
- ✅ Hint text appears: "Swipe left/right to change tracks"

### Acceptance Criteria
- Gestures recognized reliably
- Visual feedback appears (if enabled)
- Same behavior as button controls

---

## TC7: Double-Tap Gesture

### Steps
1. Ensure gestures enabled
2. Play a track
3. Quickly tap screen twice (< 300ms apart)
4. Wait 1 second
5. Double-tap again

### Expected Results
- ✅ First double-tap: Playback pauses
- ✅ Second double-tap: Playback resumes
- ✅ If visual feedback enabled: Toast shows "Play/Pause"
- ✅ Same behavior as play/pause button

### Acceptance Criteria
- Timing window: ~300ms for double-tap
- Single taps don't trigger accidentally
- Consistent behavior

---

## TC8: Gesture Sensitivity Adjustment

### Steps
1. Go to Settings
2. Set sensitivity to 0 (minimum)
3. Return to Home, try swipe left (use large motion)
4. Go to Settings
5. Set sensitivity to 100 (maximum)
6. Return to Home, try swipe left (use small motion)

### Expected Results
- ✅ Low sensitivity: Requires larger swipe motion
- ✅ High sensitivity: Accepts smaller swipe motion
- ✅ Settings persist after navigation
- ✅ Slider shows current value

### Acceptance Criteria
- Sensitivity range: 0-100
- Noticeable difference between min/max
- Setting saved immediately

---

## TC9: Control Mode Switching

### Steps
1. Go to Settings
2. Select "Touch Only"
3. Return to Home, try swipe gesture
4. Go to Settings
5. Select "Gestures Only"
6. Return to Home, try play button
7. Select "Both"
8. Try both gestures and buttons

### Expected Results
- ✅ Touch Only: Buttons work, gestures disabled
- ✅ Gestures Only: Gestures work, buttons still visible
- ✅ Both: Everything works
- ✅ Disabled: Nothing responds (lock mode)
- ✅ Selected mode is highlighted in Settings

### Acceptance Criteria
- Mode changes take effect immediately
- Visual indicator shows current mode
- No unexpected behavior

---

## TC10: Now Playing (Detailed View)

### Steps
1. Play any track
2. Tap album cover on Home screen
3. Observe detailed view
4. Tap shuffle button
5. Tap repeat button twice
6. Drag progress bar
7. Tap back button

### Expected Results
- ✅ Large album artwork displayed
- ✅ Full track info shown (title, artist, album)
- ✅ All controls functional
- ✅ Shuffle button turns blue when active
- ✅ Repeat cycles: Off → All → One → Off
- ✅ Progress bar works same as Home
- ✅ Back button returns to Home

### Acceptance Criteria
- All features from Home screen available
- Additional controls (shuffle, repeat) work
- Seamless navigation

---

## TC11: Shuffle Mode

### Steps
1. Load at least 5 tracks
2. Enable shuffle
3. Play through 5 tracks using Next button
4. Observe track order

### Expected Results
- ✅ Tracks play in random order
- ✅ Same track may repeat (random is truly random)
- ✅ Shuffle indicator is blue/highlighted
- ✅ Disable shuffle: Returns to sequential

### Acceptance Criteria
- Not perfectly sequential
- Random selection per next track
- Toggle works correctly

---

## TC12: Repeat Modes

### Steps
1. Load track with 5s duration
2. Set repeat to "One"
3. Let track finish
4. Set repeat to "All" (with multiple tracks)
5. Let playlist finish
6. Set repeat to "Off"
7. Let last track finish

### Expected Results
- ✅ Repeat One: Same track restarts
- ✅ Repeat All: Playlist loops back to first track
- ✅ Repeat Off: Playback stops at end
- ✅ Repeat indicator shows current mode

### Acceptance Criteria
- Each mode behaves correctly
- Auto-transition works
- No manual intervention needed

---

## TC13: Playlist Management (Add Files)

### Steps
1. Go to Playlist
2. Click "+" button
3. Click "Select Files"
4. Choose 2-3 audio files from device
5. Click "Add to Playlist"

### Expected Results
- ✅ File picker opens
- ✅ Only audio files selectable (or all files with filter)
- ✅ Selected files show in list with checkmarks
- ✅ File size displayed for each
- ✅ After adding: Navigate to Playlist
- ✅ New tracks appear at end of playlist
- ✅ Track metadata extracted (title from filename)

### Acceptance Criteria
- Audio files only (MIME type check)
- Supports: MP3, WAV, OGG, M4A
- Metadata extraction works

---

## TC14: Track Deletion

### Steps
1. Add 3 tracks to playlist
2. Long-press (hold) on second track
3. Confirm deletion
4. Observe playlist

### Expected Results
- ✅ Long-press (500ms) triggers delete dialog
- ✅ Dialog shows track name
- ✅ "Cancel" closes dialog without deleting
- ✅ "Delete" removes track from playlist
- ✅ Track counter updates
- ✅ If deleted track was playing: Stops playback

### Acceptance Criteria
- Long-press duration: ~500ms
- Confirmation required
- Playlist updates immediately

---

## TC15: State Persistence (Reload Test)

### Steps
1. Add 3 tracks
2. Play second track
3. Seek to 50% position
4. Close browser tab completely
5. Reopen application
6. Observe state

### Expected Results
- ✅ Splash screen appears briefly
- ✅ Same 3 tracks in playlist
- ✅ Second track is selected as current
- ✅ Playback does NOT auto-start
- ✅ Position is NOT restored (expected - blob URLs don't persist)
- ✅ Play button resumes from beginning

### Acceptance Criteria
- Playlist persisted
- Settings persisted
- Current track ID persisted
- User must manually resume playback

---

## TC16: Settings Persistence

### Steps
1. Go to Settings
2. Change control mode to "Gestures Only"
3. Set sensitivity to 75
4. Disable visual feedback
5. Close browser
6. Reopen application
7. Go to Settings

### Expected Results
- ✅ Control mode: Still "Gestures Only"
- ✅ Sensitivity: Still 75
- ✅ Visual feedback: Still disabled
- ✅ All settings preserved

### Acceptance Criteria
- All settings persist across sessions
- No reset to defaults

---

## TC17: Gesture Tutorial

### Steps
1. Go to Settings → Gesture Tutorial
2. Read first instruction (Swipe Left)
3. Perform swipe left on practice area
4. Observe feedback
5. Complete all 5 gestures

### Expected Results
- ✅ Tutorial shows step 1 of 5
- ✅ Progress bar at 20%
- ✅ Clear instruction with icon
- ✅ On correct gesture: Green checkmark + "Perfect!"
- ✅ On wrong gesture: Red X + "Try Again"
- ✅ After success: Auto-advance to next step
- ✅ Final step: "Finish Tutorial" button

### Acceptance Criteria
- All 5 gesture types covered
- Feedback immediate and clear
- Can skip steps
- Can go back

---

## TC18: Visual Feedback Toggle

### Steps
1. Enable visual feedback in Settings
2. Enable gestures
3. Return to Home
4. Perform swipe left gesture
5. Go to Settings
6. Disable visual feedback
7. Return to Home
8. Perform swipe left gesture

### Expected Results
- ✅ With feedback ON: Toast appears with "Next track"
- ✅ Gesture still works (track changes)
- ✅ With feedback OFF: No toast appears
- ✅ Gesture still works (track changes)

### Acceptance Criteria
- Visual feedback optional
- Functionality unaffected by setting

---

## TC19: About & Debug Screen

### Steps
1. Play a track
2. Add tracks
3. Go to Settings → About & Debug
4. Observe information
5. Scroll to Debug Logs
6. Click "Clear" button

### Expected Results
- ✅ App name and version displayed
- ✅ Build date shown
- ✅ Technologies list populated
- ✅ Features list visible
- ✅ Debug logs show recent actions
- ✅ Timestamps on all log entries
- ✅ Clear button empties logs
- ✅ Storage status shows "Stored" for active data

### Acceptance Criteria
- All information accurate
- Logs chronological
- Clear function works

---

## TC20: Reset All Data

### Steps
1. Add tracks and configure settings
2. Go to Settings
3. Scroll to "Reset All Data"
4. Click button
5. Confirm in dialog
6. Observe result

### Expected Results
- ✅ Confirmation dialog appears
- ✅ Warning message clear
- ✅ Cancel: No changes
- ✅ Confirm: All data cleared
- ✅ Returns to Home screen
- ✅ Playlist empty
- ✅ Settings reset to defaults
- ✅ No current track

### Acceptance Criteria
- Requires confirmation
- Complete data wipe
- Fresh start equivalent

---

## TC21: Mobile Responsive Layout

### Steps
1. Open app on mobile device (or resize browser to < 768px)
2. Navigate through all screens
3. Observe layouts

### Expected Results
- ✅ All content fits viewport
- ✅ No horizontal scrolling
- ✅ Touch targets large enough (min 44x44px)
- ✅ Text readable without zoom
- ✅ Buttons easy to tap
- ✅ Album art scales appropriately

### Acceptance Criteria
- Mobile-first design
- Touch-friendly UI
- Responsive on all screen sizes

---

## TC22: Error Handling (Invalid File)

### Steps
1. Go to File Browser
2. Attempt to select non-audio file (if browser allows)
3. Observe behavior

### Expected Results
- ✅ File picker filters for audio/* MIME type
- ✅ If non-audio gets through: Rejected silently
- ✅ No crashes or errors
- ✅ User informed if needed

### Acceptance Criteria
- Graceful handling
- Clear error messages
- App remains stable

---

## TC23: Long Playlist Performance

### Steps
1. Add 50+ tracks (if possible)
2. Scroll through playlist
3. Play various tracks
4. Observe performance

### Expected Results
- ✅ Smooth scrolling
- ✅ No lag when selecting tracks
- ✅ Search/filter works (if implemented)
- ✅ No memory leaks

### Acceptance Criteria
- Acceptable performance up to 100 tracks
- No browser crashes

---

## TC24: Multiple Browser Tabs

### Steps
1. Open app in one tab
2. Add track and play
3. Open app in second tab
4. Play different track in second tab
5. Return to first tab

### Expected Results
- ✅ Each tab operates independently
- ✅ Both can play simultaneously (browser permitting)
- ✅ State changes in one don't affect other
- ✅ Last tab to close saves state

### Acceptance Criteria
- Independent instances
- No conflicts
- Final state persists

---

## TC25: Audio Format Support

### Steps
1. Prepare test files: MP3, WAV, OGG, M4A, FLAC
2. Add each to playlist
3. Attempt to play each

### Expected Results
- ✅ MP3: Plays (universal support)
- ✅ WAV: Plays (universal support)
- ✅ OGG: Plays (most browsers)
- ✅ M4A: Plays (most browsers)
- ✅ FLAC: May not play (limited support)
- ✅ Unsupported format: Error logged, skip to next

### Acceptance Criteria
- Common formats supported
- Graceful handling of unsupported
- No crashes on decode errors

---

## Acceptance Criteria Summary

### Must Pass (Critical)
- ✅ TC1: Initial Launch
- ✅ TC2: Add Test Tracks
- ✅ TC3: Play/Pause Controls
- ✅ TC4: Next/Previous
- ✅ TC5: Seek Control
- ✅ TC15: State Persistence

### Should Pass (Important)
- ✅ TC6-8: Gesture Controls
- ✅ TC9: Control Modes
- ✅ TC10: Detailed View
- ✅ TC13-14: Playlist Management
- ✅ TC16: Settings Persistence

### Nice to Have (Enhancement)
- ✅ TC17: Tutorial
- ✅ TC19: Debug Info
- ✅ TC21: Responsive Design
- ✅ TC23: Performance

---

## Test Completion Checklist

- [ ] All TC1-TC10 pass (core functionality)
- [ ] At least 80% of all tests pass
- [ ] No critical bugs in core features
- [ ] No console errors in normal flow
- [ ] App loads in < 3 seconds
- [ ] Audio playback works in all major browsers
- [ ] Mobile experience is smooth
- [ ] Data persistence works reliably
- [ ] Documentation complete and accurate

---

**Testing Notes:**
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on both desktop and mobile
- Test with various audio file types
- Test with slow network (throttling)
- Test with browser console open for errors
- Document any failures with screenshots

**Sign-off:**
- Tester: ________________
- Date: ________________
- Platform: ________________
- Browser: ________________
- Result: PASS / FAIL
