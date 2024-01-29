import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
    movies: any[] = [];
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


    /**
    * This will add a movie to the user's list of favorites
    * @param id 
    * @returns success message
    */
    addFavorite(id: string): void {
        this.fetchApiData.addFavMovie(id).subscribe(
      () => {
         this.snackBar.open('Added to favorite list', 'OK', {
          duration: 2000
         })
      })
    }
}
