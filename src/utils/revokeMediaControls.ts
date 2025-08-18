// mediaSession.ts
type MediaSessionPlaybackState = "none" | "paused" | "playing";
type MediaSessionAction =
  | "play"
  | "pause"
  | "seekbackward"
  | "seekforward"
  | "previoustrack"
  | "nexttrack"
  | (string & {});

interface MediaSession {
  metadata: MediaMetadata | null;
  playbackState: MediaSessionPlaybackState;
  setActionHandler(
    action: MediaSessionAction,
    handler: (() => void) | null
  ): void;
}

interface MediaMetadata {} // runtime provided by browser

/** Call this after you start/stop audio to suppress Android media controls. */
export function suppressMediaSession(): void {
  if (typeof navigator === "undefined") return;
  const ms = (navigator as Navigator & { mediaSession?: MediaSession })
    .mediaSession;
  if (!ms) return;

  ms.metadata = null;
  ms.playbackState = "none";

  (
    [
      "play",
      "pause",
      "seekbackward",
      "seekforward",
      "previoustrack",
      "nexttrack",
    ] as MediaSessionAction[]
  ).forEach((action) => {
    try {
      ms.setActionHandler(action, null);
    } catch {}
  });
}

/** Helper: wrap any fn so it auto-suppresses first. */
export function withSuppressedMediaSession<T extends (...a: any[]) => any>(
  fn: T
): T {
  return ((...args: Parameters<T>) => {
    suppressMediaSession();
    return fn(...args);
  }) as T;
}
