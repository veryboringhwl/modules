import { byCode, byProps, resolveInto } from "../core/webpack.ts";

export type LocaleT = {
  initialize(options: {
    localeForTranslation: string;
    localeForFormatting?: string;
    translations: Record<string, unknown>;
  }): void;
  reset(): void;
  getLocaleForTranslation(): string;
  getLocaleForFormatting(): string;
  getLocaleForURLPath(): string;
  getTranslations(): Record<string, unknown>;
  toLocaleLowerCase(value: string): string;
  toLocaleUpperCase(value: string): string;
  get(key: string, ...params: unknown[]): string;
  getSeparator(): string;
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string;
  formatNumberCompact(value: number): string;
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string;
  formatRelativeDate(date: Date, threshold?: Date, now?: Date, range?: number): string;
  getRelativeTimeFormat(): Intl.RelativeTimeFormat;
  getDateTimeFormat(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;
  getPluralRules(): Intl.PluralRules;
  getPluralKey(value: number | string): string;
};

export let Locale: LocaleT;

resolveInto<LocaleT>(byProps("getTranslations"), (value) => {
  Locale = value;
});

export let createUrlLocale: (locale: string) => Intl.Locale;

resolveInto<(locale: string) => Intl.Locale>(
  byCode({ matches: ["has", "baseName", "language"], mode: "all" }),
  (value) => {
    createUrlLocale = value;
  }
);
