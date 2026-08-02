import { toPascalCase } from "/hooks/std/text.ts";
import { fnStr } from "/hooks/util.ts";

import { modules, ready } from "../core/webpack.ts";
import { webpackRequire } from "../core/wpunpk.mix.ts";

import type { IsThisURIType, ParsableAsURI, URIClass, URITypes } from "./uri.ts";

type Is = {
  Ad: IsThisURIType<any>;
  Album: IsThisURIType<any>;
  Application: IsThisURIType<any>;
  Artist: IsThisURIType<any>;
  Canvas: IsThisURIType<any>;
  Clip: IsThisURIType<any>;
  Collection: IsThisURIType<any>;
  CollectionArtist: IsThisURIType<any>;
  Comment: IsThisURIType<any>;
  Concert: IsThisURIType<any>;
  Episode: IsThisURIType<any>;
  Folder: IsThisURIType<any>;
  Genre: IsThisURIType<any>;
  Jam: IsThisURIType<any>;
  Kallax: IsThisURIType<any>;
  LocalTrack: IsThisURIType<any>;
  Playlist: IsThisURIType<any>;
  PlaylistV2: IsThisURIType<any>;
  PodcastChapter: IsThisURIType<any>;
  Profile: IsThisURIType<any>;
  Radio: IsThisURIType<any>;
  Show: IsThisURIType<any>;
  SocialSession: IsThisURIType<any>;
  Station: IsThisURIType<any>;
  Track: IsThisURIType<any>;
  UserHighlight: IsThisURIType<any>;
};

type Create = {
  Album: any;
  Application: any;
  Artist: any;
  ArtistConcerts: any;
  Author: any;
  Clip: any;
  Collection: any;
  CollectionArtist: any;
  Concept: any;
  Concert: any;
  Episode: any;
  Folder: any;
  Image: any;
  Kallax: any;
  LocalAlbum: any;
  LocalArtist: any;
  PlaylistV2: any;
  PodcastChapter: any;
  Prerelease: any;
  Profile: any;
  Queue: any;
  Search: any;
  Show: any;
  SocialSession: any;
  Station: any;
  Track: any;
  UserHighlight: any;
  UserToplist: any;
  Venue: any;
};

await ready;

const [URIModuleID] = modules.find(
  ([id, v]) =>
    fnStr(v).includes("Invalid Spotify URI!") && Object.keys(webpackRequire(id)).length > 10
)!;

const URIModule = webpackRequire(URIModuleID);

const TypesEntry = Object.values(URIModule).find(
  (v: any) => v && typeof v === "object" && "PLAYLIST_V2" in v && "TRACK" in v
);

if (!TypesEntry) {
  throw new Error("Failed to find URI Types");
}

export const Types = TypesEntry as URITypes;
const TypesKeys = Object.keys(Types);

const vs = Object.values(URIModule).filter((v): v is Function => typeof v === "function");

const remainingFns = [...vs];

const findAndExcludeBy = (matcher: (fn: Function, str: string) => boolean) => {
  const i = remainingFns.findIndex((fn) => matcher(fn, fnStr(fn)));
  if (i === -1) return undefined;
  return remainingFns.splice(i, 1)[0];
};

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
    const regex = new RegExp(`\\.${type}(?!_)`);
    if (regex.test(str)) {
      return type;
    }
  }

  return null;
};

const fnsByType = Object.groupBy(remainingFns, (fn) =>
  isTestFn(fn) ? "test" : isCreateFn(fn) ? "create" : "unknown"
);

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
