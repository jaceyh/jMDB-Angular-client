import { Component, Input, OnInit } from '@angular/core';

// import to close dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// import to make API call
import { FetchApiDataService } from '../fetch-api-data.service';

// import to display info to user
import { MatSnackBar } from '@angular/material/snack-bar';

// import router to point to MovieCardComponent
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit {

    @Input() userData = { Username: '', Password: ''};

constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
) { }

    ngOnInit(): void {
        
    }

    loginUser(): void {
        this.fetchApiData.userLogin(this.userData).subscribe((response) => {
            //logic for successful login goes here
            console.log(response);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);

            this.dialogRef.close();
            this.snackBar.open('User successfully logged in.', 'OK', {
                duration: 2500
            });
            // successful login done
            this.router.navigate(['movies']);
        }, (response) => {
            this.snackBar.open(response, 'OK', {
                duration: 2500
            });
        });
    }   
}
