/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState, Children } from '@wordpress/element';
import { KeyboardShortcuts, IconButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PageControl from './page-control';
import { BackButtonIcon, ForwardButtonIcon } from './vectors';
import StartButton from './start-button';

function Guide( { onFinish, children } ) {
	const isMobile = useSelect( ( select ) =>
		select( 'core/viewport' ).isViewportMatch( '< small' ) );

	const [ currentPage, setCurrentPage ] = useState( 0 );

	const numberOfPages = Children.count( children );
	const canGoBack = currentPage > 0;
	const canGoForward = currentPage < numberOfPages - 1;

	const goBack = () => {
		if ( canGoBack ) {
			setCurrentPage( currentPage - 1 );
		}
	};

	const goForward = () => {
		if ( canGoForward ) {
			setCurrentPage( currentPage + 1 );
		}
	};

	return (
		<div className="edit-post-welcome-guide-modal__guide">
			<KeyboardShortcuts key={ currentPage } shortcuts={ {
				left: goBack,
				right: goForward,
			} } />
			{ children[ currentPage ] }
			{ isMobile && ! canGoForward && (
				<StartButton onClick={ onFinish } />
			) }
			<div className="edit-post-welcome-guide-modal__footer">
				{ canGoBack && (
					<IconButton
						className="edit-post-welcome-guide-modal__back-button"
						icon={ <BackButtonIcon /> }
						onClick={ goBack }
					>
						{ __( 'Previous' ) }
					</IconButton>
				) }
				<PageControl
					currentPage={ currentPage }
					numberOfPages={ numberOfPages }
					setCurrentPage={ setCurrentPage }
				/>
				{ canGoForward && (
					<IconButton
						className="edit-post-welcome-guide-modal__forward-button"
						icon={ <ForwardButtonIcon /> }
						onClick={ goForward }
					>
						{ __( 'Next' ) }
					</IconButton>
				) }
				{ ! isMobile && ! canGoForward && (
					<StartButton
						className="edit-post-welcome-guide-modal__start-button"
						onClick={ onFinish }
					/>
				) }
			</div>
		</div>
	);
}

function Page( { children } ) {
	return (
		<div className="edit-post-welcome-guide-modal__page">
			{ children }
		</div>
	);
}

Guide.Page = Page;

export default Guide;
