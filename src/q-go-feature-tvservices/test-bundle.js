const context = require.context(
  './src/',
  true,
  /^^((?!(app|reducers|routes|store)).)*\.js$/
);
context.keys().forEach(context);
