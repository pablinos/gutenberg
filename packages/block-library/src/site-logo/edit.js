/**
 * External dependencies
 */
import classnames from 'classnames';
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	useEntityProp,
	__experimentalUseEntitySaving,
} from '@wordpress/core-data';
import {
	IconButton,
	PanelBody,
	RangeControl,
	Toolbar,
	ResizableBox,
} from '@wordpress/components';
import {
	BlockControls,
	BlockAlignmentToolbar,
	BlockIcon,
	InspectorControls,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import icon from './icon';

const onError = ( message ) => {
	alert( message );
};

import ImageSize from '../image/image-size';

const getHandleStates = ( align, isRTL = false ) => {
	const defaultAlign = isRTL ? 'right' : 'left';
	const handleStates = {
		left: {
			right: true,
			left: false,
		},
		center: {
			right: true,
			left: true,
		},
		right: {
			right: false,
			left: true,
		},
	};

	return handleStates[ align ? align : defaultAlign ];
};

export default function LogoEdit( { attributes: { align, width }, children, className, clientId, setAttributes, isSelected } ) {
	const [ isEditing, setIsEditing ] = useState( false );
	const [ logo, setLogo ] = useEntityProp( 'root', 'site', 'sitelogo' );
	const [ isDirty, , save ] = __experimentalUseEntitySaving(
		'root',
		'site',
		'sitelogo'
	);

	const mediaItemData = useSelect(
		( select ) => {
			const mediaItem = select( 'core' ).getEntityRecord( 'root', 'media', logo );
			return mediaItem && {
				url: mediaItem.source_url,
				alt: mediaItem.alt_text,
			};
		}, [ logo ] );

	const { isRTL, isLargeViewport } = useSelect(
		( select ) => ( {
			isRTL: select( 'core/block-editor' ).getSettings().isRTL,
			isLargeViewport: select( 'core/viewport' ).isViewportMatch( 'medium' ),
		} )
	);

	let url = null;
	let alt = null;
	if ( mediaItemData ) {
		alt = mediaItemData.alt;
		url = mediaItemData.url;
	}

	if ( isDirty ) {
		save();
	}

	const toggleIsEditing = () => setIsEditing( ! isEditing );

	const setIsNotEditing = () => setIsEditing( false );

	const onSelectLogo = ( media ) => {
		if ( ! media || ! media.id ) {
			return;
		}

		setLogo( media.id.toString() );
		setIsNotEditing();
	};

	const deleteLogo = () => {
		setLogo( '' );
	};

	const controls = (
		<BlockControls>
			<BlockAlignmentToolbar
				value={ align }
				onChange={ ( newAlign ) => setAttributes( { align: newAlign } ) }
				controls={ [ 'left', 'center', 'right' ] }
			/>
			{ !! url && (
				<Toolbar>
					<IconButton
						className={ classnames( 'components-icon-button components-toolbar__control', { 'is-active': isEditing } ) }
						label={ __( 'Edit image' ) }
						aria-pressed={ isEditing }
						onClick={ toggleIsEditing }
						icon="edit"
					/>
				</Toolbar>
			) }
		</BlockControls>
	);

	const getInspectorControls = ( imageWidth, resizedImageWidth, containerWidth, canResize ) => {
		return (
			<InspectorControls>
				<PanelBody title={ __( 'Site Logo Settings' ) }>
					<RangeControl
						label={ __( 'Image width' ) }
						onChange={ ( newWidth ) => setAttributes( { width: newWidth } ) }
						min={ 10 }
						max={ containerWidth }
						initialPosition={ Math.min( imageWidth, containerWidth ) }
						value={ resizedImageWidth || '' }
						disabled={ ! canResize }
					/>
				</PanelBody>
			</InspectorControls>
		);
	};

	const wrapperElement = document.getElementById( `block-${ clientId }` );
	const [ maxWidth, setMaxWidth ] = useState( wrapperElement && wrapperElement.clientWidth );

	useEffect( () => {
		const calculateMaxWidth = debounce( () => setMaxWidth( wrapperElement && wrapperElement.clientWidth ), 250 );
		calculateMaxWidth();
		window.addEventListener( 'resize', calculateMaxWidth );
		return () => window.removeEventListener( 'resize', calculateMaxWidth );
	} );

	const label = __( 'Site Logo' );
	const logoImage = (
		<ImageSize src={ url }>
			{ ( sizes ) => {
				const {
					imageWidthWithinContainer,
					imageWidth,
					imageHeight,
				} = sizes;

				const img = (
					<a href="#home" className="custom-logo-link" rel="home">
						<img className="custom-logo" src={ url } alt={ alt } />
					</a>
				);

				const currentWidth = width || imageWidthWithinContainer;
				const ratio = imageWidth / imageHeight;
				const currentHeight = width ? width / ratio : imageWidthWithinContainer;

				const maxWidthProp = {};
				if ( maxWidth ) {
					maxWidthProp.maxWidth = maxWidth;
				}

				const canResize = isLargeViewport && ( ! width || width <= maxWidth );
				const wrapperProps = {};
				if ( align ) {
					wrapperProps.className = `align${ align }`;
				}

				if ( ! canResize ) {
					wrapperProps.style = { width: Math.min( currentWidth, maxWidth ) };
				}

				return (
					<>
						{ ! isEditing && getInspectorControls( imageWidth, width, maxWidth, canResize ) }
						<div { ...wrapperProps }>
							{ canResize ? (
								<ResizableBox
									showHandle={ isSelected }
									size={ {
										width: Math.min( currentWidth, maxWidth ),
										height: currentWidth <= maxWidth ? currentHeight : maxWidth / ratio,
									} }
									lockAspectRatio={ true }
									minWidth={ 10 }
									{ ...maxWidthProp }
									enable={ {
										top: false,
										bottom: true,
										...getHandleStates( align, isRTL ),
									} }

									onResizeStop={ ( event, direction, elt, delta ) => {
										setAttributes( {
											width: parseInt( currentWidth + delta.width, 10 ),
										} );
									} }
									style={ { display: 'inline-block' } }
								>
									{ img }
								</ResizableBox>
							) : img }
						</div>
					</>
				);
			} }
		</ImageSize>
	);
	const editComponent = (
		<MediaPlaceholder
			icon={ <BlockIcon icon={ icon } fill="ff0000" /> }
			labels={ {
				title: label,
				instructions: __( 'Upload an image, or pick one from your media library, to be your site logo' ),
			} }
			onSelect={ onSelectLogo }
			accept="image/*"
			allowedTypes={ [ 'image' ] }
			mediaPreview={ !! url && logoImage }
			onCancel={ !! url && setIsNotEditing }
			onError={ onError }
		>
			{ !! url && (
				<IconButton isLarge icon="delete" onClick={ deleteLogo }>
					{ __( 'Delete Site Logo' ) }
				</IconButton>
			) }
			{ children }
		</MediaPlaceholder>
	);

	return (
		<>
			<div className={ className }>
				{ controls }
				{ ! url || isEditing ? editComponent : logoImage }
			</div>
		</>
	);
}
