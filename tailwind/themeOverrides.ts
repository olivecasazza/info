import { Color } from 'three'

import { themeColors } from './colors'
type Overrides = import('naive-ui').GlobalThemeOverrides

const baseOverrides = {
  common: {
    clearColor: new Color('transparent').getHexString(),
    primaryColor: themeColors.primary[500],
    primaryColorHover: themeColors.highlight[500],
    primaryColorPressed: themeColors.secondary[500],
    fontFamily: 'Courier New, Roboto system-ui',
    textColor1: new Color('white').getHexString()
  }
}

/**
 * @type import('naive-ui').GlobalThemeOverrides
 */
export const lightThemeOverrides: Overrides = {
  ...baseOverrides
}
/**
 * @type import('naive-ui').GlobalThemeOverrides
 */
export const darkThemeOverrides: Overrides = {
  ...baseOverrides
}
