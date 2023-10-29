import { ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

export default function OpenAuto(props) {
	const { defaultValue, setAttributes } = props

	return (
		<ToggleControl
			label={ __('Ouverture automatique ?', 'hmb-blocks') }
			help={ defaultValue ? __('La modale s\'ouvrira lors du chargement de la page.', 'hmb-blocks') : __('La modale s\'ouvrira avec un évènement personnalisé.', 'hmb-blocks') }
			checked={ defaultValue }
			onChange={
				(value) => {
					setAttributes({ 'open-auto': value })
				}
			}
		/>
	)
}
