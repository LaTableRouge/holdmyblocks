import { BaseControl, Button, PanelBody, SelectControl, TextControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components'
import { Icon } from '@wordpress/components'
import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

import { formatUnitlessValue } from '../../common/functions'

export default function Breakpoints(props) {
  const { defaultValue, setAttributes, attributes } = props

  const hasBreakpointsEnabled = attributes.breakpointsEnable

  const [message, setMessage] = useState('')

  // Add a new breakpoint in the carousel config
  const addBreakpoint = (e) => {
    e.preventDefault()

    const formData = {
      breakpoint: formatUnitlessValue(e.target.elements.breakpoint.value),
      config: {}
    }

    const existingBreakpoint = attributes.breakpoints.find((element) => element.breakpoint === formData.breakpoint)
    if (!existingBreakpoint) {
      const tempArray = attributes.breakpoints
      setAttributes({ breakpoints: [...tempArray, formData] })
      setMessage('')
    } else {
      setMessage(`${__('Le point de rupture', 'hmb-blocks')} "${formData.breakpoint}" ${__('existe déjà.', 'hmb-blocks')}.`)
    }
  }

  // Remove a new breakpoint in the carousel config
  const removeBreakpoint = (breakpointToRemove) => {
    const filteredArray = attributes.breakpoints.filter((element) => element.breakpoint !== breakpointToRemove)
    setAttributes({ breakpoints: [...filteredArray] })
    setMessage('')
  }

  // Update a specific breakpoint value in the carousel config
  const updateBreakpoint = (breakpoint, attributeToUpdate, newValue) => {
    breakpoint = formatUnitlessValue(breakpoint)
    const existingBreakpointIndex = attributes.breakpoints.findIndex((element) => element.breakpoint === breakpoint)
    if (existingBreakpointIndex !== undefined) {
      const tempArray = attributes.breakpoints
      tempArray[existingBreakpointIndex].config[attributeToUpdate] = newValue
      setAttributes({ breakpoints: [...tempArray] })
      setMessage('')
    } else {
      setMessage(`${__('Le point de rupture', 'hmb-blocks')} "${breakpoint}" ${__('n\'a pas été trouvé.', 'hmb-blocks')}`)
    }
  }

  return (
    <>
      <ToggleControl
                label={__('Activer les points de rupture responsive', 'hmb-blocks')}
                checked={defaultValue}
        onChange={(value) => {
          setAttributes({ breakpointsEnable: value })
        }}
        className="breakpoints__toggle"
      />

      {hasBreakpointsEnabled && (
        <BaseControl className="breakpoints__control">
          <form onSubmit={addBreakpoint} className="control__form">
            <UnitControl units={[{ value: 'px', label: 'px', default: 0 }]} label={__('Ajouter un point de rupture', 'hmb-blocks')} placeholder={768} required={true} name="breakpoint" />
            <Button type="submit" className="button button-primary" aria-label={__('Ajouter un point de rupture', 'hmb-blocks')}>
              +
            </Button>
          </form>

          {message && (
            <p className="notice notice-error">
              <Icon icon="info-outline" />
              {message}
            </p>
          )}

          {attributes.breakpoints.length > 0
            && attributes.breakpoints.map((object, key) => (
              <div id={`bp-${object.breakpoint}`} key={key} className="control__item">
                <PanelBody title={`${__('Point de rupture', 'hmb-blocks')}: ${object.breakpoint}`} initialOpen={false}>
                  {/* TODO : voir comment réutiliser les composant du panel de contrôle pour éviter la duplication de code */}

                  <PanelBody initialOpen={false} title={__('Configuration globale', 'hmb-blocks')}>
                    <UnitControl
                      value={ object.config['max-width'] || '' }
                      help={ __('Largeur maximum', 'hmb-blocks') }
                      units={
                        [
                          { value: 'px', label: 'px', default: 0 },
                          { value: '%', label: '%', default: 0 }
                        ]
                      }
                      onChange={
                        (value) => {
                          updateBreakpoint(object.breakpoint, 'max-width', value)
                        }
                      }
                    />
                  </PanelBody>

                  <PanelBody initialOpen={false} title={__('Configuration du bouton de fermeture', 'hmb-blocks')}>
                    <UnitControl
                      value={ object.config['close-button-size'] || '' }
                      help={ __('Taille du bouton', 'hmb-blocks') }
                      units={
                        [
                          { value: 'px', label: 'px', default: 0 }
                        ]
                      }
                      onChange={
                        (value) => {
                          updateBreakpoint(object.breakpoint, 'close-button-size', value)
                        }
                      }
                    />
                    <UnitControl
                      value={ object.config['close-button-padding'] || '' }
                      help={ __('L\'espace entre le texte du bouton et sa bordure', 'hmb-blocks') }
                      units={
                        [
                          { value: 'px', label: 'px', default: 0 }
                        ]
                      }
                      onChange={
                        (value) => {
                          updateBreakpoint(object.breakpoint, 'close-button-padding', value)
                        }
                      }
                    />
                  </PanelBody>

                  <Button
                    className="button"
                    aria-label={`${__('Supprimer le point de rupture', 'hmb-blocks')}: ${object.breakpoint}`}
                    onClick={() => {
                      removeBreakpoint(object.breakpoint)
                    }}
                  >
                    {__('Supprimer la configuration du point de rupture.', 'hmb-blocks')}
                  </Button>
                </PanelBody>
              </div>
            ))}
        </BaseControl>
      )}
    </>
  )
}
