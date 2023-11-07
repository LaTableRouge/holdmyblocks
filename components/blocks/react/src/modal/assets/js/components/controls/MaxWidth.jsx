import { __experimentalUnitControl as UnitControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

export default function MaxWidth(props) {
  const { defaultValue, setAttributes } = props
  return (
    <UnitControl
      value={ defaultValue }
      help={ __('Largeur maximum', 'hmb-blocks') }
      units={
        [
          { value: 'px', label: 'px', default: 0 },
          { value: '%', label: '%', default: 0 }
        ]
      }
      onChange={
        (value) => {
          setAttributes({ 'max-width': value })
        }
      }
    />
  )
}
