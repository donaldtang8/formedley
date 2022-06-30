import { Directive, EventEmitter, Output, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[appAlert]'
})

export class AlertDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}