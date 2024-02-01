import { Component, Input, OnInit } from '@angular/core';

import { EmailValidator } from '@angular/forms';

//import to close dialog on success
import { MatDialogRef } from '@angular/material/dialog';

//import to make API call
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

type User = {
    _id?: string;
    username?: string;
    password?: string;
    email?: string;
    favoriteMovies?: [];
};

@Component({
  selector: 'app-user-update-form',
  templateUrl: './user-update-form.component.html',
  styleUrl: './user-update-form.component.scss'
})

export class UserUpdateFormComponent implements OnInit {
    user: User = {};

    @Input() userData = { Username: '', Password: '', Email: ''}

    constructor(
        public fetchApiData: FetchApiDataService,
        public dialogRef: MatDialogRef<UserUpdateFormComponent>,
        public snackBar: MatSnackBar,
        public router: Router,
    ){}

    ngOnInit(): void {
        const user = this.getUser();
        console.log(user);

        if (!user._id) {
            this.router.navigate(['welcome']);
            return;
        }

        this.user = user;
        this.userData = {
            Username: user.username || '',
            Email: user.email || '',
            Password: '',
        };
    }

    // gets user data, returns user data
    getUser(): User {
        return JSON.parse(localStorage.getItem('user') || '{}');
    }

    updateUser(): void {
        this.fetchApiData.updateUser(this.userData).subscribe((result)=> {
            console.log(result);
            localStorage.setItem('user', JSON.stringify(result));
            console.log(result);
            this.user = result;
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
