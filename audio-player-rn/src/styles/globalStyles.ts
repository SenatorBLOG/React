// src/styles/globalStyles.ts
import { StyleSheet } from 'react-native';

// Общие цвета и темы (можно расширить)
export const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#2563eb',
    background: '#000',
    surface: '#18181b',
    text: '#fff',
    subtext: '#d1d5db',
    muted: '#6b7280',
    border: '#27272a',
    accent: '#3b82f633',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#eab308',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
};

// ControlButton
export const controlButtonStyles = StyleSheet.create({
  // Нет отдельных стилей в компоненте, но variant и size в коде — используй theme в компоненте
});

//GestureOverlay
export const gestureOverlayStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // pointerEvents: 'box-none' — уже в компоненте
  },
});

// ModeIndicator
export const modeIndicatorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: theme.fontSizes.xs,
    marginLeft: theme.spacing.sm,
  },
});

// ProgressBar
export const progressBarStyles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.xs + 2,
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  timeText: {
    color: '#9ca3af',
    fontSize: theme.fontSizes.xs,
  },
});

// TrackListItem
export const trackListItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    backgroundColor: '#1f2937',
    marginVertical: theme.spacing.xs,
  },
  current: {
    backgroundColor: theme.colors.accent,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  artwork: {
    width: 48,
    height: 48,
    backgroundColor: '#111827',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playIcon: {
    marginRight: theme.spacing.xs + 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    flexShrink: 1,
  },
  artist: {
    color: '#9ca3af',
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs / 2,
  },
  duration: {
    color: '#6b7280',
    fontSize: theme.fontSizes.sm,
    marginLeft: theme.spacing.md,
  },
});

// About
export const aboutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  contentContainer: {
    padding: theme.spacing.xl,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  appIcon: {
    width: 64,
    height: 64,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionTextContainer: {
    marginTop: theme.spacing.sm,
  },
  sectionText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
    marginBottom: theme.spacing.xs,
  },
  list: {
    marginTop: theme.spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  listBullet: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  listText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  gridText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
    backgroundColor: theme.colors.border,
  },
  clearButtonText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
    marginLeft: theme.spacing.xs,
  },
  logContainer: {
    maxHeight: 256,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.xs,
    padding: theme.spacing.sm,
  },
  noLogsText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.muted,
    textAlign: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  logText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.subtext,
    fontFamily: 'monospace',
    marginBottom: theme.spacing.xs,
  },
  storageInfo: {
    marginTop: theme.spacing.sm,
  },
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  storageLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
  },
  storageValue: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
  },
  privacySection: {
    backgroundColor: '#1e40af10',
    borderWidth: 1,
    borderColor: '#1e40af80',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  privacyTitle: {
    fontSize: theme.fontSizes.lg,
    color: '#60a5fa',
    marginBottom: theme.spacing.sm,
  },
  privacyText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
    lineHeight: 20,
  },
});

//FileBrowser
export const fileBrowserStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  uploadSection: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3f3f46',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadIcon: {
    marginBottom: theme.spacing.lg,
  },
  uploadTitle: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  uploadSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.muted,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
  },
  uploadButtonText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  selectedFilesSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  fileList: {
    maxHeight: 256,
    marginBottom: theme.spacing.lg,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  fileInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  fileName: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
  fileSize: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.muted,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.muted,
  },
  addButtonText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  testTracksSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  testTracksContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  testTracksIcon: {
    marginTop: theme.spacing.xs,
    marginRight: theme.spacing.lg,
  },
  testTracksInfo: {
    flex: 1,
  },
  testTracksSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.muted,
    marginBottom: theme.spacing.lg,
  },
  testTracksButton: {
    borderWidth: 1,
    borderColor: '#3f3f46',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: 'center',
  },
  testTracksButtonText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  infoSection: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  infoText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.muted,
    marginBottom: theme.spacing.xs,
  },
});

// GestureTutorial
export const gestureTutorialStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#fff', marginLeft: 8, fontSize: 16 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '600' },

  progressContainer: { paddingHorizontal: 20, marginBottom: 24 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { color: '#9ca3af', fontSize: 14 },
  progressBar: { height: 4, backgroundColor: '#374151', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3b82f6' },

  instructionContainer: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 32 },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionTitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 8 },
  instructionDescription: { color: '#9ca3af', fontSize: 16, textAlign: 'center' },

  practiceArea: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  practiceText: { color: '#9ca3af', marginTop: 16, fontSize: 16 },
  attemptsText: { color: '#6b7280', marginTop: 8, fontSize: 14 },

  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  feedbackContent: { alignItems: 'center' },
  feedbackText: { marginTop: 12, fontSize: 18, fontWeight: '600' },
  successText: { color: '#22c55e' },
  errorText: { color: '#ef4444' },

  actionsContainer: { flexDirection: 'row', padding: 20, gap: 12 },
  skipButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButtonText: { color: '#fff', fontWeight: '600' },
  previousButton: {
    flex: 1,
    backgroundColor: '#374151',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  previousButtonText: { color: '#9ca3af', fontWeight: '600' },
});

