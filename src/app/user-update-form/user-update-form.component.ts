import { Component, Input, OnInit } from '@angular/core';

import { EmailValidator } from '@angular/forms';

//import to close dialog on success
import { MatDialogRef } from '@angular/material/dialog';

//import to make API call
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-update-form',
  templateUrl: './user-update-form.component.html',
  styleUrl: './user-update-form.component.scss'
})
export class UserUpdateFormComponent implements OnInit {

    @Input() userData = { Username: '', Password: '', Email: ''} 

    constructor(
        public fetchApiData: FetchApiDataService,
        public dialogRef: MatDialogRef<UserUpdateFormComponent>,
        public snackBar: MatSnackBar,
        public router: Router,
        public name: string,
        public password: string,
        public email: EmailValidator, 
    ){}

    ngOnInit(): void {
        
    }

    updateUser(): void {
        this.fetchApiData.updateUser(this.userData).subscribe((response)=> {
            console.log(response);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.dialogRef.close();
            this.snackBar.open('User successfully updated.', 'OK', {
                duration: 2500
            });
            ///successful update done
            this.router.navigate(['profile']);
        }, (response) => {
            this.snackBar.open(response, 'OK', {
                duration: 2000
            });
        });
    }
}
