/**
 * Postcss Prefixwrap
 * https://www.npmjs.com/package/postcss-prefixwrap
 * Theme changing by CSS selector
 * https://gist.github.com/sbusch/a90eafaf5a5b61c6d6172da6ff76ddaa
 */
const { getLoaders, loaderByName } = require('@craco/craco')
const PrefixWrap = require('postcss-prefixwrap')

const overrideWebpackConfig = ({ context, webpackConfig, pluginOptions }) => {
  // Cannot use prebuilt options in craco, so we have to add it manually
  // https://stackoverflow.com/questions/68738215/craco-plugin-not-loading
  const { theme } = pluginOptions
  const { hasFoundAny, matches } = getLoaders(
    webpackConfig,
    loaderByName('postcss-loader'),
  )
  if (!hasFoundAny) return webpackConfig
  const appPrefixWrap = theme.map((selector) =>
    PrefixWrap(`#${selector}`, {
      ignoredSelectors: ['html'],
      whitelist: [new RegExp(`${selector}\.less$`, 'i')],
    }),
  )
  matches.forEach((match) => {
    match.loader.options.postcssOptions.plugins.push(...appPrefixWrap)
  })
  return webpackConfig
}

module.exports = { overrideWebpackConfig }
