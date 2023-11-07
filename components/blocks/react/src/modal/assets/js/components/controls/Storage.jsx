import { SelectControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

export default function Storage(props) {
  const { defaultValue, setAttributes } = props

  return (
    <SelectControl
      label={__('Stockage', 'hmb-blocks')}
      help={__('Le type de mise en cache de la fermeture de la modale.', 'hmb-blocks')}
      value={defaultValue}
      options={
        [
          { label: 'Session', value: 'session' },
          { label: 'Local', value: 'local' }
        ]
      }
      onChange={(value) => setAttributes({ storage: value })}
    />
  )
}
