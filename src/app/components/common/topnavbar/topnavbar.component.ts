import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { AuthService } from 'app/auth.service';
declare var jQuery: any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopNavbarComponent {
  constructor(
    private authService: AuthService
  ) {}

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

  logout() {
    this.authService.logout();
  }

}
