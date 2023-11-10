const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	entry: {
		index: "./src/index.tsx",
	},
	mode: "production",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "ts-loader",
						options: {
							compilerOptions: { noEmit: false },
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: require.resolve("@svgr/webpack"),
						options: {
							prettier: false,
							svgo: false,
							svgoConfig: {
								plugins: [{ removeViewBox: false }],
							},
							titleProp: true,
							ref: true,
						},
					},
					{
						loader: require.resolve("file-loader"),
						options: {
							name: "static/media/[name].[hash].[ext]",
						},
					},
				],
				issuer: {
					and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
				},
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: "manifest.json", to: "../manifest.json" },
				{ from: "colorize.js", to: "../colorize.js" },
				{ from: "backgroundColor.css", to: "../backgroundColor.css" },
				{
					from: "img/aws_colorized.png",
					to: "../img/aws_colorized.png",
				},
			],
		}),
		...getHtmlPlugins(["index"]),
	],
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		path: path.join(__dirname, "dist/js"),
		filename: "[name].js",
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},
};

function getHtmlPlugins(chunks) {
	return chunks.map(
		(chunk) =>
			new HTMLPlugin({
				title: "AWS Cloudwatch Colorizer",
				filename: `${chunk}.html`,
				chunks: [chunk],
			})
	);
}
