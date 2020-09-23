import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bootstrap-tutorial',
  templateUrl: './bootstrap-tutorial.component.html',
  styleUrls: ['./bootstrap-tutorial.component.css']
})
export class BootstrapTutorialComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

// -------Bootstrap Guide------------
// Installation - 1. ng add @ng-bootstrap/schematics - no dependency required to use bootstrap.
//                2. npm install --save @ng-bootstrap/ng-bootstrap - required dependency.

// Ngx-bootstrap - 1. ngx-bootstrap supports Bootstrap 3 and 4.
//                 2. Builtin animation support on almost everything.
//                 3. No NavBar component.
//                 4. Better Modal support (nested modals, modal as a service, modal as a template).
//                 5. Monthly download is greater than ng-bootstrap

// Ng-bootstrap - 1. ng-bootstrap supports Bootstrap 4 and requires Angular 5+.
//                2. In Ng-bootstrap, the animation is still not present.
//                3. Having NavBar component.
//                4. Package size is almost half times as ngx-bootstrap
