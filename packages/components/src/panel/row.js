/**
 * External dependencies
 */
import classnames from 'classnames';

function PanelRow( { className, children, forwardedRef } ) {
	const classes = classnames( 'components-panel__row', className );

	return (
		<div className={ classes } ref={ forwardedRef }>
			{ children }
		</div>
	);
}

export default PanelRow;
