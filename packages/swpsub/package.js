Package.describe({
  name: "swpsub",
  summary: "SweepSubmit package",
  version: "0.1.0"
  // git: "https://github.com/TelescopeJS/telescope-releases.git"
});

Npm.depends({
  'tabdown-sacha': '0.0.3'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  api.use(['telescope:core@0.24.0']);
  api.use(['telescope:tags@0.24.0']);

  // ---------------------------------- 2. Files to include ----------------------------------

  // i18n config (must come first)

  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // both

  api.addFiles([
    'lib/menus.js',
    'lib/callbacks.js',
    'lib/icons.js',
    'lib/modules.js',
    'lib/custom_fields.js',
    'lib/views.js',
    'lib/colors.js'
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/stylesheets/_mixins.scss',
    'lib/client/stylesheets/_posts.scss',
    'lib/client/stylesheets/_global.scss',
    'lib/client/stylesheets/_categories.scss',
    'lib/client/stylesheets/screen.scss',

    'lib/client/templates/categories/category_input_item.html',
    'lib/client/templates/categories/post_categories.html',
    'lib/client/templates/categories/post_categories.js',
    'lib/client/templates/categories/categories_menu_item.html',
    'lib/client/templates/categories/categories_menu_item.js'

  ], ['client']);

  // server

  api.addFiles([
    'lib/server/import_categories.js'
  ], ['server']);

  api.addAssets('categories/categories.txt', 'server');
  // i18n languages (must come last)

  api.addFiles([
    'i18n/en.i18n.json'
  ], ['client', 'server']);

});
