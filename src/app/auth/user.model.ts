
export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _expirationDuration: number,
        private _tokenExpirationDate?: Date,
        public provider?: string,
        public profileImg?: string ) {}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }

        return this._token;
    }

    get expirationDuration() {
        return this.expirationDuration;
    }

    set expirationDuration(expirationDuration: number) {
        this.expirationDuration = expirationDuration;
    }

    get tokenExpirationTime() {
        if (this._tokenExpirationDate){
            console.log("I am from user model");            
            return this._tokenExpirationDate.getTime();
        } else {
            return null;
        }        
    }
}


// ------------Response Data from Backend-----------------------


///------------Google FireBase Auth Rest API-------------

// email: "kartick.dey1995@gmail.com"
// expiresIn: "3600"
// idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMmM1NDk4YTcwYjc0MjQ5NzI2ZDhmYjYxODlkZWI3NGMzNWM4MGEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYW5ndWxhci1lYzMxNiIsImF1ZCI6ImFuZ3VsYXItZWMzMTYiLCJhdXRoX3RpbWUiOjE1OTA3NDAwMzgsInVzZXJfaWQiOiJWSjFjdTc4OHdsZ3ozeHlsZUUxSk5ocFdPWU4yIiwic3ViIjoiVkoxY3U3ODh3bGd6M3h5bGVFMUpOaHBXT1lOMiIsImlhdCI6MTU5MDc0MDAzOCwiZXhwIjoxNTkwNzQzNjM4LCJlbWFpbCI6ImthcnRpY2suZGV5MTk5NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsia2FydGljay5kZXkxOTk1QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Y5JE52g1MflcQO3MGoBjq7ZKktpt6JFIj994Gw6fK_M5Y3EoRNi70mvEg6tg0BDFi3WwAuzNY6Rg7NVci-E-lsJtvL6CnqD6l6YRExlvTP7dorTjVRmRv3s90ugVZeiOfLtggOxcdne2A_Une-6XdacDpDyNVwo7y7ySs5l3u03dXx57ssSJPiZ93mV_2CuoPHR-0UbgmkVLrtxwpQyXGf793hlc2TDtqTjCILpbw5gNLZhlG-5_jyL6r1n1I5YQjv6UGkxIbyvXAzQm_B19g-g5TvweoWH53QYOuKprt0tiZpD7sRW2cfcrSv2buiBJapTaqGqJtjA_Enm9FZdwrw"
// kind: "identitytoolkit#VerifyPasswordResponse"
// localId: "VJ1cu788wlgz3xyleE1JNhpWOYN2"
// refreshToken: "AE0u-NdKaFSjBZl4a9rcfD_cx1MA2rIwK58gsOSjV35EcKBC43Bh_PZnDbIKwRjpyfsKbdInMtx7X2ERjzDQNf_9nU0rYAZwqJXOXFPXMlj1Ba-7Ur1aIo6RzTiP4WI66fTh7w67ECJfrf3qy2R61rTxghijIDKgyk8MvzM4v0Tvt5wRrp18XMOahP6XmzxkeLw3rm4ivGl9oUT5COGVHiPm1JPTB4amTw"
// registered: true

///--------------Google----------------

// authToken: "ya29.a0AfH6SMC99dktb5WnAqwPMS6XnA7dnc171QiC6vEPgzlHYdtg5zrWqzFcsmlLDPhhpZI2EJV1Hj0T8MjiqVxv5EESqkhzZFW0gtHqFpCL55tt8WbUcqSEqtntSQwtH7mtEcUjhqgAlXk8mgdzaa8ZmLz8ao-H1B7mB7o"
// email: "kartick.dey1995@gmail.com"
// firstName: "KARTICK"
// id: "109834072816788013641"
// idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImZiOGNhNWI3ZDhkOWE1YzZjNjc4ODA3MWU4NjZjNmM0MGYzZmMxZjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMzkyMzAzNDM1NzY3LTNxMTNhNzM2am9odTNmcThsNG1qbDVkaWJ0cmtoaDZqLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMzkyMzAzNDM1NzY3LTNxMTNhNzM2am9odTNmcThsNG1qbDVkaWJ0cmtoaDZqLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA5ODM0MDcyODE2Nzg4MDEzNjQxIiwiZW1haWwiOiJrYXJ0aWNrLmRleTE5OTVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJwb2FRYjJ2TWNzeVAxQ05ta0xWVVpBIiwibmFtZSI6IktBUlRJQ0sgREVZIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdqaXZ4MkxHN2RMUjU4RVRBTTAyNllOdUNXaVdILW5HZUFyNDFmb3F3PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IktBUlRJQ0siLCJmYW1pbHlfbmFtZSI6IkRFWSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTkwNzM5ODA0LCJleHAiOjE1OTA3NDM0MDQsImp0aSI6ImY2ZjEzYjQyZmNhMjhkZjNmNDIyMjNlNTIzNDg4NjhmZWQ5YzJhMDUifQ.QfGwJI2EdWQ7UdqIA6EiRhdHTQmvaSw22g1eQlw4VoYgUzShEXGID7yby73TwqYTn4vdfBintqjK71oENGK0ad19PW1sRhltEr_9henI18cpvo85qxJz0DN1W_9wAro_02nbqWnEKohovurIvoAfuV6FV4gETKz4GRVbU7GxBrCDe1fUmnMkHUtfgrRL8LOX14-eKEL-PhPFbl9V9vXGX700287pd0RtbZUkujQKlZl63ARn8yxzvNTaLTmlbDMKk4ydNGJ7xT_L4xO7yJp-EE0KuuopsG4CUTXDREycZNAzNbe_qW8Fzt195HTWYwCsm1r3vZsS0NQ5yJ8-G_zynw"
// lastName: "DEY"
// name: "KARTICK DEY"
// photoUrl: "https://lh3.googleusercontent.com/a-/AOh14Gjivx2LG7dLR58ETAM026YNuCWiWH-nGeAr41foqw=s96-c"
// provider: "GOOGLE"

///--------------Facebook----------------

// authToken: "EAACxwVriP48BAHwBsTCuqDZAl70uibDryZAh6fpxv3fWFuWefY2zVZCQOpwZA7QPwTmAwhC0KvW5gVHfWtNHdZC9282qyMTQG9mols1IIclLbnNGraz7g7YjvJg0iOE4QIoghO26JiD0wvRr1NjJj5QwqXZCO4pC9prVEyR9FW5ZAhwTtuFHI8qO7eNbvLxZAlBS7pvGezdbeAZDZD"
// email: "kartickdeykd3@gmail.com"
// facebook:
// email: "kartickdeykd3@gmail.com"
// first_name: "Kartick"
// id: "2799539250267422"
// last_name: "KD"
// name: "Kartick Dey KD"
// picture: { data: { … } }
// __proto__: Object
// firstName: "Kartick"
// id: "2799539250267422"
// lastName: "KD"
// name: "Kartick Dey KD"
// photoUrl: "https://graph.facebook.com/2799539250267422/picture?type=normal"
// provider: "FACEBOOK"
