import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }), provideAnimations()]
};

export const environment = {
  // production: false,
  versionCheckURL: 'assets/version.json',
  appURL: 'https://localhost:7293/api/imagegallery',
  imageURL: 'https://localhost:7293',
  // appURL: 'https://localhost:7118/api/clearing',
  // apiURL_Admin: 'http://localhost:5000/api/authenticate', //http://localhost:5000/api',
  apiURL_Admin: 'http://localhost:8082/api/authenticate', //http://localhost:5000/api',
  reportServer: 'http://localhost:8095/api/reports',
  coyID: 'maritime',
  coyName: 'maritime Manager',
  imgLogo: '',
  imgHome: 'assets/images/sapidHol.jpg',
  imgHomeLogo: 'assets/images/sapidLogo22.png',
  VAT: 7.5,
  //version: env.npm_package_version + '-dev',
  serverUrl: '/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
};
