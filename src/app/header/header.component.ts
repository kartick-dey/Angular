import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public toggleButtonStatus = false;

  public isAuthenticated = false;
  public profileImage: string;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => this.isAuthenticated = !!user);
  }

  toggleButton(): void {
    this.toggleButtonStatus = !this.toggleButtonStatus;
  }

  public onLogout(): void {
    this.authService.logout();
  }

}


// {
//   "input": "./node_modules/bootstrap/dist/css/bootstrap.css"
// }

// "node_modules/bootstrap/dist/css/bootstrap.min.css",

// "bootstrap": "^4.5.0",