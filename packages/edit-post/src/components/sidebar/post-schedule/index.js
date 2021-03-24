/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelRow, Dropdown, Button } from '@wordpress/components';
import { useRef, forwardRef } from '@wordpress/element';
import {
	PostSchedule as PostScheduleForm,
	PostScheduleLabel,
	PostScheduleCheck,
} from '@wordpress/editor';

const PanelRowWithRef = forwardRef( ( props, ref ) => (
	<PanelRow forwardedRef={ ref } className="edit-post-post-schedule">
		{ props.children }
	</PanelRow>
) );

export function PostSchedule() {
	const elRef = useRef();

	return (
		<PostScheduleCheck>
			<PanelRowWithRef ref={ elRef }>
				<span>{ __( 'Publish' ) }</span>
				<Dropdown
					popoverProps={ { anchorRef: elRef.current } }
					position="bottom left"
					contentClassName="edit-post-post-schedule__dialog"
					renderToggle={ ( { onToggle, isOpen } ) => (
						<>
							<Button
								className="edit-post-post-schedule__toggle"
								onClick={ onToggle }
								aria-expanded={ isOpen }
								isTertiary
							>
								<PostScheduleLabel />
							</Button>
						</>
					) }
					renderContent={ () => <PostScheduleForm /> }
				/>
			</PanelRowWithRef>
		</PostScheduleCheck>
	);
}

export default PostSchedule;
