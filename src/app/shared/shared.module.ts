import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeeTitlePipe } from './CustomPipe/employeeTitle.pipe';
import { EmployeeFilterPipe } from './CustomPipe/employee-filter.pipe';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
    declarations: [
        EmployeeTitlePipe,
        EmployeeFilterPipe,
        LoadingSpinnerComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        LoadingSpinnerComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        EmployeeTitlePipe,
        EmployeeFilterPipe,
    ]
})

export class SharedModule {}