/**
 * Internal dependencies
 */
import { config } from './config';

const defaultThemeConfig = {
	button: {
		backgroundColor: '#32373c',
		padding: '12px 24px',
		textColor: 'white',
	},
};

config.apply( defaultThemeConfig );

window.bravas = {
	config,
};

export * from './config';
