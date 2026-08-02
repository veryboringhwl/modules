import { future } from "../core/mod.ts";
import { transformer } from "../core/transformer.ts";

import type { React } from "../libs/react.ts";

export type SettingsSectionProps = {
  filterMatchQuery?: string;
  children?: React.ReactNode;
};
export type SettingsSection = React.FC<SettingsSectionProps>;
export let SettingsSection: SettingsSection;

export type SettingsRowProps = {
  filterMatchQuery?: string;
  children?: React.ReactNode;
};
export type SettingsRow = React.FC<SettingsRowProps>;
export let SettingsRow: SettingsRow;

export type SettingsRowStartProps = { children?: React.ReactNode };
export type SettingsRowStart = React.FC<SettingsRowStartProps>;
export let SettingsRowStart: SettingsRowStart;

export type SettingsRowEndProps = { children?: React.ReactNode };
export type SettingsRowEnd = React.FC<SettingsRowEndProps>;
export let SettingsRowEnd: SettingsRowEnd;

transformer<SettingsSection>(
  (emit) => (str) => {
    str = str.replace(
      /(\.jsxs\)\()([a-zA-Z_$][\w$]*)([^=]*"desktop.settings.compatibility")/,
      "$1(__SettingsSection=$2)$3"
    );
    Object.defineProperty(globalThis, "__SettingsSection", { set: emit });
    return str;
  },
  {
    glob: /^\/xpui-routes-desktop-settings\.js/,
    wait: false
  }
).then(($) => {
  SettingsSection = $;
  future.push();
});

transformer<SettingsRow>(
  (emit) => (str) => {
    str = str.replace(
      /(\.jsxs\)\()([a-zA-Z_$][\w$]*)([^=]*"desktop.settings.enableHardwareAcceleration")/,
      "$1(__SettingsSectionRow=$2)$3"
    );
    Object.defineProperty(globalThis, "__SettingsSectionRow", {
      set: emit
    });
    return str;
  },
  {
    glob: /^\/xpui-routes-desktop-settings\.js/,
    wait: false
  }
).then(($) => {
  SettingsRow = $;
});

transformer<SettingsRowStart>(
  (emit) => (str) => {
    str = str.replace(
      /(\(\d+,\s*[a-zA-Z_$][\w$]*\.jsx\)\()([a-zA-Z_$][\w$]*)(\s*,\s*\{\s*children:\s*\(\d+,\s*[a-zA-Z_$][\w$]*\.jsx\)\([a-zA-Z_$][\w$.]*\s*,\s*\{\s*htmlFor:\s*"desktop\.settings\.enableHardwareAcceleration")/,
      "$1(__SettingsSectionLabel=$2)$3"
    );
    Object.defineProperty(globalThis, "__SettingsSectionLabel", { set: emit });
    return str;
  },
  {
    glob: /^\/xpui-routes-desktop-settings\.js/,
    wait: false
  }
).then(($) => {
  SettingsRowStart = $;
});

transformer<SettingsRowEnd>(
  (emit) => (str) => {
    str = str.replace(
      /(\(\d+,\s*[a-zA-Z_$][\w$]*\.jsx\)\()([a-zA-Z_$][\w$]*)(\s*,\s*\{\s*children:\s*\(\d+,\s*[a-zA-Z_$][\w$]*\.jsx\)\([a-zA-Z_$][\w$.]*\s*,\s*\{\s*id:\s*"desktop\.settings\.enableHardwareAcceleration")/,
      "$1(__SettingsSectionControl=$2)$3"
    );
    Object.defineProperty(globalThis, "__SettingsSectionControl", {
      set: emit
    });
    return str;
  },
  {
    glob: /^\/xpui-routes-desktop-settings\.js/,
    wait: false
  }
).then(($) => {
  SettingsRowEnd = $;
});
