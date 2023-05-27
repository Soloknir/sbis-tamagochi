const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.ts',
	module: {
		rules: [
			{ test: /\.(ts)$/, use: 'ts-loader' },
			{
				test: /\.(jpg|png)$/,
				use: {
					loader: 'url-loader',
				},
			},
		]
	},
	resolve: {
		extensions: ['.js','.ts']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index_bundle.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: './src/assets', to: './assets' }],
		}),
	],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}