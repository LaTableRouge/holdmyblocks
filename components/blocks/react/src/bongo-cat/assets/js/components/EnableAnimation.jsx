import { ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

export default function EnableAnimation(props) {
    const { defaultValue, setAttributes } = props

	return (
        <ToggleControl
			label={ __('Activer les animations ?', 'hmb-blocks') }
			help={ defaultValue ? __("L'image sera animée lors des interactions sur l'écran.", 'hmb-blocks') : __("L'image ne sera pas animée", 'hmb-blocks') }
			checked={ defaultValue }
			onChange={
				(value) => {
					setAttributes({ 'enableAnimation': value })
				}
			}
		/>
	)
}
