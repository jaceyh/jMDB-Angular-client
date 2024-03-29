import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators'

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://jmdb.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
    // Inject the HttpClient module to the constructor params
    // This will provide HttpClient to the entire class, making it available via this.http
    constructor(private http: HttpClient) { }
    
    // FUNCTIONS

    // Making the api call for the user registration endpoint
    // param: userDetails
    // returns: an observable with the user || user registered
    public userRegistration(userDetails: any): Observable<any> {
        console.log(userDetails);
        return this.http.post(apiUrl + 'users', userDetails).pipe(
            catchError(this.handleError)
        );
    }

    // Making the api call for the user login endpoint
    // params: userDetails
    // returns: an observable with the user || user logged in
    public userLogin(userDetails: any): Observable<any> {
        console.log(userDetails);
        return this.http.post(apiUrl + 'login', userDetails).pipe(
            catchError(this.handleError)
        );
    }

    // Making the api call for the movies endpoint
    // params: movies
    // returns: an observable with the array of movies
    // throws error
    getAllMovies(): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get<any>(apiUrl + 'movies', {
            headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
            })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }
  
    // Making the api call for the movie/name endpoint
    // params: name
    // returns: observable with movie object
    getMovie(name: any): Observable<any> {
        const token = localStorage.getItem('token');
        console.log(name);
        return this.http.post<any>(apiUrl + 'movies/', name, {
            headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
            })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    // Making the api call for the director/name endpoint
    // params: directorName
    // returns: observable with director object
    getDirector(directorName: any): Observable<any> {
        const token = localStorage.getItem('token');
        console.log(directorName);
        return this.http.post<any>(apiUrl + 'director/', directorName, {
            headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
            })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    // Making the api call for the genre endpoint
    // params: tagName
    // returns: observable with genre object
    getTag(tagName: any): Observable<any> {
        const token = localStorage.getItem('token');
        console.log(tagName);
        return this.http.post<any>(apiUrl + 'movies/tags/', tagName, {
            headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
            })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }


    // Making the api call for the get one user endpoint
    // params: username 
    // returns: an observable with a user object

    getUser(): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user;
    }

    // Making api call for the user's favorite movies endpoint
    // returns: an observable with a user object (favMovies included)
    getFavMovies(): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token')
        return this.http.get(apiUrl + 'users/' + user.Username, { 
            headers: new HttpHeaders(
                {
                Authorization: 'Bearer ' + token,
                })
            }).pipe(
            map(this.extractResponseData),
            map((data) => data.FavMovies),
            catchError(this.handleError)
        );
    }

    // Making api call to post to user's favorite movies endpoint
    // params: movieId
    // returns: an observable with a user object
    addFavMovie(movieId: string): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log(user);
        const token = localStorage.getItem('token');
        user.FavMovies.push(movieId);
        localStorage.setItem('user', JSON.stringify(user));
        return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, null, { 
            headers: new HttpHeaders(
                {
                Authorization: 'Bearer ' + token,
                }),
            responseType: "text"
            }).pipe(
                <any>(this.extractResponseData),
                catchError(this.handleError)
        );
    }

    public isFavMovie(movieId: string): boolean {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.FavMovies.indexOf(movieId) >= 0;
    }

    // Make the api call to edit user/:Username endpoint
    // params: username 
    // returns: an observable with a user object
    updateUser(updatedUser: any): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('User object inside updateUser:', user);

        const token = localStorage.getItem('token')

        return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, { headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
            })
        }).pipe(
            <any>(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    // Make the api call to delete user/:Username
    // params: username 
    // returns: an observable with a user object
    deleteUser(): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token')
        return this.http.delete(apiUrl + 'users/' + user.Username, { headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
            })
        }).pipe(
            <any>(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    // Make api call to delete a movie from favorite movies endpoint
    deleteFavMovie(movieID: any): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        console.log('user in deleteFavMovie:', user)
        console.log('in fetch api service:', movieID);
        user.FavMovies.splice(movieID);
        localStorage.setItem('user', JSON.stringify(user));
        return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/delete/' + movieID, {
            headers: new HttpHeaders(
                {
                Authorization: 'Bearer ' + token,
                }),
            responseType: "text"
        }).pipe(
            <any>(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    //ERROR Responses

    // Non-typed response extraction
    private extractResponseData(res: Response): any {
        const body = res;
        return body || {};
    }

    private handleError(error: HttpErrorResponse): any {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occured:', error.error.message);
        } else {
            console.error(`Error Status Code ${error.status}, ` + `Error body is: ${error.error}`);
        }
        return throwError(
            () => new Error ('Something bad happened; please try again later.'));
    }
}
