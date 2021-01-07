import rcs from 'rcs-core';
import fs from 'fs-extra';
import { LoadMappingOptions, Mapping } from 'rcs-core/dest/mapping/load';

async function loadMapping(
  pathString: string,
  opts?: LoadMappingOptions,
): Promise<void>;

function loadMapping(
  pathString: Mapping,
  opts?: LoadMappingOptions,
): void;

async function loadMapping(
  pathString: string | Mapping,
  opts?: LoadMappingOptions,
): Promise<void> {
  let selectors: Mapping;

  if (typeof pathString === 'string') {
    try {
      selectors = await fs.readJSON(pathString, { encoding: 'utf8' });
    } catch {
      selectors = {};
    }
  } else {
    selectors = pathString;
  }

  rcs.mapping.load(selectors, opts);
}

export default loadMapping;
