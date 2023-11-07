import { useBlockProps } from '@wordpress/block-editor'

import Cat from './components/Cat'

export default function Save({ attributes }) {
  const blockProps = useBlockProps.save()

  const { blockId, enableAnimation } = attributes

  return (
    <section
      {...blockProps}
      id={blockId}
      data-animate={enableAnimation}
    >
      <Cat/>
    </section>
  )
}
