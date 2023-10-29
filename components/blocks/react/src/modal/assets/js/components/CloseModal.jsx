import { Icon } from '@wordpress/components';

export default function CloseModal(props) {
	return (
		<button className={`${props.className} js-close-modal`}>
			<Icon
				icon={
					<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#000000" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6L6.4 19Z"></path></svg>
				}
			/>
		</button>
	)
}
