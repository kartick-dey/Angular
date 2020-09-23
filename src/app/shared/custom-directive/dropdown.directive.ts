import {Directive, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {  
  // @ViewChild('dropdown-menu') dropDownMenu: ElementRef;
  dropDownMenu: HTMLElement;
  @HostListener('document:click', ['$event']) onClick(event: Event) {
    if (this.dropDownElement.nativeElement.classList.contains('show')) {
      this.renderer.removeClass(this.dropDownElement.nativeElement, 'show');
      // console.log("childNodes[0]", this.dropDownElement.nativeElement.childNodes[0]);      
      this.renderer.setAttribute(this.dropDownElement.nativeElement.childNodes[0], 'aria-expanded', 'false')
      this.renderer.removeClass(this.dropDownElement.nativeElement.childNodes[1], 'show')

    } else {
      this.renderer.addClass(this.dropDownElement.nativeElement, 'show')
      this.renderer.setAttribute(this.dropDownElement.nativeElement.childNodes[0], 'aria-expanded', 'true')
      this.renderer.addClass(this.dropDownElement.nativeElement.childNodes[1], 'show')
    }
  }
  // @HostListener('document:click', ['$event']) isOpen(event: Event) {
  //   if ( this.dropDownElement.nativeElement.contains(event.target) ) {
  //     // console.log(this.dropDownMenu);
  //     // this.renderer.addClass(this.dropDownMenu, 'show');      
  //     this.dropDownMenu.classList.toggle('show');
  //   } else {
  //     // this.renderer.removeClass(this.dropDownMenu, 'show');
  //     // console.log(( this.dropDownElement.nativeElement.contains(event.target)));      
  //     this.dropDownMenu.classList.remove('show');
      
  //   }
  // }

  constructor(private dropDownElement: ElementRef,
              private renderer: Renderer2) {
    
   }

  ngOnInit(): void {
    // this.dropDownMenu = this.dropDownElement.nativeElement.querySelector('.dropdown-menu');
    
  }
}



















































// https://stackoverflow.com/questions/41317473/bootstrap-4-in-angular-2-dropdown-not-working