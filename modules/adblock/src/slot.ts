import { ReduxStore } from "/modules/stdlib/src/expose/ReduxStore.ts";

import { logger, settingsClient, slotsClient, testingClient } from "../load.ts";
import { retryCounter } from "./utils/counter.ts";

const overrideSlot = async ({ slotId }: { slotId: string }) => {
  try {
    if (slotsClient) {
      await slotsClient.clearAllAds({ slotId });
    }
    if (settingsClient) {
      // this one seems most important?
      await settingsClient.updateAdServerEndpoint({
        slotIds: [slotId],
        url: "http://localhost/no/thanks"
      });
      await settingsClient.updateSlotEnabled({ slotId, enabled: false });
      await settingsClient.updateStreamTimeInterval({ slotId, timeInterval: 0n });
      await settingsClient.updateDisplayTimeInterval({ slotId, timeInterval: 0n });
      await settingsClient.updateExpiryTimeInterval({ slotId, timeInterval: 0n });
    }
  } catch (error: unknown) {
    logger.error("Failed inside `overrideSlot` function. Retrying in 1 second...\n", error);
    retryCounter(slotId, "increment");
    if (retryCounter(slotId, "get") > 5) {
      logger.error(
        `Failed inside \`overrideSlot\` function for 5th time. Giving up...\nSlot id: ${slotId}.`
      );
      retryCounter(slotId, "clear");
      return;
    }
    setTimeout(overrideSlot, 1000, { slotId });
  }
};

export const slotSubscriptions: Array<{ cancel: () => void }> = [];
export const bindSlots = async (adSlots: { slotId: string }[]) => {
  for (const { slotId } of adSlots) {
    if (!slotsClient) return;
    await overrideSlot({ slotId });
    slotSubscriptions.push(
      slotsClient.subSlot({ slotId }, ({ adSlotEvent }) => overrideSlot(adSlotEvent))
    );
  }
};

export let reduxStoreSubscription: () => void;
export const pauseAds = async () => {
  ReduxStore.dispatch({ type: "ADS_DISABLED" });
  ReduxStore.dispatch({ type: "ADS_PREMIUM", isPremium: true });
  ReduxStore.dispatch({ type: "ADS_HPTO_HIDDEN", isHptoHidden: true });
  ReduxStore.dispatch({ type: "ADS_POST_HIDE_HPTO", reason: "" });

  reduxStoreSubscription = ReduxStore.subscribe(() => {
    // disables: audio, billboard, inStreamApi, leaderboard, sponsoredPlaylist, and vto
    if (ReduxStore.getState().ads.root.adsEnabled === true) {
      ReduxStore.dispatch({ type: "ADS_DISABLED" });
    }
    if (ReduxStore.getState().ads.root.isHptoHidden === false) {
      ReduxStore.dispatch({ type: "ADS_HPTO_HIDDEN", isHptoHidden: true });
    }
    if (ReduxStore.getState().ads.root.isPremium === false) {
      ReduxStore.dispatch({ type: "ADS_PREMIUM", isPremium: true });
    }
  });

  if (testingClient) {
    await testingClient.addPlaytime({ seconds: -100000000000 });
  }
};
