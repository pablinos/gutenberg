/**
 * WordPress dependencies
 */
import {
	useEntityProp,
	__experimentalUseEntitySaving,
} from '@wordpress/core-data';
import {
	Button,
} from '@wordpress/components';
import {
	BlockIcon,
	MediaPlaceholder } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ImageEdit, composed } from '../image/edit';

function onSelectLogo( setAttributes, setLogo ) {
	return ( media ) => {
		if ( ! media || ! media.url ) {
			setAttributes( { url: undefined, id: undefined } );
			return;
		}

		setAttributes( {
			url: media.url,
			id: media.id,
		} );

		setLogo( media.id.toString() );
	};
}

class LogoMediaPlaceholder extends MediaPlaceholder {
	renderUrlSelectionUI() {
		console.log( 'Overridden!' );
		return (
			<Button
				className="editor-media-placeholder__button block-editor-media-placeholder__button"
				href="https://werdpress.com"
				isLarge
			>
				{ __( 'Create Logo' ) }
			</Button>
		);
	}
}

function LogoEditWithEntity( props ) {
	const [ logo, setLogo ] = useEntityProp( 'root', 'site', 'sitelogo' );
	const [ isDirty, , save ] = __experimentalUseEntitySaving(
		'root',
		'site',
		'sitelogo'
	);
	const url = useSelect(
		( select ) => {
			const mediaItem = select( 'core' ).getEntityRecord( 'root', 'media', logo );
			return mediaItem && mediaItem.source_url;
		}, [ logo ] );

	if ( isDirty ) {
		save();
	}

	return <LogoEdit mediaHandler={ onSelectLogo( props.setAttributes, setLogo ) } { ...props } attributes={ { ...props.attributes, id: logo, url } } />;
}

class LogoEdit extends ImageEdit {
	constructor( props ) {
		super( props );
		this.onSelectImage = this.onSelectImage.bind( this );
		this.onSelectURL = null;
	}

	onSelectImage( media ) {
		super.onSelectImage( media );
		this.props.mediaHandler( media );
	}

	getMediaPlaceholder( placeholderProps ) {
		const {
			className,
			labels,
			id,
			src,
			mediaPreview,
			isEditing,
			url,
			icon,
			noticeUI,
			allowedMediaTypes,
		} = placeholderProps;

		return <LogoMediaPlaceholder
			icon={ <BlockIcon icon={ icon } /> }
			className={ className }
			labels={ labels }
			onSelect={ this.onSelectImage }
			onDoubleClick={ this.toggleIsEditing }
			onCancel={ !! url && this.toggleIsEditing }
			notices={ noticeUI }
			onError={ this.onUploadError }
			accept="image/*"
			allowedTypes={ allowedMediaTypes }
			value={ { id, src } }
			mediaPreview={ mediaPreview }
			disableMediaButtons={ ! isEditing && url }
		/>;
	}
}

export default composed( LogoEditWithEntity );
