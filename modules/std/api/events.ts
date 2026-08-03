import { rxjs } from "../core/deps.ts";
import { Platform } from "./platform.ts";

import type { ModuleInstance } from "/hooks/module.ts";
import type { PlayerState } from "/hooks/PlatformAutoGen.d.ts";

export type SongProgress = {
  readonly positionMs: number;
  readonly isPaused: boolean;
  readonly trackUri: string | null;
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

function interpolateProgress(state: unknown): SongProgress {
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
    if (delta > 0) {
      positionMs = base + delta;
    }
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
      state_updated: new rxjs.BehaviorSubject(playerState),
      status_changed: new rxjs.BehaviorSubject(playerState),
      song_changed: new rxjs.BehaviorSubject(playerState),
      onprogress: new rxjs.BehaviorSubject<SongProgress>(interpolateProgress(playerState))
    },
    History: {
      updated: new rxjs.BehaviorSubject(History.location)
    }
  };
};

let cachedEventBus: EventBus | undefined;

const getEventBus = (): EventBus => (cachedEventBus ??= newEventBus());

export type EventBus = ReturnType<typeof newEventBus>;

function linkSubjects(
  source: unknown,
  target: unknown,
  subscription: InstanceType<typeof rxjs.Subscription>
): void {
  if (source instanceof rxjs.BehaviorSubject) {
    if (target instanceof rxjs.BehaviorSubject) {
      subscription.add(source.subscribe(target));
    }
    return;
  }
  if (
    source !== null &&
    target !== null &&
    typeof source === "object" &&
    typeof target === "object"
  ) {
    const sourceGroup = source as Record<string, unknown>;
    const targetGroup = target as Record<string, unknown>;
    for (const key of Object.keys(sourceGroup)) {
      linkSubjects(sourceGroup[key], targetGroup[key], subscription);
    }
  }
}

export const createEventBus = (mod: ModuleInstance) => {
  const eventBus = newEventBus();
  const subscription = new rxjs.Subscription();
  linkSubjects(getEventBus(), eventBus, subscription);

  mod._jsIndex?.disposableStack.defer(() => {
    subscription.unsubscribe();
  });

  return eventBus;
};

let previousState: PlayerState | null = null;
const playerListener = ({ data: state }: { data: PlayerState }) => {
  const EventBus = getEventBus();
  EventBus.Player.state_updated.next(state);
  if (state?.item?.uri !== previousState?.item?.uri) {
    EventBus.Player.song_changed.next(state);
  }
  if (
    state?.isPaused !== previousState?.isPaused ||
    state?.isBuffering !== previousState?.isBuffering
  ) {
    EventBus.Player.status_changed.next(state);
  }
  EventBus.Player.onprogress.next(interpolateProgress(state));
  previousState = state;
};

const historyListener = (location: HistoryLocation) => getEventBus().History.updated.next(location);

export function startEventHandlers() {
  const playerEvents = Platform.getPlayerAPI().getEvents() as unknown as {
    addListener(event: "update", listener: (event: { data: PlayerState }) => void): () => void;
  };
  const cancelPlayerListener = playerEvents.addListener("update", playerListener);
  const cancelHistoryListener = Platform.getHistory().listen(
    historyListener
  ) as unknown as () => void;

  return () => {
    cancelPlayerListener();
    cancelHistoryListener();
  };
}
