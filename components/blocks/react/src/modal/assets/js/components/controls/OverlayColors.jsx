import { PanelColorSettings } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n'

export default function OverlayColors(props) {
  const { attributes, setAttributes } = props

  return (
    <PanelColorSettings
      title={ __("Couleur de l'overlay de la modale", 'hmb-blocks') }
      colorSettings={
        [
          {
            value: attributes['overlay-background-color'],
            label: __('Fond', 'hmb-blocks'),
            onChange: (value) => {
              setAttributes({ 'overlay-background-color': value })
            },
          },
        ]
      }
    />
  )
}
