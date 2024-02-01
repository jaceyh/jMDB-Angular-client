import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'

import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';
import { UserUpdateFormComponent } from '../user-update-form/user-update-form.component'

type User = {
    _id?: string;
    username?: string;
    password?: string;
    email?: string;
    favoriteMovies?: [];
  };

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})

export class UserProfileComponent implements OnInit {
    
    user: User = {};

    @Input() userData = {Username: '', Password: '', Email: ''};

    constructor(
        public fetchApiData: FetchApiDataService,
        public router: Router,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        public expansionPanel: MatExpansionModule,
    ) { }

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
    // Populates User Info


    // This function will open the dialog when the update button is clicked
    openUpdateUserDialog(): void {
        this.dialog.open(UserUpdateFormComponent, {
            width: '280px'
        });
    }

    /**
    * This method will update the user's data
    * @returns user's data
    * @returns updated user's data saved to local storage
    * @returns user notified of success
    * @returns user notified of error

    updateUser(): void {
        this.fetchApiData.updateUser(this.userData).subscribe((result) => {
            console.log(result);
            localStorage.setItem('user', JSON.stringify(result));
            this.user = result;
            this.snackBar.open('Data successfully updated!', 'OK', {
                duration: 2000,
            });
        });
    }
        */

    /**
     * This method will delete the user's account
     * @returns confirmation prompt
     * @returns user's account deleted
     * @returns user navigated to welcome page
     * @returns user notified of success
     * @returns user notified of error
     * @returns user token and user details removed from local storage
     */

    deleteUser(): void {
        if(confirm('Are you sure you want to permanently delete your account?')) {
            this.router.navigate(['welcome']).then(() => {
                localStorage.clear();
                this.snackBar.open('Your account has been deleted', 'OK', {
                    duration: 3000
                });
            })
            this.fetchApiData.deleteUser(this.userData).subscribe((result) => {
                console.log(result);
            });
        }
    }
}