// HomePage
export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl,
  },
  gestureOverlay: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  cover: {
    width: 260,
    height: 260,
    borderRadius: theme.spacing.lg,
    backgroundColor: '#0b0b0b',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  artwork: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  trackTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    marginBottom: theme.spacing.xs,
  },
  trackArtist: {
    color: '#9ca3af',
    fontSize: theme.fontSizes.sm,
  },
  progress: {
    width: '90%',
    marginVertical: theme.spacing.md,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 10,
  },
  actionText: {
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  hint: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  hintText: {
    color: '#9ca3af',
    fontSize: theme.fontSizes.xs,
  },
});

//NowPlaying
export const nowPlayingStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: '100%',
  },
  header: {
    width: '100%',
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
  },
  gestureContainer: {
    width: '100%',
    maxWidth: 720,
    alignItems: 'center',
  },

  // Album art
  artworkWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0b0b0b',
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  artwork: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  // Track info
  info: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xxl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  artist: {
    color: theme.colors.subtext,
    fontSize: theme.fontSizes.lg,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  album: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs / 2,
    textAlign: 'center',
  },

  // Progress
  progress: {
    width: '100%',
    marginVertical: theme.spacing.md,
  },

  // Main controls
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.md,
  },
  playButton: {
    marginHorizontal: theme.spacing.lg,
  },

  // Secondary controls
  secondaryControls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  activeControl: {
    // Будет применяться через prop
  },

  // Lyrics
  lyrics: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    width: '100%',
    borderRadius: 12,
    backgroundColor: 'rgba(17,17,17,0.6)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  lyricsText: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
  },

  // Hint
  hint: {
    paddingVertical: theme.spacing.md,
    width: '100%',
  },
  hintText: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.xs,
    textAlign: 'center',
  },
});

// playlistStyles
export const playlistStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    marginLeft: theme.spacing.md,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    marginTop: theme.spacing.md,
  },
  emptySubtitle: {
    color: theme.colors.subtext,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  addButton: {
    marginTop: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
  },
  addButtonText: {
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#0b0b0b',
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  modalBody: {
    color: theme.colors.subtext,
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.lg,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.sm,
    marginLeft: theme.spacing.md,
  },
  cancelBtn: {
    backgroundColor: '#1f2937',
  },
  deleteBtn: {
    backgroundColor: theme.colors.error,
  },
  cancelText: {
    color: theme.colors.text,
  },
  deleteText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
});
// settingsStyles
export const settingsStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    marginLeft: theme.spacing.md,
  },

  container: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },

  section: {
    marginBottom: theme.spacing.xl,
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    marginBottom: theme.spacing.sm,
  },

  modeList: {
    flexDirection: 'column',
  },

  modeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
  },
  modeItemActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(37,99,235,0.06)',
  },
  modeItemInactive: {
    borderColor: theme.colors.border,
    backgroundColor: '#0b0b0b',
  },

  modeText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  modeLabel: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
  modeDesc: {
    color: theme.colors.subtext,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs / 2,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  smallText: {
    color: theme.colors.subtext,
  },

  helperText: {
    color: theme.colors.subtext,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },

  feedbackRow: {
    padding: theme.spacing.sm,
    backgroundColor: '#0b0b0b',
    borderRadius: theme.spacing.sm,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#0b0b0b',
    marginBottom: theme.spacing.sm,
  },
  actionBtnText: {
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    fontSize: theme.fontSizes.md,
  },

  resetBtn: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: 'center',
  },
  resetBtnText: {
    color: theme.colors.text,
    fontWeight: '600',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#0b0b0b',
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  modalBody: {
    color: theme.colors.subtext,
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.lg,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBtn: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  modalCancel: {
    backgroundColor: '#1f2937',
  },
  modalDanger: {
    backgroundColor: theme.colors.error,
  },
  modalCancelText: {
    color: theme.colors.text,
  },
  modalDangerText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
});

// src/styles/globalStyles.ts 
export const splashStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
    opacity: 0.12,
  },
  logoBox: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    marginTop: theme.spacing.sm,
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  progressOuter: {
    height: 8,
    backgroundColor: '#111827',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: theme.spacing.xl,
  },
  progressInner: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  subtitle: {
    marginTop: theme.spacing.md,
    color: theme.colors.subtext,
    fontSize: 13,
  },
});