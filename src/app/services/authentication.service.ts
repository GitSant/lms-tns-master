import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { User } from "../models/user.model";

const endpoint = "api/Employee/ValidateEmployee";
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  // login functionality
  login(user: User): Observable<any> {
    const credentials = {
      EmployeeMailId: user.email,
      Password: user.password
    };

    return this.callLoginValidateApiPost(credentials);
  }

  private callLoginValidateApiPost(credentials: any): Observable<Response> {
    return this.http
      .post<any>(endpoint, JSON.stringify(credentials), httpOptions)
      .pipe(map(this.extractLoginResponse),
      catchError(this.handleError<any>("validatelogin"))
      );
  }

  private extractLoginResponse(response: Response) {
    return response;
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
