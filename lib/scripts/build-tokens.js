const { choices, decisions } = require('../tokens')
const fs = require('fs')
const toKebabCase = require('../../utils/toKebabCase')

function transformTokens(parentKey, object) {
  const objectKeys = Object.keys(object)

  return objectKeys.reduce((tokensTransformed, objectKey) => {
    const value = object[objectKey]
    const customProperty = parentKey
      ? `${parentKey}-${objectKey}`
      : `${objectKey}`

    if (Array.isArray(value)) {
      return `${tokensTransformed}\n\t--${toKebabCase(
        customProperty
      )}: ${value.join(', ')};`
    } else if (typeof value === 'object') {
      return `${tokensTransformed}\n\t${transformTokens(
        `${toKebabCase(customProperty)}`,
        value
      )}`
    }
    return `${tokensTransformed}\n\t--${parentKey}-${toKebabCase(
      objectKey
    )}: ${value};`
  }, '')
}

function buildTokens() {
  const customProperties = `${transformTokens(null, choices)}${transformTokens(
    null,
    decisions
  )}`

  const data = [':root {', customProperties.trim()].join('\n\t').concat('\n}')

  fs.writeFile('./lib/styles/tokens.css', data, 'utf8', function (error) {
    if (error) {
      return console.error(error)
    }
    console.log('🎨 Custom properties created!')
  })
}

buildTokens()
