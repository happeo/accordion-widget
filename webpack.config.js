const path = require("path");
const webpack = require("webpack");

function getEnvVariables(env) {
  if (env.production) {
    return {
      mode: "production",
      slug: "accordion-widget-8oxrsa8rsmggyuikpw1o-ac",
      outputFileName: "bundle.production.js",
    };
  }

  if (env.preprod) {
    return {
      mode: "production",
      slug: "accordion-yzcj9lci5rpttiqgdbyf-ac",
      outputFileName: "bundle.preprod.js",
    };
  }

  if (env.staging) {
    return {
      mode: "production",
      slug: "accordion-r3mbnw9gfbiwdfkv8cv8-ac",
      outputFileName: "bundle.staging.js",
    };
  }

  return {
    mode: "development",
    slug: "accordion-dev-8r8ngcjw57bfckjbiuhu",
    outputFileName: "bundle.js",
  };
}

module.exports = (env) => {
  const { mode, slug, outputFileName } = getEnvVariables(env);

  return {
    entry: path.join(__dirname, "src", "index.js"),
    mode,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-env"],
            },
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.slug": JSON.stringify(slug),
      }),
    ],
    devServer: {
      contentBase: "./dist",
      hot: false,
      inline: true,
      liveReload: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    externals: [
      (_context, request, callback) => {
        if (/^@happeouikit/.test(request)) {
          // Resolve @happeoukit as externals in window
          return callback(null, [
            "Happeouikit",
            request.replace("@happeouikit/", ""),
          ]);
        }
        callback();
      },
      {
        react: "React",
        "react-dom": "ReactDOM",
        "styled-components": "styled",
        jQuery: "jQuery",
      },
    ],
    output: {
      filename: outputFileName,
      path: path.resolve(__dirname, "dist"),
    },
  };
};
