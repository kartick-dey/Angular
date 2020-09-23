import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RelatedSearch } from './instant-search/related-search.model';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class InstantSearchService {
  constructor(private http: HttpClient) { }

  getRelatedTopic(query: string): Observable<RelatedSearch[]>{
    return this.http.get<RelatedSearch[]>("https://api.duckduckgo.com/?q=" + query + "&format=json")
      .pipe(map(responseData => {
      const responseDataArray = [];
      for (let key in responseData) {
        if (responseData.hasOwnProperty(key) && key === "RelatedTopics") {
          responseDataArray.push(responseData[key])
        }
      }
      // console.log("responseDataArray", responseDataArray);      
      return responseDataArray;
    }), catchError(this.handleError))
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse instanceof ErrorEvent) {
      console.log("Client side : ", errorResponse.error);
    } else {
      console.log("Server side : ", errorResponse);
    }

    return throwError("No Search Result Found");
  }
 
}

