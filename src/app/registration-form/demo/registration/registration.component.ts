import { OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DemoComponent } from '../demo.component';

@Component({
    selector: 'app-register',
    templateUrl: './registration.component.html'
})
export class CustomerRegistrationComponent implements OnInit {

    @ViewChild('primaryAddress')
    private primaryAddress: DemoComponent;
    public custForm: FormGroup;
    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.custForm = this.fb.group({
            primaryAddress: new FormControl(),
        });
    }

    registerCusomer() {
        console.log(this.custForm.getRawValue());
        this.primaryAddress.saveAddress();
    }
}
