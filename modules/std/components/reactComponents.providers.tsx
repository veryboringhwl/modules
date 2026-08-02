import { findBy } from "/hooks/util.ts";

import { Platform } from "../api/platform.ts";
import { exportedFunctions, ready } from "../core/webpack.ts";

import type { React } from "../libs/react.ts";

await ready;

export const RemoteConfigProviderComponent = findBy(
  "resolveSuspense",
  "configuration"
)(exportedFunctions);

export const RemoteConfigProvider = ({
  configuration = Platform.getRemoteConfiguration(),
  children
}: {
  configuration?: ReturnType<typeof Platform.getRemoteConfiguration>;
  children?: React.ReactNode;
}) => (
  <RemoteConfigProviderComponent configuration={configuration}>
    {children}
  </RemoteConfigProviderComponent>
);

export const SnackbarProvider: React.FC<any> = findBy(
  "enqueueSnackbar called with invalid argument"
)(exportedFunctions);

export const StoreProvider: React.FC<any> = findBy(
  "notifyNestedSubs",
  "serverState"
)(exportedFunctions);

export const TracklistColumnsContextProvider: React.FC<any> = findBy(
  "columns",
  "visibleColumns",
  "toggleVisible"
)(exportedFunctions);
