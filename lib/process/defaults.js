module.exports = {
  availableTypes: ['auto', 'js', 'html', 'css', 'any'],
  fileExt: {
    js: ['.js', '.jsx'],
    css: ['.css', '.scss', '.sass', '.less'],
    html: ['.html', '.htm'],
  },
  optionsDefault: {
    type: 'auto',
    overwrite: false,
    cwd: process.cwd(),
    newPath: 'rcs',
  },
};
