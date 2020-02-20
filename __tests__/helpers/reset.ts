import rcsCore from 'rcs-core';

const reset = (): void => {
  rcsCore.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.cssVariablesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.selectorsLibrary.selectors[0].nameGenerator.reset();
  rcsCore.selectorsLibrary.selectors[1].nameGenerator.reset();
  rcsCore.keyframesLibrary.nameGenerator.reset();
  rcsCore.cssVariablesLibrary.nameGenerator.reset();
  rcsCore.selectorsLibrary.reset();
  rcsCore.keyframesLibrary.reset();
  rcsCore.cssVariablesLibrary.reset();
};

export default reset;
