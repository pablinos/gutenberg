/**
 * WordPress dependencies
 */
import { useRef, useLayoutEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function StartButton( { onClick, ...props } ) {
	const button = useRef( null );

	// Focus the 'Get Started' button on mount if nothing else is focused. This
	// prevents a focus loss when the 'Next' button is swapped out.
	useLayoutEffect( () => {
		if ( document.activeElement === document.body ) {
			button.current.focus();
		}
	}, [ button ] );

	return (
		<Button
			ref={ button }
			isPrimary
			isLarge
			onClick={ onClick }
			{ ...props }
		>
			{ __( 'Get started' ) }
		</Button>
	);
}
