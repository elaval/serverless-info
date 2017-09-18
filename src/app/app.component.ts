import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from 'app/auth.service';
import { Http, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Visualización de datos';
  user;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.authService.user.subscribe((user) => {
      this.user = user;
      if (user) {
        this.router.navigate(['/starterview']);
      } else {
        this.router.navigate(['/login']);
      }
    });



  }

  login() {
    this.router.navigate(['/login']);
    //
  }

  logout() {
    this.authService.logout();
  }


};
