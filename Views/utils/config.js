const config = {
  LoginMensaje: 'Powered by DLabs',
  LoginLogoTamanio: '48px',
  ApiKey: 'B43B23E5-B2D4-4D56-A82A-5DB12BF38078',
  ApiAltKey: 'D340C6FA-2992-4CE2-B7D7-0550DBC6ED60',

  // ** Desarrollo

  // UrlLoginServer: 'http://appnet02:2622/',
  UrlLoginServer: 'https://sweetsrv.azurewebsites.net/',


  // ** ApiProject 
  // + Local
  // UrlApiProject: 'http://localhost:5000/',
  //  UrlApiProject: 'http://deamgdb02:5001/',
  UrlApiProject: 'http://appnet02:5001/',
  // UrlApiProject: 'http://dlabsSandbox:6060/',
  // UrlApiProject: 'https://kayaksrvcloud.azurewebsites.net/',


  // ** Kraken 
  // KrakenService: 'https://krakenapi.deacero.com/SandboxServices',
  KrakenService: 'https://krakenapi.deacero.com/KrakenServices',

  // Debugging mode
  DebuggingMode: true,
  version: '2.1.3.23'
};

function GetToken() {
  return sessionStorage.getItem('Token');
}

export { config, GetToken };
