import { PanelColorSettings } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n'

export default function Colors(props) {
  const { attributes, setAttributes } = props

  return (
    <PanelColorSettings
      title={ __('Couleur du fond de la modale', 'hmb-blocks') }
      colorSettings={
        [
          {
            value: attributes['background-color'],
            label: __('Fond', 'hmb-blocks'),
            onChange: (value) => {
              setAttributes({ 'background-color': value })
            },
          },
        ]
      }
        />
  )
}