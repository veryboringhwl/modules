import { toPascalCase } from "/hooks/std/text.ts";

import { createApi, fromModule, selectExport } from "../core/expose.ts";
import { byCode, byFactorySource, sourceOf } from "../core/webpack.ts";

export type ParsableAsURI = any;

export type IsThisURIType<A extends keyof URITypes> = (url: ParsableAsURI) => url is URIClass<A>;

export type URIClass<_A extends keyof URITypes> = any;

export type URITypes = {
  AD: "ad";
  ALBUM: "album";
  APPLICATION: "application";
  ARTIST: "artist";
  ARTIST_TOPLIST: "artist-toplist";
  ARTIST_CONCERTS: "artist-concerts";
  AUDIO: "audio";
  AUDIO_FILE: "audiofile";
  AUTHOR: "author";
  B2B_PARTY: "b2b-party";
  CACHED_FILES: "cached-files";
  CANVAS: "canvas";
  CHAT: "chat";
  CHAT_MESSAGE: "chat-message";
  CLIP: "clip";
  CLIP_VIDEO_CHAPTER: "clip-video-chapter";
  COLLECTION: "collection";
  COLLECTION_ALBUM: "collection-album";
  COLLECTION_ARTIST: "collection-artist";
  COLLECTION_MISSING_ALBUM: "collection-missing-album";
  COLLECTION_TRACK_LIST: "collectiontracklist";
  COMMENT: "comment";
  CONCEPT: "concept";
  CONCERT: "concert";
  CONCERT_GALLERY: "concert-gallery";
  CONCERTS: "concerts";
  CONCERTS_GENRE: "concerts-genre";
  CONCERTS_LOCATION: "concerts-location";
  CONCERTS_LOCATION_GENRE: "concerts-location-genre";
  CONTAINER: "container";
  CONTEXT_GROUP: "context-group";
  CONTRIBUTION: "contribution";
  CONTRIBUTOR: "contributor";
  COURSE: "course";
  CULTURAL_MOMENT: "cultural-moment";
  DAILY_MIX: "dailymix";
  EMPTY: "empty";
  EPISODE: "episode";
  EXPRESSION: "expression";
  FACEBOOK: "facebook";
  FESTIVAL: "festival";
  FOLDER: "folder";
  FOLLOWERS: "followers";
  FOLLOWING: "following";
  GENRE: "genre";
  IMAGE: "image";
  INBOX: "inbox";
  INTERRUPTION: "interruption";
  JAM: "jam";
  KALLAX: "kallax";
  LESSON: "lesson";
  LIBRARY: "library";
  LIST: "list";
  LISTENING_ACTIVITY: "listening-activity";
  LIVE: "live";
  LOCAL_ALBUM: "local-album";
  LOCAL_ARTIST: "local-artist";
  LOCAL: "local";
  LOCAL_TRACK: "local";
  MEDIA: "media";
  MERCHHUB: "merchhub";
  MERCH: "merch";
  MOSAIC: "mosaic";
  PLAYLIST: "playlist";
  PLAYLIST_V2: "playlist-v2";
  PODCAST_CHAPTER: "podcast-chapter";
  POLL: "poll";
  PRERELEASE: "prerelease";
  PRESENTS: "presents";
  PROFILE: "profile";
  PROMOTER: "promoter";
  PROMOTION: "promotion";
  PUBLISHED_ROOTLIST: "published-rootlist";
  QUESTION: "question";
  QUEUE: "queue";
  QUIZ: "quiz";
  RADIO: "radio";
  RESPONSE: "response";
  ROOM: "room";
  ROOTLIST: "rootlist";
  SEARCH: "search";
  SECTION: "section";
  S4A_THIRD_PARTY: "s4a-third-party";
  SHOW: "show";
  SITE: "site";
  SOCIAL_SESSION: "socialsession";
  SPECIAL: "special";
  STARRED: "starred";
  STATION: "station";
  SUPPLEMENTARY_MATERIAL: "supplementarymaterial";
  TEMP_PLAYLIST: "temp-playlist";
  TOPLIST: "toplist";
  TOUR: "tour";
  TRACK: "track";
  TRACKSET: "trackset";
  UNKNOWN: "unknown";
  USER_HIGHLIGHT: "user-highlight";
  USER_TOPLIST: "user-toplist";
  USER_TOP_TRACKS: "user-top-tracks";
  VENUE: "venue";
  VIDEO: "video";
  WRAPPED_PARTY: "wrapped-party";
};

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

type URIModule = {
  Types: URITypes;
  from: (uri: ParsableAsURI) => URIClass<any>;
  fromString: (str: string) => URIClass<any>;
  idToHex: (str: string) => string;
  hexToId: (str: string) => string;
  urlEncode: (str: string) => string;
  isSameIdentity: (a: ParsableAsURI, b: ParsableAsURI) => boolean;
  is: Is;
  create: Create;
};

const uriModule = byFactorySource({
  matches: ["Invalid Spotify URI!", "play.spotify.com/"],
  mode: "all"
});

const getTypes = (exports: any): URITypes => {
  const entry = Object.values(exports).find(
    (v: any) => v && typeof v === "object" && "PLAYLIST_V2" in v && "TRACK" in v
  );

  if (!entry) {
    throw new Error("Failed to find URI Types");
  }

  return entry as URITypes;
};

const getFunctionExports = (exports: any): Function[] =>
  Object.values(exports).filter((v): v is Function => typeof v === "function");

const getTypeKeys = (exports: any): string[] => Object.keys(getTypes(exports));

const isTestFn = (fn: Function) =>
  /\?\s*void 0\s*:\s*\w+\.type\)\s*===\s*\w+\.\w+/.test(sourceOf(fn));

const isCreateFn = (fn: Function) => /return\s+\w+\(\w+\.\w+,/.test(sourceOf(fn));

const getTypeFromFn = (fn: Function, typeKeys: string[]) => {
  const str = sourceOf(fn);

  for (const type of typeKeys) {
    const regex = new RegExp(`\\.${type}(?!_)`);
    if (regex.test(str)) {
      return type;
    }
  }

  return null;
};

const mapByType = (fns: Function[], typeKeys: string[]): Record<string, any> =>
  Object.fromEntries(
    fns.map((fn) => {
      const type = getTypeFromFn(fn, typeKeys);
      if (!type) {
        return ["Unknown", fn];
      }

      return [toPascalCase(type), fn];
    })
  );

export const URI = createApi<URIModule>({
  Types: fromModule(uriModule, getTypes),
  from: fromModule(uriModule, selectExport(byCode("allowedTypes"))),
  fromString: fromModule(uriModule, selectExport(byCode(/Argument [`\\]uri[`\\]/))),
  idToHex: fromModule(uriModule, selectExport(byCode(/22\s*===|===\s*22/))),
  hexToId: fromModule(uriModule, selectExport(byCode(/32\s*===|===\s*32/))),
  urlEncode: fromModule(uriModule, selectExport(byCode(/return\s+\w+\(\w+,\s*\w+\.URI\)/))),
  isSameIdentity: fromModule(uriModule, selectExport(byCode(/\w+\.id\s*===\s*\w+\.id/))),
  is: fromModule(
    uriModule,
    (exports): Is =>
      mapByType(getFunctionExports(exports).filter(isTestFn), getTypeKeys(exports)) as Is
  ),
  create: fromModule(
    uriModule,
    (exports): Create =>
      mapByType(getFunctionExports(exports).filter(isCreateFn), getTypeKeys(exports)) as Create
  )
});
