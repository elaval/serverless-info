import {Routes} from '@angular/router';
import { HomeComponent } from 'app/components/home/home.component';
import { LoginComponent } from 'app/components/login/login.component';

export const ROUTES: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterComponent },
 
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
