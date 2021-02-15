const webpack = require("webpack");

const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  plugins: [
    new WebpackPwaManifest({
      name: "Budget Tracker",
      short_name: "BTracker",
      start_url: "./public/index.html",
      background_color: "#01579b",
      theme_color: "#ffffff",
      fingerprints: false,
      inject: false,
      icons: [
        {
          src: path.resolve("./public/icons/icon-512x512.png"),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join("assets", "icons"),
        },
      ],
    }),
  ],
  mode: "development",
};

module.exports = config;
