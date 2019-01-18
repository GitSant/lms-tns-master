import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  })
};

@Injectable({
  providedIn: "root"
})
export class LeaveService {
  constructor(private http: HttpClient) { }

  getLeaveBalance(employeeId: number, year: string): Observable<any> {
    var url = "https://tekysportalapiqa.azurewebsites.net/api/Leaves/GetLeaveBalance?employeeId=" + employeeId + "&Year=" + year;
    return this.http.get(url)
      .pipe(map(this.extractResponse),
        catchError(this.handleError<any>("LeaveBalanceError")));
  }

  getAllYears(): Observable<any> {
    var url = "https://tekysportalapiqa.azurewebsites.net/api/Leaves/GetAllYears";
    return this.http.get(url)
      .pipe(map(this.extractResponse),
        catchError(this.handleError<any>("GetAllYearsError")));
  }

  getleavetypes(): Observable<any> {
    var url = "https://tekysportalapiqa.azurewebsites.net/api/Leaves/GetLeaveTypes";
    return this.http.get(url)
      .pipe(map(this.extractResponse),
        catchError(this.handleError<any>("GetLeaveTypesError")));
  }

  getavailableleaves(userid: string, leavetypeid: string): Observable<any> {
    var url = "https://tekysportalapiqa.azurewebsites.net/api/Leaves/GetAvailableLeaves?employeeId=" + userid + "&LeaveTypeId=" + leavetypeid;
    return this.http.get(url)
      .pipe(map(this.extractResponse),
        catchError(this.handleError<any>("GetAvailableLeavesError")));
  }
  private extractResponse(response: any) {
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
