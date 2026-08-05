import { BehaviorSubject, Subscription } from "../deps.ts";
import { UpdateTitlebarSubject } from "./events.mix.ts";
import { Platform } from "./expose/Platform.ts";

import type { ModuleInstance } from "/hooks/module.ts";

export type SongProgress = {
  readonly positionMs: number;
  readonly isPaused: boolean;
  readonly trackUri: string | null;
};

type PlayerState = {
  item?: { uri?: string } | null;
  duration?: number;
  positionAsOfTimestamp?: number;
  timestamp?: number;
  isPaused?: boolean;
  isBuffering?: boolean;
};

type HistoryLocation = {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: {
    navigationalRoot: string;
  };
};

const PROGRESS_TICK_MS = 100;

function interpolateProgress(state: PlayerState | undefined | unknown): SongProgress {
  if (!state || typeof state !== "object") {
    return { positionMs: 0, isPaused: true, trackUri: null };
  }
  const s = state as PlayerState;
  const base = s.positionAsOfTimestamp ?? 0;
  const isPaused = s.isPaused === true;
  const capturedAt = s.timestamp;
  let positionMs = base;
  if (!isPaused && capturedAt !== undefined) {
    const delta = Date.now() - capturedAt;
    if (delta > 0) positionMs = base + delta;
  }
  return {
    positionMs,
    isPaused,
    trackUri: s.item?.uri ?? null
  };
}

const newEventBus = () => {
  const PlayerAPI = Platform.getPlayerAPI();
  const History = Platform.getHistory();

  const playerState = PlayerAPI.getState();
  return {
    Player: {
      state_updated: new BehaviorSubject(playerState),
      status_changed: new BehaviorSubject(playerState),
      song_changed: new BehaviorSubject(playerState),
      onprogress: new BehaviorSubject<SongProgress>(interpolateProgress(playerState))
    },
    History: {
      updated: new BehaviorSubject(History.location)
    },
    ControlMessage: {
      titlebar_updated: new BehaviorSubject<number>(-1)
    }
  };
};

const EventBus = newEventBus();
export type EventBus = typeof EventBus;

export const createEventBus = (mod: ModuleInstance) => {
  const eventBus = newEventBus();

  // TODO: come up with a nicer solution
  const s = new Subscription();
  s.add(EventBus.Player.song_changed.subscribe(eventBus.Player.song_changed));
  s.add(EventBus.Player.state_updated.subscribe(eventBus.Player.state_updated));
  s.add(EventBus.Player.status_changed.subscribe(eventBus.Player.status_changed));
  s.add(EventBus.Player.onprogress.subscribe(eventBus.Player.onprogress));
  s.add(EventBus.History.updated.subscribe(eventBus.History.updated));
  s.add(
    EventBus.ControlMessage.titlebar_updated.subscribe(eventBus.ControlMessage.titlebar_updated)
  );

  mod._jsIndex?.disposableStack.defer(() => {
    s.unsubscribe();
  });

  return eventBus;
};

let cachedState: PlayerState = {};
const playerListener = ({ data: state }: { data: PlayerState }) => {
  EventBus.Player.state_updated.next(state);
  if (state?.item?.uri !== cachedState?.item?.uri) EventBus.Player.song_changed.next(state);
  if (
    state?.isPaused !== cachedState?.isPaused ||
    state?.isBuffering !== cachedState?.isBuffering
  ) {
    EventBus.Player.status_changed.next(state);
  }
  cachedState = state;
};

const historyListener = (location: HistoryLocation) => EventBus.History.updated.next(location);

const updateTitlebarListener = (height: number) =>
  EventBus.ControlMessage.titlebar_updated.next(height);

let progressTimer: ReturnType<typeof setInterval> | null = null;
function startProgressEmitter() {
  if (progressTimer !== null) return;
  progressTimer = setInterval(() => {
    EventBus.Player.onprogress.next(interpolateProgress(Platform.getPlayerAPI().getState()));
  }, PROGRESS_TICK_MS);
}

export function startEventHandlers() {
  const cancelPlayerListener = Platform.getPlayerAPI()
    .getEvents()
    .addListener("update", playerListener);
  const cancelHistoryListener = Platform.getHistory().listen(historyListener);
  const updateTitlebarListenerSubscription =
    UpdateTitlebarSubject.subscribe(updateTitlebarListener);
  startProgressEmitter();

  return () => {
    cancelPlayerListener();
    cancelHistoryListener();
    updateTitlebarListenerSubscription.unsubscribe();
    if (progressTimer !== null) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  };
}
