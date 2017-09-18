import {HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthMethods, AuthProvider, FirebaseUIAuthConfig, FirebaseUIModule, AuthProviderWithCustomConfig } from 'firebaseui-angular';

import { AuthService } from 'app/auth.service';
import { LoginComponent } from 'app/components/login/login.component';
import { AlertService } from 'app/services/alert.service';
import { HomeComponent } from 'app/components/home/home.component';
import { ROUTES } from 'app/app.routes';

// App views
import {DashboardsModule} from './views/dashboards/dashboards.module';
import {AppviewsModule} from './views/appviews/appviews.module';
import { ChartModule } from 'angular2-highcharts';

// App modules/components
import {LayoutsModule} from 'app/components/common/layouts/layouts.module';
import { TideviewsModule } from 'app/views/tideviews/tideviews.module';
import * as highcharts from 'highcharts';

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProvider.Google,
    AuthProvider.Twitter,
    AuthProvider.Github,
    AuthProvider.Password,
    AuthProvider.Phone,
    AuthProvider.Facebook
  ],
  method: AuthMethods.Popup,
  tos: '<your-tos-link>'
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,

    DashboardsModule,
    LayoutsModule,
    AppviewsModule,
    TideviewsModule,

    RouterModule.forRoot(
      ROUTES,
      { enableTracing: true } // <-- debugging purposes only
    ),

    AngularFireModule.initializeApp(environment['firebase'], 'my-app-name'), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    // ChartModule.forRoot(highcharts)

  ],
  providers: [
    AuthService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
