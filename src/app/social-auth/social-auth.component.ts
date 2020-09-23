import { Component, OnInit } from '@angular/core';
import { 
  AuthService, 
  FacebookLoginProvider, 
  SocialUser, 
  GoogleLoginProvider, 
  LinkedinLoginProvider} from 'ng4-social-login';

@Component({
  selector: 'app-social-auth',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.css']
})
export class SocialAuthComponent implements OnInit {

  public user: SocialUser;

  constructor(private authService: AuthService) { }
    
  ngOnInit(): void {
    this.authService.authState.subscribe((userData) => {
      this.user = userData;
      console.log("User Data : ", this.user);      
    })
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithLinkedIN(): void {
    this.authService.signIn(LinkedinLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }
}



// public facebooklogin(): void {
//   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
//     .then((userData) => {
//       this.user = userData;
//       console.log("userData : ", this.user);
//     })
//     .catch(error => console.log(error))
// }

//   public googleLogin(): void {
//   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
//     .then((userData) => {
//       this.user = userData;
//       console.log("userData : ", this.user);
//     })
//     .catch(error => console.log(error))
// }

//   public linkedInLogin(): void {
//   this.socialAuthService.signIn(LinkedinLoginProvider.PROVIDER_ID)
//     .then((userData) => {
//       this.user = userData;
//       console.log("userData : ", this.user);
//     })
//     .catch(error => console.log(error))
// }

