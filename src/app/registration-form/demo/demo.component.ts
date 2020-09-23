import { Component, ViewChild, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControlName, NgForm, FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-demo-address',
    templateUrl: './demo.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DemoComponent),
        multi: true
    }]
})
export class DemoComponent implements OnInit, ControlValueAccessor {

    @ViewChild('addForm')
    public addForm: FormControlName;
    @Input() parentForm: NgForm;
    public addressForm: FormGroup;
    // tslint:disable-next-line: variable-name
    private _address: any = {};
    constructor(
        private fb: FormBuilder,
    ) { }
    writeValue(obj: any): void {
        console.log(obj);
    }
    registerOnChange(fn: any): void {
        this.addressForm.valueChanges.subscribe(() => {
            fn(this.addressForm.value);
        });
    }
    registerOnTouched(fn: any): void {
        throw new Error('Method not implemented.');
    }
    setDisabledState?(isDisabled: boolean): void {
        throw new Error('Method not implemented.');
    }

    ngOnInit() {
        this.addressForm = this.fb.group({
            address1: ['', [Validators.required]],
            address2: [''],
            address3: [''],
            country: ['', [Validators.required]],
            state: ['', [Validators.required]],
            city: ['', [Validators.required]],
        });
    }

    saveAddress() {
        console.log(this._address);
        console.log(this.addressForm.getRawValue());
    }

    propagateChange = (_: any) => { };



}
