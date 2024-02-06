import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { TagDialogComponent } from '../tag-dialog/tag-dialog.component';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})

export class MovieCardComponent {
    movies: any[] = [];
    favorites: any[] = [];

    user: any = {}

    constructor(
        public fetchApiData: FetchApiDataService,
        public snackBar: MatSnackBar,
        public router: Router,
        public dialog: MatDialog
        ) { }
  
    ngOnInit(): void {
        this.getMovies();
    }
  
    getMovies(): void {
        this.fetchApiData.getAllMovies().subscribe((resp: any) => {
            this.movies = resp;
            console.log(this.movies);
            return this.movies;
      });
    }

    getMovieDetails(Name: string, Description: string): void {
        this.dialog.open(MovieDetailsDialogComponent, {
            data: {
                Name: Name,
                Description: Description,
            }
        })

    }

    getDirector(Name: string, Bio: string): void {
        this.dialog.open(DirectorDialogComponent, {
          data: {
            Name: Name,
            Bio: Bio,
          },
          width: '400px',
        });
    }

    getTag(Name: string, Description: string, Name2: string, Description2: string): void {
        this.dialog.open(TagDialogComponent, {
            data: [{
                Name: Name,
                Description: Description,
            },{
                Name: Name2,
                Description: Description2,
            }]
        })
    }

    //gets user data, returns user data
    getUser(): void {
        return JSON.parse(localStorage.getItem('user') || '{}');
    }


    /** 
    * Get user info and set favorites
    * @returns favorite movies selected by user
    * */
    getFavMovies(): void {
        this.user = this.fetchApiData.getUser();
        this.fetchApiData.getAllMovies().subscribe((response) => {
            console.log(response);
            if (response.user && response.user.FavMovies) {
                this.favorites = response.user.FavMovies;
            } else {
                this.favorites = []; // set empty array if data is null
            }
        }, 
        (error: any) => {
            console.error('Error fetching user data:', error);
            this.favorites = []; // set empty array on error
        }
        );
    }

    /**
    * Check if a movie is a user's favorite already
    * @param movieId
    * @returns boolean
    * */

    isFavoriteMovie(movieId: string): boolean {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.FavMovies.indexOf(movieId) >= 0;
    }

    public addFavorite(movieId: string): void {
        // movie is already a favorite movie, remove it
        if (this.isFavoriteMovie(movieId)) {
            this.removeFavorite(movieId);
        } else {
            this.fetchApiData.addFavMovie(movieId).subscribe(() => {
                this.snackBar.open('Added to favorite list', 'OK', {
                    duration: 2000
                })
                this.fetchApiData.getAllMovies();
            })             
        }
    }

    public removeFavorite(movieId: any): void {
        this.fetchApiData.deleteFavMovie(movieId).subscribe(
          () => {
            this.snackBar.open('Removed from favorite list', 'OK', {
              duration: 2000
            });
            this.fetchApiData.getAllMovies();
          }
        )
    }
}
