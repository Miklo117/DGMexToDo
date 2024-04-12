/* eslint-disable prefer-template */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import swal from 'sweetalert';
import notify from 'devextreme/ui/notify';
import { config } from './config';

import articulosEs from '../resources/articulos-es.json';
import articulosEn from '../resources/articulos-en.json';
import organizacionesEs from '../resources/organizaciones-es.json';
import organizacionesEn from '../resources/organizaciones-en.json';
import loginEn from '../resources/login-en.json';
import loginEs from '../resources/login-es.json';
import poiEs from '../resources/poi-es.json';
import poiEn from '../resources/poi-en.json';
import usuariosEs from '../resources/usuarios-es.json';
import usuariosEn from '../resources/usuarios-en.json';

require('./prototypes');

/* ------------------------------------------------------------------------------
 * ----------- Funciones de traducción de idioma para JS y HTML  ----------------
 * ------------------------------------------------------------------------------*/

var traducciones = [];

/**
 * Se establece el idioma con base en el prefijo que se envía ejemplo 'es' para español y 'en' para ingles
 *
 * @param {Se envía "en" para ingles y "es" para español, en formato cadena} language
 */
function SetLanguage(language) {
  languageLoad(language);
}

function languageInit(pagina) {
  // eslint-disable-next-line spaced-comment
  var ClaIdioma = getSessionItem('ClaIdioma', '1').toString(); //GetSessionItem("ClaIdioma");
  var lenguaje = '';

  switch (ClaIdioma) {
    case '1':
      lenguaje = 'es';
      break;
    case '2':
      lenguaje = 'en';
      break;
    default:
      lenguaje = 'es';
      break;
  }
  languageLoad(lenguaje, pagina);
}

function languageLoad(language, pagina) {
  languageLoadJson(language, pagina);
}

function languageLoadJson(language, pagina) {
  var _locationPath = window.location.href;
  var page = _locationPath.split('/').pop();
  if (pagina !== undefined) page = pagina;
  if (page === 'salir') page = '';

  var components = {
    'Articulos-es': articulosEs,
    'Articulos-en': articulosEn,
    'layout-es': loginEs,
    'layout-en': loginEn,
    '-es': loginEs,
    '-en': loginEn,
    'POI-es': poiEs,
    'POI-en': poiEn,
    'Organizaciones-es': organizacionesEs,
    'Organizaciones-en': organizacionesEn,
    'Usuarios-es': usuariosEs,
    'Usuarios-en': usuariosEn,
  };
  traducciones = components[page + '-' + language];
}

function TranslateHTML_FindPath(path) {
  var keys = path.split('.');
  var Result = traducciones;

  // se realiza una copia del json y se va reduciendo la copia hasta llegar al nodo final y al valor
  for (var i = 0; i < keys.length; i++) {
    try {
      if (Result[keys[i]] !== null && Result[keys[i]] !== '') {
        Result = Result[keys[i]];
      }
    } catch (e) {
      Result = '#SinTraducción';
      break;
    }
  }

  return Result;
}

function Translate(path) {
  return TranslateHTML_FindPath(path);
}

/**
 * Realiza una peticion a una URL especificada.
 *
 * @param {String} url Dirección donde se realizara la peticioón
 * @param {String} method Tipo de peticion a ejecutar (POST, GET, PUT, DELETE)
 * @param {JSON} [data={}] Objeto que se adjuntará al body de la petición
 * @returns
 */
async function callApi(url, method, data = {}, callBack, multipart = false) {
  method = method.toUpperCase();

  const headers = {
    'x-api-key': config.ApiKey,
    'x-access-token': getSessionItem('Token', ''),
    ...(!multipart && {
      'Content-Type': 'application/json',
    }),
  };

  if (config.DebuggingMode) {
    console.log(`Url: ${url}`);
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: method === 'GET' ? null : !multipart ? JSON.stringify(data) : data,
      dataType: !multipart ? 'json' : null,
    });

    if (response.status === 200) {
      const res = await response.json();
      if (config.DebuggingMode) {
        console.log(`Url: ${url}, Response: `, res);
      }
      callBack(res);
    } else {
      throw Error(`${response.message}`);
    }
  } catch (err) {
    swal('Error', err.message, 'error', {
      buttons: {
        confirm: {
          text: 'Aceptar',
          className: 'animation-on-hover btn btn-success',
        },
      },
    });
  }
}

