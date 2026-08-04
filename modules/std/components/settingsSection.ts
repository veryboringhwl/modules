import { captureGlobal } from "../core/expose.ts";
import { signal } from "../core/index.ts";

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

captureGlobal<SettingsSection>(
  "__SettingsSection",
  /^\/xpui-routes-desktop-settings\.js/,
  (str, name) =>
    str.replace(
      /(\.jsxs\)\()([a-zA-Z_$][\w$]*)([^=]*"desktop.settings.compatibility")/,
      `$1(${name}=$2)$3`
    ),
  { wait: false }
).then(($) => {
  SettingsSection = $;
  signal.push();
});

captureGlobal<SettingsRow>(
  "__SettingsSectionRow",
  /^\/xpui-routes-desktop-settings\.js/,
  (str, name) =>
    str.replace(
      /(\.jsxs\)\()([a-zA-Z_$][\w$]*)([^=]*"desktop.settings.enableHardwareAcceleration")/,
      `$1(${name}=$2)$3`
    ),
  { wait: false }
).then(($) => {
  SettingsRow = $;
});

captureGlobal<SettingsRowStart>(
  "__SettingsSectionLabel",
  /^\/xpui-routes-desktop-settings\.js/,
  (str, name) =>
    str.replace(
      /(\(\d+,\s*[a-zA-Z_$][\w$]*\.jsx\)\()([a-zA-Z_$][\w$]*)(\s*,\s*\{\s*children:\s*\(\d+,\s*[a-zA-Z_$][\w$]*\.jsx\)\([a-zA-Z_$][\w$.]*\s*,\s*\{\s*htmlFor:\s*"desktop\.settings\.enableHardwareAcceleration")/,
      `$1(${name}=$2)$3`
    ),
  { wait: false }
).then(($) => {
  SettingsRowStart = $;
});

captureGlobal<SettingsRowEnd>(
  "__SettingsSectionControl",
  /^\/xpui-routes-desktop-settings\.js/,
  (str, name) =>
    str.replace(
      /(\(\d+,\s*[a-zA-Z_$][\w$]*\.jsx\)\()([a-zA-Z_$][\w$]*)(\s*,\s*\{\s*children:\s*\(\d+,\s*[a-zA-Z_$][\w$]*\.jsx\)\([a-zA-Z_$][\w$.]*\s*,\s*\{\s*id:\s*"desktop\.settings\.enableHardwareAcceleration")/,
      `$1(${name}=$2)$3`
    ),
  { wait: false }
).then(($) => {
  SettingsRowEnd = $;
});
