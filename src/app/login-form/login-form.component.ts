import { Component, Input, OnInit } from '@angular/core';

// import to close dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// import to make API call
import { FetchApiDataService } from '../fetch-api-data.service';

// import to display info to user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit {

    @Input() loginData = { Username: '', Password: ''};

constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    public snackBar: MatSnackBar) { }

    ngOnInit(): void {
        
    }

    loginUser(): void {
        this.fetchApiData.userLogin(this.loginData).subscribe((response) => {
            //logic for successful login goes here
            console.log(response);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            this.dialogRef.close();
            this.snackBar.open('User successfully logged in.', 'OK', {
                duration: 2000
            });
        }, (response) => {
            this.snackBar.open(response, 'OK', {
                duration: 2000
            });
        });
    }   
}
