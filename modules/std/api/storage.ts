import { Platform } from "./platform.ts";
import { URI } from "./uri.ts";

import type { ModuleInstance } from "/hooks/module.ts";

export const createStorage = (mod: ModuleInstance) => {
  const hookedNativeStorageMethods = new Set(["getItem", "setItem", "removeItem"]);

  return new Proxy(globalThis.localStorage, {
    get(target, p, receiver) {
      const func: unknown = Reflect.get(target, p, receiver);

      if (
        typeof p === "string" &&
        hookedNativeStorageMethods.has(p) &&
        typeof func === "function"
      ) {
        return (key: string, ...data: any[]) =>
          func.call(target, `module:${mod.getModuleIdentifier()}:${key}`, ...data);
      }

      return func;
    }
  });
};

export function createSyncedStorage(playlistUri: string) {
  const CHUNK_SIZE = 200;
  const MAX_DOUBLE_CHUNKS = 1000;

  const PlaylistAPI = Platform.getPlaylistAPI() as unknown as {
    getContents(
      uri: string,
      options: { filter: string; limit: number }
    ): Promise<{ items: Array<{ uri: string }> }>;
    add(uri: string, uris: string[], options: { after: string }): Promise<unknown>;
    remove(uri: string, uris: Array<{ uri: string; uid: string }>): Promise<unknown>;
  };

  function markKey(key: string) {
    return `\x02${key}\x03`;
  }

  function assertSmallerSize(
    encodedKey: string,
    chunkSize: number,
    chunkCount: number,
    message: string
  ) {
    const percentEscapes = encodedKey.split("%").length - 1;
    const effectiveLength = encodedKey.length + percentEscapes * 2;
    if (effectiveLength > chunkSize * chunkCount) {
      throw new Error(message);
    }
  }

  async function getUris(key: string) {
    assertSmallerSize(encodeURIComponent(key), CHUNK_SIZE, 1, "Can't fit key in a single chunk");

    const { items } = await PlaylistAPI.getContents(playlistUri, {
      filter: key,
      limit: 1e9
    });

    return items
      .map((item) => URI.fromString(item.uri))
      .filter((uri) => uri.type === "local")
      .filter((uri) => uri.track === key);
  }

  async function getKey(key: string) {
    const uris = await getUris(key);
    if (uris.length === 0) return null;
    return uris
      .toSorted((a, b) => a.duration - b.duration)
      .map((uri) => uri.artist + uri.album)
      .join("");
  }

  async function removeKey(key: string) {
    const uris = await getUris(key);
    if (uris.length > 0) {
      await PlaylistAPI.remove(
        playlistUri,
        uris.map((u) => ({ uri: u.toURI(), uid: "" }))
      );
    }
  }
  async function addKey(key: string, encodedValue: string) {
    assertSmallerSize(encodeURIComponent(key), CHUNK_SIZE, 1, "Can't fit key in a single chunk");
    assertSmallerSize(
      encodedValue,
      CHUNK_SIZE,
      MAX_DOUBLE_CHUNKS,
      `Can't fit value in ${MAX_DOUBLE_CHUNKS} double chunks`
    );

    const uris = Array.from(
      collectTuples(generateStringChunks(encodedValue, CHUNK_SIZE), 2, "")
    ).map(([a, b], i) => `spotify:local:${a}:${b}:${key}:${i + 1}`);

    await PlaylistAPI.add(playlistUri, uris, { after: "end" });
  }

  return {
    async getItem(key: string) {
      const data = await getKey(markKey(key));
      return data === null ? null : decodeURIComponent(data);
    },
    async removeItem(key: string) {
      try {
        await removeKey(markKey(key));
      } catch {
        return false;
      }
      return true;
    },
    async setItem(key: string, value: string) {
      const encodedValue = encodeURIComponent(value);
      await removeKey(markKey(key));
      await addKey(markKey(key), encodedValue);
      return value;
    }
  };
}

function* generateStringChunks(string: string, chunkSize: number) {
  let chunk = "";
  let logicalLength = 0;
  for (let i = 0; i < string.length; i++) {
    chunk += string[i];
    logicalLength++;
    if (string[i] === "%") {
      chunk += string[i + 1] + string[i + 2];
      i += 2;
    }
    if (logicalLength >= chunkSize) {
      yield chunk;
      chunk = "";
      logicalLength = 0;
    }
  }
  if (chunk) {
    yield chunk;
  }
}

function* collectTuples<T>(gen: Generator<T, void, unknown>, l: number, unit: T) {
  let result: IteratorResult<T, void>;
  let done: boolean | undefined;

  function next() {
    if (done) return unit;
    result = gen.next();
    done = result.done;
    if (done) return unit;
    return result.value;
  }

  while (!done) {
    yield Array.from({ length: l }, next);
  }
}
