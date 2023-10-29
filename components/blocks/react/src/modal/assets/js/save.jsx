import { InnerBlocks, useBlockProps } from '@wordpress/block-editor'

import { createInlineStyle } from './common/create-inline-style'
import { getConfigFromAttributes } from './common/functions'
import CloseModal from './components/CloseModal'

export default function Save({ attributes }) {
	const blockProps = useBlockProps.save()

	const { blockId } = attributes

	const config = getConfigFromAttributes(attributes)

	// Ajoute les options en fonction du breakpoint dans la config de la modale
	if (config.breakpoints.length > 0) {
		const breakpointObject = {}
		config.breakpoints.forEach((element) => {
			breakpointObject[`(min-width: ${element.breakpoint})`] = {
				...element.config
			}
		})
		config.breakpoints = breakpointObject
	}

	return (
		<section
			{...blockProps}
			id={blockId}
			data-open-selector={JSON.stringify(attributes['open-selector'])}
			data-auto-open={attributes['open-auto']}
		>
			<style className='hmb-modal__config-style'>{createInlineStyle(config, blockId)}</style>

			<div className="hmb-modal__inner-wrapper">
				<div className='hmb-modal__overlay js-close-modal'></div>

				<div className='hmb-modal__content'>
					<CloseModal className='content__close' />
					<InnerBlocks.Content />
				</div>
			</div>
		</section>
	)
}
