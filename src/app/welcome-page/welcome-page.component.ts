import { Component, OnInit } from '@angular/core';
import { RegistrationFormComponent } from '../registration-form/registration-form.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent implements OnInit {
    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
    }

    // This is the function that will open the dialog when the signup button is clicked  
    openUserRegistrationDialog(): void {
        this.dialog.open(RegistrationFormComponent, {
            width: '280px'
        });
    }
    // This is the function that will open the dialog when the login button is clicked
    openUserLoginDialog(): void {
        this.dialog.open(LoginFormComponent, {
            width: '280px'
        });
    }
}
