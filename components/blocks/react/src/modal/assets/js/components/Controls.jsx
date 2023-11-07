import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

import Breakpoints from './controls/Breakpoints'
import CloseButtonColors from './controls/CloseButtonColors'
import CloseButtonPadding from './controls/CloseButtonPadding'
import CloseButtonSize from './controls/CloseButtonSize'
import Colors from './controls/Colors'
import MaxWidth from './controls/MaxWidth'
import OpenAuto from './controls/OpenAuto'
import OpenSelector from './controls/OpenSelector'
import OverlayColors from './controls/OverlayColors'
import Storage from './controls/Storage'

export default function Controls(props) {
  const { setAttributes, attributes } = props

  return (
    <InspectorControls>
      <div className="hmb-modal__control-wrapper">

        <Colors attributes={attributes} setAttributes={setAttributes}/>
        <OverlayColors attributes={attributes} setAttributes={setAttributes}/>

        <PanelBody className="control-wrapper__section" initialOpen={false} title={__('Configuration globale', 'hmb-blocks')}>
          <MaxWidth defaultValue={attributes['max-width']} setAttributes={setAttributes}/>
          <Storage defaultValue={attributes.storage} setAttributes={setAttributes}/>
          <OpenAuto defaultValue={attributes['open-auto']} setAttributes={setAttributes}/>
          {!attributes['open-auto'] && <OpenSelector defaultValue={attributes['open-selector']} setAttributes={setAttributes}/>}
        </PanelBody>

        <CloseButtonColors attributes={attributes} setAttributes={setAttributes}/>
        <PanelBody className="control-wrapper__section" initialOpen={false} title={__('Configuration du bouton de fermeture', 'hmb-blocks')}>
          <CloseButtonSize defaultValue={attributes['close-button-size']} setAttributes={setAttributes}/>
          <CloseButtonPadding defaultValue={attributes['close-button-padding']} setAttributes={setAttributes}/>
        </PanelBody>

        <PanelBody className="control-wrapper__section breakpoints" initialOpen={false} title={__('Responsive', 'hmb-blocks')}>
          <Breakpoints defaultValue={attributes.breakpointsEnable} setAttributes={setAttributes} attributes={attributes} />
        </PanelBody>

      </div>
    </InspectorControls>
  )
}