async function callApi2(url, method, data = {}) {
  method = method.toUpperCase();
  const headers = {
    'x-api-key': config.ApiKey,
    'x-access-token': getSessionItem('Token', ''),
    'Content-Type': 'application/json',
  };
  if (config.DebuggingMode) {
    console.log(`Url: ${url}`);
  }
  return new Promise((resolve, reject) => {
    fetch(url, {
      method,
      headers,
      body: method === 'GET' ? null : JSON.stringify(data),
      dataType: 'json',
    })
      .then(async (response) => {
        const respo = await response.json();
        if (!response.ok) {
          throw Error(`${respo.message}`);
        }
        return respo;
      })
      .then((res) => {
        if (config.DebuggingMode) {
          console.log(`Url: ${url}, Response: `, res);
        }
        resolve(res);
      })
      .catch((err) => {
        swal('Error', err.message, 'error', {
          buttons: {
            confirm: {
              text: 'Aceptar',
              className: 'animation-on-hover btn btn-success',
            },
          },
        });
      });
  });
}


/**
 * Guarda en el localStorage cualquier valor que se mande en un objeto
 *
 * @param {object} params objeto donde cada propiedad se va a guardar
 */
function setSessionData(params) {
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const element = params[key];

      if (typeof element === 'object') {
        localStorage.setItem(key, JSON.stringify(element));
      } else {
        localStorage.setItem(key, element);
      }
    }
  }
}

/**
 * Regresa del localStorage cualquier valor que se pase como primer parametro,
 * en caso de no encontrarlo, regresa el valor por default del segundo parametro
 *
 * @param {string} key
 * @param {any} def
 */
function getSessionItem(key, def) {
  let value;

  try {
    value = JSON.parse(localStorage.getItem(key));
  } catch (error) {
    value = localStorage.getItem(key);
  }

  if (!value) {
    return def;
  }
  return value;
}

/**
 * Regresa del sessionStorage el NumUsuario
 *
 * @returns {Number} NumUsuario
 */
function getCliente() {
  return localStorage.getItem('NumUsuario');
}

/**
 * Remueve del localStorage el JWT token y el nombre del usuario
 *
 */
function logOut() {
  var claIdioma = getSessionItem('ClaIdioma', 1);
  localStorage.clear();
  setSessionData({ ClaIdioma: claIdioma });
}

/**
 * Hace el decode del JWT token
 *
 * @param {string} token
 * @returns {object} payload del token
 */
function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

/**
 * Valida la si existe un token guardado en localStorage y en caso de existir
 * se valida su expiracion
 *
 * @returns {boolean} retorna si el token es valido o no
 */
function sessionAlive() {
  const jwtToken = localStorage.getItem('Token');
  let resp = false;

  if (jwtToken) {
    const { exp } = decodeToken(jwtToken);

    if (Date.now() < exp * 1000) {
      resp = true;
    }
  }

  if (!resp) {
    logOut();
  }

  return resp;
}

/**
 * Tipo de la notificacion de DevExtreme
 */
const notifyType = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

/**
 * Posicion la notificacion de DevExtreme
 * 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top'
 */
const notifyPosition = {
  centerBottom: 'center bottom',
  centerTop: 'center top',
  rightBottom: 'right bottom',
  rightTop: 'right top',
};

/**
 * Manda Un mensaje Generico con el Notify de DevExtreme
 *
 * @param {string} message mensaje de la alerta
 * @param {notifyPosition} notifyPosition posicion de la alerta
 * @param {notifyType} notifyType tipo de notificacion
 */
function showNotify(message, notifyPosition, notifyType) {
  notify(
    {
      message,
      position: {
        my: notifyPosition,
        at: notifyPosition,
      },
      width: '400px',
      closeOnSwipe: true,
    },
    notifyType,
    3000
  );
}

function showSweetAlert(title, message, notifyType) {
  swal(title, message, notifyType, {
    buttons: {
      confirm: {
        text: 'Aceptar',
        className: 'animation-on-hover btn btn-success',
      },
    },
  });
}

const servicios = {
  LoginRecuperaPassword: 54,
};

export {
  callApi,
  callApi2,
  callKrakenApi,
  setSessionData,
  getSessionItem,
  getCliente,
  logOut,
  decodeToken,
  sessionAlive,
  notifyType,
  notifyPosition,
  servicios,
  showNotify,
  showSweetAlert,
  SetLanguage,
  languageInit,
  Translate,
};
