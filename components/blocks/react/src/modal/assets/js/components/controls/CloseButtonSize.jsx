import { __experimentalUnitControl as UnitControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

export default function CloseButtonSize(props) {
  const { defaultValue, setAttributes } = props

  return (
    <UnitControl
      value={ defaultValue }
      help={ __('Taille du bouton', 'hmb-blocks') }
      units={
        [
          { value: 'px', label: 'px', default: 0 }
        ]
      }
      onChange={
        (value) => {
          setAttributes({ 'close-button-size': value })
        }
      }
    />
  )
}
