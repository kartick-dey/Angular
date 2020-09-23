import { Component, OnInit } from '@angular/core';
import { Observable, of, from, observable } from 'rxjs';
import { Person } from './person.model';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
// import { resolve } from 'dns';

@Component({
  selector: 'app-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.css']
})
export class ObservableComponent implements OnInit {
  public loading: boolean;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.observable();
    // this.promise();

    //////// How to convert into Observable using "of" and "from" ////////////

    const person: Person = {
      name: "Kartick",
    }

    const personObs: Observable<Person> = of(person);
    personObs.subscribe(value => console.log("Simple Observable convertion : ",value));

    const personObs1: Observable<string> = of("KD")
    personObs1.subscribe(value => console.log("Simple Observable convertion : ",value));

    /// Promise to Observable

    const personPromise: Promise<Person> = Promise.resolve(person);
    const personObsFromPromise: Observable<Person> = from(personPromise);
    personObsFromPromise.subscribe(value => console.log("Promise to Observables : ",value));

    const personPromise1: Promise<string> = Promise.resolve("Kartick Dey");
    const personObsFromPromise1: Observable<string> = from(personPromise1);
    personObsFromPromise1.subscribe(value => console.log("Promise to Observables : ", value));


    /// """"Map Operator"""" - Map is used to manipulate the data. 
    /// We can use while creating the observable or subcribing the observables
    /// If you don't want to change the data then use """"Tap"""" operator

    const guy = of("kartick dey")
    .pipe(
      map(name => name.toUpperCase())
    ); // map will be reflected into all suscriber
    guy
    .pipe(
      map(name => name.toUpperCase())
    )
    .subscribe(value => console.log("Map used in subcription : ", value)); // Map is refelcted only ointo this subscriber
    
    
   /// """""Share operator"""""
   
    const request = this.getPost();
    this.setLoadingSpinner(request);

    // request.subscribe(data => console.log(data));

   ///// """"""SwitchMap() Operator""""""

   const postsObs = this.getPost();
   const commentsObs = this.getCommnets();

   const combineObs = postsObs.pipe(
     switchMap(posts => {
       return commentsObs
       .pipe(
         tap(comments => {
           console.log("Comments : ", comments);
           console.log("Posts : ", posts);
          })
       );
     })
   );

    combineObs.subscribe();
    

    
  
  
  }

  //// """""""Share Operator""""""" - to reduce multiple request send to the server

  public getPost(): Observable<any> {
    return this.http.get<any>("https://jsonplaceholder.typicode.com/posts")
    .pipe(share());
  }

  public setLoadingSpinner(observable: Observable<any>): void {
    this.loading = true;
    observable.subscribe(()=> this.loading = false)
  }

  public getCommnets(): Observable<string> {
    return of("Kartick");
  }


/////////////// Creating a Observable //////////////
  // public observable(): void {

  //   const observable = new Observable(observer => {
  //     let count = 0;
  //     const interval = setInterval(() => {
  //       observer.next(count++)
  //       console.log("Interval");        
  //     },1000);
  //     return () => {
  //       clearInterval(interval);
  //     }
  //   });

  //   const observableSub = observable.subscribe(value => console.log("I am from Observable......:", value));
  //   setTimeout(() => observableSub.unsubscribe(),5000);
        
  // }

  // public promise(): void {
  //   const promise = new Promise((resolve)=> {
  //     setTimeout(() => {
  //       console.log('I am from Promise.....');
        
  //     }, 3000);
  //   });

  //   promise.then();
  // }
  

}
