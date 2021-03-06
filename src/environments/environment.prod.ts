// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDrksp-W9-I6Z2jKoAdsQkPuaFZGmidi68',
    authDomain: 'datavis-8d136.firebaseapp.com',
    databaseURL: 'https://datavis-8d136.firebaseio.com/',
    projectId: 'datavis-8d136',
    storageBucket: 'gs://datavis-8d136.appspot.com',
    messagingSenderId: '<your-messaging-sender-id>'
  }
};

