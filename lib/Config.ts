import rcs from 'rcs-core';
import path from 'path';
import json from 'json-extra';
import minimatch from 'minimatch';

class Config {
  private static singleton: Config;

  ignorePatterns: string[] = [];

  public load(pathString = path.join(process.cwd(), '.rcsrc')): void {
    let configObject;

    configObject = json.readToObjSync(pathString);

    if (!configObject) {
      // package.json .rcs if no other config is found
      configObject = json.readToObjSync(path.join(process.cwd(), 'package.json')).rcs;
    }

    if (configObject.exclude) {
      rcs.selectorsLibrary.setExclude(configObject.exclude);
    }

    if (configObject.reserve) {
      rcs.selectorsLibrary.setReserved(configObject.reserve);
    }

    if (configObject.ignore) {
      this.ignorePatterns = configObject.ignore;
    }
  }

  public isIgnored(filePath: string): boolean {
    return this.ignorePatterns.some((pattern) => minimatch(filePath, pattern));
  }

  public static getInstance(): Config {
    if (!this.singleton) {
      this.singleton = new this();
    }

    return this.singleton;
  }
}

export default Config;
