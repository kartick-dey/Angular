import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthenticationService } from 'app/auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class NgIdleModule {
    public idleState: string;
    public timedOut: boolean;
    public lastPing: Date;
    constructor(private idle: Idle,
        private keepalive: Keepalive,
        private authService: AuthenticationService){}

    public idleFunction(): void {
        this.idle.setIdle(5);
        this.idle.setTimeout(5);
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this.idle.onIdleEnd.subscribe(() => {
            this.idleState = "No longer idle";
            console.log(this.idleState);
            this.reset();
        });
        this.idle.onTimeout.subscribe(() => {
            alert("You are going to be logout after in few seconds. ");
            this.idleState = 'Timed out!';
            this.timedOut = true;
            console.log(this.idleState);
            this.authService.logout();

        });
        this.idle.onIdleStart.subscribe(() => 
        {
            this.idleState = "You've gone idle";
            console.log(this.idleState);
            
        });
        this.idle.onTimeoutWarning.subscribe((countDown) => 
        {
            this.idleState = "You will be timeout in "+countDown+"seconds";
            console.log(this.idleState)
        });
        this.keepalive.interval(5);
        this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
        // if(this.authService.loggedInStatus.value) {
        //     this.idle.watch();
        //     this.idleState = 'Started.';
        //     this.timedOut = false;
        // } else {
        //     this.idle.stop();
        // }

        this.reset();
    }

    public reset() {
        this.idle.watch();
        this.idleState = 'Started.';
        console.log(this.idleState);
        // this.timedOut = false;
    }
}