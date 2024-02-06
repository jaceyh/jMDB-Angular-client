import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'

import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';
import { UserUpdateFormComponent } from '../user-update-form/user-update-form.component'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})

export class UserProfileComponent implements OnInit {
    
    user: any = {};
    movies: any[] = [];
    FavMovies: any[] = [];

    @Input() userData = {Username: '', Password: '', Email: '', Birthdate: '', FavMovies: [] };

    constructor(
        public fetchApiData: FetchApiDataService,
        public router: Router,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        public expansionPanel: MatExpansionModule,
    ) { }

    ngOnInit(): void {
        this.getProfile();
        //this.getFavMovies();
    }

    //gets user data, returns user data
    getUser(): void {
        return JSON.parse(localStorage.getItem('user') || '{}');
    }


    // Populates User Info
    getProfile(): void {
        this.user = this.fetchApiData.getUser();
        this.userData.Username = this.user.Username;
        this.userData.Password = this.user.Password;
        this.userData.Email = this.user.Email;
        this.userData.Birthdate = this.user.Birthdate;
        this.fetchApiData.getAllMovies().subscribe((response) => {
            this.FavMovies = response.filter((movie: any) => this.user.FavMovies.includes(movie._id));
        });
    }

    // this function will get all movies
    getMovies(): void {
        this.fetchApiData.getAllMovies().subscribe((resp: any) => {
            this.movies = resp;
            console.log(this.movies);
            return this.movies;
        });
    }


    // this function will get users' fav movies
    getFavMovies(): void {
        this.user = this.fetchApiData.getUser();
        this.userData.FavMovies = this.user.FavMovies;
        this.FavMovies = this.user.FavMovies;
        console.log('Fav Movies in getFavMovie', this.FavMovies);
    }

    // Function to check if movie is favMovie
    isFav(movie: any): any {
        const MovieID = movie._id;
        if (this.FavMovies.some((movie) => movie === MovieID)) {
          return true;
        } else {
          return false;
        }
    }

    removeFav(movieId: any): void {
        this.fetchApiData.deleteFavMovie(movieId).subscribe(
          () => {
            this.snackBar.open('Removed from favorite list', 'OK', {
              duration: 2000
            });
            this.getProfile();
          }
        )
    }



    // This function will open the dialog when the update button is clicked
    openUpdateUserDialog(): void {
        this.dialog.open(UserUpdateFormComponent, {
            width: '280px'
        });
    }

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
            this.fetchApiData.deleteUser().subscribe((result) => {
                console.log(result);
            });
        }
    }
}