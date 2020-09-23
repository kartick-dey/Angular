import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthenticationService } from './auth/auth.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public idleState: string;
  public timedOut: boolean;
  public lastPing: Date;
  public expirationDuration: number;
  constructor(private authService: AuthenticationService,
    private idle: Idle,
    private keepalive: Keepalive) {
    idle.onIdleEnd.subscribe(() => {
      this.idleState = "No longer idle";
      console.log(this.idleState);
      this.reset();
    });
    idle.onTimeout.subscribe(() => {
      alert("Your session is ended. PLesae log in again ");
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      this.authService.logout();

    });
    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle";
      console.log(this.idleState);

    });
    idle.onTimeoutWarning.subscribe((countDown) => {
      this.idleState = "You will be timeout in " + countDown + "seconds";
      console.log(this.idleState)
    });
    keepalive.interval(5);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.authService.loggedInObs().subscribe(loggedInStatus => 
      {
        if (loggedInStatus) {
          const userData = JSON.parse(sessionStorage.getItem("userData"));
          console.log(userData._expirationDuration);
          this.expirationDuration = userData._expirationDuration;
          idle.setIdle(this.expirationDuration);
          idle.setTimeout(5);
          idle.watch();
          this.timedOut = false;
        } else {
          idle.stop();
        }
      });
  }
  ngOnInit() {
    this.authService.autoLogin();    
  }

  // This method is help to triggered the ng-Idle functionality.
  public reset(): void {
    this.idle.watch();
    this.idleState = 'Started.';
    console.log(this.idleState);
    this.timedOut = false;
  }
}
