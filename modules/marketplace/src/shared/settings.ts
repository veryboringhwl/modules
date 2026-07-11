import { defineSettings, toggle } from "/modules/stdlib/mod.ts";

export const settingsSchema = defineSettings({
  hideCoreModules: toggle({ default: false, label: "Hide core modules" })
});

export type SettingsSchema = typeof settingsSchema;
