import { Component, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { IonInput } from '@ionic/angular/lazy';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
})
export class PasswordComponent {
    @ContentChild(IonInput) input: IonInput;
    public showPassword = false;

    constructor() { }

    toggleShow() {
        this.showPassword = !this.showPassword;
        this.input.type = this.showPassword ? 'text' : 'password';
    }
}
