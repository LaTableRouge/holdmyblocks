import '../scss/admin.scss'

import { searchBlock } from './components/block-search'
import { toggleBlocks } from './components/block-toggle'

window.addEventListener('DOMContentLoaded', (e) => {
  toggleBlocks()
  searchBlock()
})
