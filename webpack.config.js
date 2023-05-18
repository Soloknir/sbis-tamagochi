const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
var phaserModule = path.join(__dirname, '/node_modules/phaser/');

module.exports = {
	entry: './src/index.js',
	module: {
		rules: [
			{ test: /\.(js)$/, use: 'babel-loader' },
			{
				test: /pixi\.js/,
				loader: 'expose-loader',
				options: {
					exposes: ["PIXI"],
				},
			},
			{
				test: /phaser-split\.js$/,
				loader: 'expose-loader',
				options: {
					exposes: ["Phaser"],
				},
			},
			{
				test: /p2\.js/,
				loader: 'expose-loader',
				options: {
					exposes: ["p2"],
				},
			},
			{
				test: /\.(jpg|png)$/,
				use: {
					loader: 'url-loader',
				},
			},
		]
	},
	resolve: {
		alias: {
			'phaser': path.join(phaserModule, 'build/custom/phaser-split.js'),
			'pixi': path.join(phaserModule, 'build/custom/pixi.js'),
			'p2': path.join(phaserModule, 'build/custom/p2.js'),
		}
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index_bundle.js'
	},
	plugins: [
		new HtmlWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [{ from: './src/assets', to: './assets' }],
		}),
	],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}