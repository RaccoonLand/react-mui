import type { StylisPlugin } from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

/**
 * prefixer must remain first so vendor prefixes are applied after RTL transforms.
 * @see https://github.com/emotion-js/emotion/tree/main/packages/cache#stylisplugins
 */
function withPrefixer(...plugins: StylisPlugin[]): StylisPlugin[] {
  return [prefixer as StylisPlugin, ...plugins]
}

export const ltrStylisPlugins = withPrefixer()

export const rtlStylisPlugins = withPrefixer(rtlPlugin as StylisPlugin)
