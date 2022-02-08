const paths = require("react-scripts/config/paths");
const webpack = require("webpack");
const deps = require("./package.json").dependencies;

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.publicPath = "auto";
      const htmlWebpackPlugin = config.plugins.find(
        (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
      );
      htmlWebpackPlugin.userOptions = {
        ...htmlWebpackPlugin.userOptions,
        publicPath: paths.publicUrlOrPath,
        excludeChunks: ["hostApp"]
      };
      config.plugins = [
        ...config.plugins,
        new webpack.container.ModuleFederationPlugin({
          name: "hostApp",
          filename: "remoteEntry.js",
          library: { type: "var", name: "hostApp" },
          shared: {
            ...deps,
            react: {
              singleton: true,
              requiredVersion: deps.react
            },
            "react-dom": {
              singleton: true,
              requiredVersion: deps["react-dom"]
            }
          },
          remotes: {
            test: "test@http://localhost:3001/remoteEntry.js"
          },
          exposes: {
            "./config": "./src/config"
          }
        })
        // new webpack.container.ModuleFederationPlugin({
        //   name: "sharedConfig",
        //   filename: "configRemoteEntry.js",
        //   exposes: {
        //     "./config": "./src/config"
        //   }
        // })
      ];
      return config;
    }
  },
  devServer: (devServerConfig) => {
    devServerConfig.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*"
    };
    return devServerConfig;
  }
};
