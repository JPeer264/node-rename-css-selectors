export default {
  availableTypes: ['auto', 'js', 'html', 'pug', 'css', 'any'],
  fileExt: {
    js: ['.js', '.jsx'],
    css: ['.css', '.scss', '.sass', '.less'],
    html: ['.html', '.htm', '.handlebars', '.hbs'],
    pug: ['.pug'],
  },
  optionsDefault: {
    type: 'auto',
    overwrite: false,
    cwd: process.cwd(),
    newPath: 'rcs',
  },
};
