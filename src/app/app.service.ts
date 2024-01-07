import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { appConfig, environment } from './app.config';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  // info from appDef table via appInitializer fn
  OrgName: string = 'Logic Version'; //
  orgID: string = '---';
  orgLogo: string = '*';
  appName: string = 'Maritime';
  appID: string = '---';
  appLogo: string = '*';
  clientName: string = '---';
  clientID: string = '---';
  clientType: string = 'Maritime';
  clientLogo: string = '***';

  menuItemsArray: string[] = [];
  screenDisplay: string = 'hello';

  consultID: string = '';
  conID: number = 0;

  private config: any;

  // apiEndpoint = configService.get('apiEndpoint');
  // apiEndpoint = this.get('appName');

  loadDefaults(): Promise<any> {
    return this.http
      .get('/assets/config.json')
      .toPromise()
      .then((config: any) => {
        this.config = config;
        this.screenDisplay = this.get('screenDisplay');
        this.appName = this.get('appName');
        this.clientName = this.get('clientName');
        // this.clientLogo = this.get('clientLogo');
         // resolve(true);
      })
      .catch((error) => {
        console.error('Error loading configuration file');
        // reject(error);
      });
  }

  get(key: string): any {
    return this.config[key];
  }

  public loadDefaults2() {
    return new Promise((resolve, reject) => {
      this.http
        .get('/assets/config.json')
        .toPromise()
        .then((data) => {
          this.config = data;
          resolve(true);
        })
        .catch((error) => {
          console.error('Error loading configuration file');
          reject(error);
        });
    });
  }

  getDataForkJoin(): Observable<any> {
    const request1 = this.http.get('https://api.example.com/data1');
    const request2 = this.http.get('https://api.example.com/data2');
    const request3 = this.http.get('https://api.example.com/data3');

    return forkJoin([request1, request2, request3]);
    // When you subscribe to this getData() observable, you will receive an array of responses, each corresponding to the response of one of the HTTP requests.
  }
}
