import { Component } from '@angular/core';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'jMDB-Angular-client';

  constructor(public dialog: MatDialog) { }
    // This is the function that will open the dialog when the signup button is clicked  
    openUserRegistrationDialog(): void {
        this.dialog.open(RegistrationFormComponent, {
            width: '280px'
        });
    }
    openUserLoginDialog(): void {
        this.dialog.open(LoginFormComponent, {
            width: '280px'
        });
    }
}
