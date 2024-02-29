module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["nativewind/babel"],
      ["@babel/plugin-transform-class-static-block"],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env.local",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
