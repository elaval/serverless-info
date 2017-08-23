import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import 'jquery-slimscroll';
import { AuthService } from 'app/auth.service';

declare var jQuery: any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html'
})

export class NavigationComponent implements OnInit, AfterViewInit {
  user: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.user = user;
      if (user) {
        // this.router.navigate(['/home']);
      } else {
        // this.router.navigate(['/login']);
      }
    });
  }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
  }

  activeRoute(routename: string): boolean{
    return this.router.url.indexOf(routename) > -1;
  }


}
