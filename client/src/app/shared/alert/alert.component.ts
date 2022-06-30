import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-alert-component',
    templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
    @ViewChild('alert', { static: true }) alertComp: ElementRef;
    @Input() type: string;
    @Input() alertMessage: string;
    @Output() delete = new EventEmitter<any>();

    constructor(
        private renderer: Renderer2
    ) {
    }

    ngOnInit() {
        if (this.type) {
            console.log(this.alertComp);
            switch(this.type) {
                case 'danger': {
                    this.renderer.addClass(this.alertComp.nativeElement, 'text-red-700');
                    this.renderer.addClass(this.alertComp.nativeElement, 'bg-red-100');
                }
            }
        }
    }

    onClose() {
        this.delete.emit('close');
    }
}