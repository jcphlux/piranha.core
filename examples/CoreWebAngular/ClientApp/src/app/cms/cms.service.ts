import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CmsService {
private controlerUrl: string
  constructor(private http: Http) {

  }

  getSiteMap(id: string): Observable<any> {
    const url: string = `${this.controlerUrl}/sitemap?id=${id}`;
    return this.http.get(url)
      .pipe(map(res => res.json()),
        catchError(this.handleError));
  }

  getArchive(id: string, year: number = null, month: number = null, page: number = null, category: string = null, tag: string = null): Observable<any> {
    const url: string = `${this.controlerUrl}/archive?id=${id}&year=${year}&month=${month}&page=${page}&category=${category}&tag=${tag}`;
    return this.http.get(url)
      .pipe(map(res => res.json()),
        catchError(this.handleError));
  }

  getPage(id: string): Observable<any> {
    const url: string = `${this.controlerUrl}/page?id=${id}`;
    return this.http.get(url)
      .pipe(map(res => res.json()),
        catchError(this.handleError));
  }

  getPost(id: string): Observable<any> {
    const url: string = `${this.controlerUrl}/post?id=${id}`;
    return this.http.get(url)
      .pipe(map(res => res.json()),
        catchError(this.handleError));
  }

  getTeaserPage(id: string): Observable<any> {
    const url: string = `${this.controlerUrl}/teaserpage?id=${id}`;
    return this.http.get(url)
      .pipe(map(res => res.json()),
        catchError(this.handleError));
  }

  getImgUrl(id: string, size: number): Observable<string> {
    const url: string = `${this.controlerUrl}/imgurl?id=${id}&size=${size}`;
    return this.http.get(url)
      .pipe(map(res => res.json()),
        catchError(this.handleError));
  }

  private handleError(error: any) {
    let applicationError = error.headers.get('Application-Error');

    // either applicationError in header or model error in body
    if (applicationError) {
      return Observable.throw(applicationError);
    }

    let modelStateErrors: string = '';
    let serverError = error.json();

    if (!serverError.type) {
      for (let key in serverError) {
        if (serverError.hasOwnProperty(key)) {
          if (serverError[key]) {
            modelStateErrors += serverError[key] + '\n';
          }
        }
      }
    }

    modelStateErrors = modelStateErrors === '' ? null : modelStateErrors;
    return Observable.throw(modelStateErrors || 'Server error');
  }
}
