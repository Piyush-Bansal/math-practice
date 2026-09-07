import postcssPresetEnv from 'postcss-preset-env';

const config = {
	plugins: [
		postcssPresetEnv({
			stage: 3
		})
	]
};

export default config;
