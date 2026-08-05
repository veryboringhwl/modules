import { toPascalCase } from "/hooks/std/text.ts";
import { fnStr } from "/hooks/util.ts";

import { webpackRequire } from "../wpunpk.mix.ts";
import { modules } from "./index.ts";

import type { IsThisURIType, ParsableAsURI, URIClass, URITypes } from "./URI.ts";

type Is = {
  Ad: IsThisURIType<any>;
  Album: IsThisURIType<any>;
  Application: IsThisURIType<any>;
  Artist: IsThisURIType<any>;
  CollectionAlbum: IsThisURIType<any>;
  CollectionArtist: IsThisURIType<any>;
  Collection: IsThisURIType<any>;
  Concert: IsThisURIType<any>;
  Episode: IsThisURIType<any>;
  Folder: IsThisURIType<any>;
  LocalTrack: IsThisURIType<any>;
  Playlist: IsThisURIType<any>;
  PlaylistV2: IsThisURIType<any>;
  Profile: IsThisURIType<any>;
  Radio: IsThisURIType<any>;
  Show: IsThisURIType<any>;
  SocialSession: IsThisURIType<any>;
  Station: IsThisURIType<any>;
  Track: IsThisURIType<any>;
};

type Create = {
  Album: any;
  Application: any;
  Artist: any;
  CollectionAlbum: any;
  CollectionArtist: any;
  Collection: any;
  Concert: any;
  Episode: any;
  Folder: any;
  LocalAlbum: any;
  LocalArtist: any;
  PlaylistV2: any;
  Prerelease: any;
  Profile: any;
  Queue: any;
  Search: any;
  Show: any;
  SocialSession: any;
  Station: any;
  Track: any;
  UserToplist: any;
};

await globalThis.CHUNKS.xpui.promise;

const [URIModuleID] = modules.find(
  ([id, v]) =>
    fnStr(v).includes("Invalid Spotify URI!") && Object.keys(webpackRequire(id)).length > 10
)!;

const URIModule = webpackRequire(URIModuleID);

//
// ✅ Find Types safely
//
const TypesEntry = Object.values(URIModule).find(
  (v: any) => v && typeof v === "object" && "PLAYLIST_V2" in v && "TRACK" in v
);

if (!TypesEntry) {
  throw new Error("Failed to find URI Types");
}

export const Types = TypesEntry as URITypes;
const TypesKeys = Object.keys(Types);

//
// ✅ Extract all functions
//
const vs = Object.values(URIModule).filter((v): v is Function => typeof v === "function");

//
// ✅ Handle utility functions FIRST so they are not swallowed by isTestFn or isCreateFn
//
const remainingFns = [...vs];

const findAndExcludeBy = (matcher: (fn: Function, str: string) => boolean) => {
  const i = remainingFns.findIndex((fn) => matcher(fn, fnStr(fn)));
  if (i === -1) return undefined;
  return remainingFns.splice(i, 1)[0];
};

// ✅ Special functions (robust matching)
export const from: (uri: ParsableAsURI) => URIClass<any> = findAndExcludeBy((_, str) =>
  str.includes("allowedTypes")
) as any;

export const fromString: (str: string) => URIClass<any> = findAndExcludeBy(
  (_, str) => str.includes("Argument `uri`") || str.includes("Argument \\`uri\\`")
) as any;

export const idToHex: (str: string) => string = findAndExcludeBy(
  (_, str) => /22\s*===/.test(str) || /===\s*22/.test(str)
) as any;

export const hexToId: (str: string) => string = findAndExcludeBy(
  (_, str) => /32\s*===/.test(str) || /===\s*32/.test(str)
) as any;

export const urlEncode: (str: string) => string = findAndExcludeBy((_, str) =>
  str.includes(".URI")
) as any;

export const isSameIdentity: (a: ParsableAsURI, b: ParsableAsURI) => boolean = findAndExcludeBy(
  (_, str) => /\w+\.id\s*===\s*\w+\.id/.test(str)
) as any;

//
// ✅ Helpers (NO minified names)
//
const isTestFn = (fn: Function) => {
  const str = fnStr(fn);
  return /===\s*[\w$]+\./.test(str);
};

const isCreateFn = (fn: Function) => {
  const str = fnStr(fn);
  return /\([\w$]+\./.test(str);
};

const getTypeFromFn = (fn: Function) => {
  const str = fnStr(fn);

  for (const type of TypesKeys) {
    // avoid PLAYLIST matching PLAYLIST_V2
    const regex = new RegExp(`\\.${type}(?!_)`);
    if (regex.test(str)) {
      return type;
    }
  }

  return null;
};

//
// ✅ Group functions
//
const fnsByType = Object.groupBy(remainingFns, (fn) =>
  isTestFn(fn) ? "test" : isCreateFn(fn) ? "create" : "unknown"
);

//
// ✅ Build maps
//
export const is: Is = Object.fromEntries(
  (fnsByType.test || []).map((fn) => {
    const type = getTypeFromFn(fn);
    if (!type) return ["Unknown", fn];
    return [toPascalCase(type), fn];
  })
) as any;

export const create: Create = Object.fromEntries(
  (fnsByType.create || []).map((fn) => {
    const type = getTypeFromFn(fn);
    if (!type) return ["Unknown", fn];
    return [toPascalCase(type), fn];
  })
) as any;
