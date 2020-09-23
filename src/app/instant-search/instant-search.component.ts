import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { InstantSearchService } from '../instant-search.service';
import { RelatedSearch } from './related-search.model';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-instant-search',
  templateUrl: './instant-search.component.html',
  styleUrls: ['./instant-search.component.css']
})
export class InstantSearchComponent implements OnInit, OnDestroy {
  public searchForm: FormGroup;
  public relatedTopics: RelatedSearch[];
  public searchRelatedError: any;

  // private searchResultSubscription: Subscription;
  private inputValueSubscription: Subscription;

  constructor(private instantSearchService: InstantSearchService,
              private fb: FormBuilder) { }

  ngOnInit(){
    this.formCreation();
    this.inputValueSubscription = this.searchForm.get('searchBox').valueChanges
    .pipe(debounceTime(500),
          distinctUntilChanged(),
          switchMap((searchInput: string)=> this.instantSearchService.getRelatedTopic(searchInput)))
    .subscribe((searchResult: RelatedSearch[])=> {
      this.relatedTopics = [];
      this.relatedTopics = searchResult;
      // this.searchRelatedError = error;
      // // this.getSearchResult(InputFieldValue);      
    }, (error: any) => {
      this.searchRelatedError = ''
      this.searchRelatedError = error;
    })
    // Not use in ngOnInit. Need to create separete function for form creation
    // valueChanges, rxjs, Observable flattening, marging multiple observable
    // learn about more on rxjs
  };

  formCreation(): void {
    this.searchForm = this.fb.group({
      searchBox: ["", Validators.required]
    })
  }

  // getSearchResult(query: string): void {
  //   this.relatedTopics = [];
  //   this.searchRelatedError = '';
  //   this.searchResultSubscription = this.instantSearchService.getRelatedTopic(query).subscribe(
  //     (relatedTopics: RelatedSearch[]) => {this.relatedTopics = relatedTopics},
  //     (error: any) => {this.searchRelatedError = error;
  //     console.log(this.searchRelatedError);
  //     });
  //     //distincUntilChange(), switichMap(), concateMap(), mergeMap(), exhustMap() //flattening strategy
  // }
  onSubmit(): void { 
    const query = this.searchForm.get("searchBox").value;
    // this.getSearchResult(query);

  }

  ngOnDestroy() {
    // this.searchResultSubscription.unsubscribe();
    this.inputValueSubscription.unsubscribe();
  }



}
