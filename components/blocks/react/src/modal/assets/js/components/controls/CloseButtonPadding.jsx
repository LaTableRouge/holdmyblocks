import { __experimentalUnitControl as UnitControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

export default function CloseButtonPadding(props) {
  const { defaultValue, setAttributes } = props

  return (
    <UnitControl
      value={ defaultValue }
      help={ __('L\'espace entre le texte du bouton et sa bordure', 'hmb-blocks') }
      units={
        [
          { value: 'px', label: 'px', default: 0 }
        ]
      }
      onChange={
        (value) => {
          setAttributes({ 'close-button-padding': value })
        }
      }
    />
  )
}
