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

    constructor(
        public fetchApiData: FetchApiDataService,
        public snackBar: MatSnackBar,
        public router: Router,
        public dialog: MatDialog
        ) { }
  
    ngOnInit(): void {
        const user = localStorage.getItem('user');
        if (!user) {
            this.router.navigate(['welcome']);
            return;
        }
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

    getFavMovies(): void {
        this.fetchApiData.getUser().subscribe((resp: any) => {
            console.log();
            if (resp.user && resp.user.FavMovies) {
                this.favorites = resp.user.FavMovies;
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

    addFavorite(movieId: string): void {
        this.fetchApiData.addFavMovie(movieId).subscribe(
      () => {
         this.snackBar.open('Added to favorite list', 'OK', {
          duration: 2000
         })
      })
    }

    // will check if movie is already in users' favorites
    isFavorite(movieId: string): boolean {
        return this.fetchApiData.isFavMovie(movieId)
    }

    removeFavorite(id: string): void {
        this.fetchApiData.deleteFavMovie(id).subscribe(
          () => {
            this.snackBar.open('Removed from favorite list', 'OK', {
              duration: 2000
            })
          }
        )
    }
}
