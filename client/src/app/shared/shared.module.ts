import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { AlertDirective } from './alert/alert.directive';

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        AlertDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        AlertDirective,
        CommonModule
    ]
})

export class SharedModule {}