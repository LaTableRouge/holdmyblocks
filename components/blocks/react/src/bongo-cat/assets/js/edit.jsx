import '../scss/editor.scss'

import {InspectorControls, useBlockProps} from '@wordpress/block-editor'
import { PanelBody } from '@wordpress/components'
import { useEffect } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

import Cat from './components/Cat'
import EnableAnimation from './components/EnableAnimation'

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps()

	useEffect(() => {
		setAttributes( { blockId: blockProps.id } )
	}, [])

	return (
		<>
            <InspectorControls>
                <PanelBody title={ __('Réglages', 'hmb-blocks') } icon="edit">
                    <EnableAnimation defaultValue={attributes['enableAnimation']} setAttributes={setAttributes}/>
                </PanelBody>
            </InspectorControls>

			<section {...blockProps}>
                <Cat/>
			</section>
		</>
	)
}
