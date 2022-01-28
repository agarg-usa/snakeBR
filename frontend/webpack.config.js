const path = require('path');

module.exports = {
	entry: './src/index.ts',
	mode: 'development',
	devtool: "source-map",
	module: {
		rules: [
		{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
		},
		],
	},
	optimization: {
		concatenateModules: true
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		modules: ["node_modules"],
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
	},
};