import { searchBlock } from './components/block-search'
import { toggleBlocks } from './components/block-toggle'
import { tableSanitize } from './components/table-sanitize'

window.addEventListener('DOMContentLoaded', (e) => {
  toggleBlocks()
  searchBlock()

  tableSanitize()
})
