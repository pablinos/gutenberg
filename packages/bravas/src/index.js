/**
 * Internal dependencies
 */
import { config } from './config';

const defaultThemeConfig = {
	button: {
		backgroundColor: '#32373c',
		textColor: 'white',
	},
};

config.apply( defaultThemeConfig );

window.bravas = {
	config,
};

export * from './config';
