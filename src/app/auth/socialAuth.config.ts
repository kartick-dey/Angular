import { 
    AuthServiceConfig, 
    GoogleLoginProvider, 
    FacebookLoginProvider, } from 'angularx-social-login';
const config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("392303435767-3q13a736johu3fq8l4mjl5dibtrkhh6j.apps.googleusercontent.com")
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("195444011581327")
    },
    // {
    //     id: LinkedinLoginProvider.PROVIDER_ID,
    //     provider: new LinkedinLoginProvider("86weczqa95vm3e")
    // }
]);
export function provideSocialAuthConfig() {
    return config;
}