/* eslint-disable prefer-template */
import * as languages from '../languages';

const locales = {
  1: 'es_mx',
  2: 'en_us',
};

function translate(path = '') {
  if (path === '') {
    return '#NoPath';
  }

  const ClaIdioma = sessionStorage.getItem('ClaIdioma');
  const locale = locales[ClaIdioma];
  const paths = path.split('.');

  if (paths.length < 1) {
    return '#NoTraduccion_' + path;
  }

  let translation = languages[locale];
  for (let i = 0; i < paths.length; i++) {
    translation = translation[paths[i]];
    if (typeof translation === 'undefined') {
      return '#NoTraduccion_' + path;
    }
  }

  return translation;
}

export default translate;
