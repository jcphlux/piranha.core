import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Meta } from "@angular/platform-browser";
import { NavigationStart, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CmsService {
  public static url: string

  sitemapChanged: Subject<any> = new Subject<any>();
  modelChanged: Subject<any[]> = new Subject<any[]>();
  loadingChanged: Subject<boolean> = new Subject<boolean>();
  private errors: any;
  private sitemap: any;
  private model: any;
  private currentPage: string;

  constructor(private http: Http, private router: Router, private meta: Meta) {

    this.currentPage = router.url;

    this.getSiteMap()
      .subscribe((result) => this.onSuccessfulGetSiteMap(result),
        (errors: any) => this.onUnsuccessful(errors)
    );   

    router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.currentPage = val.url;
        console.log(this.currentPage);
        this.getModel();
      }
    });  
  }

  private getModel() {
    if (!this.sitemap || !this.currentPage)
      return;
    this.loadingChanged.next(true);

    let route = this.sitemap.find(route => {
      return route.Permalink === this.currentPage
    });
    if (route.PageTypeName === "Teaser Page") {
      this.getTeaserPage(route.Id)
        .subscribe((result) => this.onSuccessfulGetModel(result),
          (errors: any) => this.onUnsuccessful(errors),
        () => this.loadingChanged.next(false));
    } else if (route.PageTypeName === "Blog Archive") {
      this.getArchive(route.Id)
        .subscribe((result) => this.onSuccessfulGetModel(result),
          (errors: any) => this.onUnsuccessful(errors),
        () => this.loadingChanged.next(false));
    } if (route.PageTypeName === "Standard page") {
      this.getPage(route.Id)
        .subscribe((result) => this.onSuccessfulGetModel(result),
          (errors: any) => this.onUnsuccessful(errors),
        () => this.loadingChanged.next(false));
    }
  }

  private onSuccessfulGetSiteMap(result): void {
    this.sitemap = result;
    this.sitemapChanged.next(this.sitemap);
  }

  private onSuccessfulGetModel(result: any) {
    this.model = result;
    this.modelChanged.next([this.model, this.currentPage]);
  }

  private onUnsuccessful(result: any) {
    //this.errors = errors;
  }

  private getSiteMap(id: string = null): Observable<any> {
    const url: string = `${CmsService.url}/sitemap?id=${id}`;
    return this.http.get(url)
      .pipe(map(res => res.json()),
        catchError(this.handleError));
  }

  private getUrlId(url: string): string {
    //for (let route of this.sitemap) {
    //  if (route.Permalink === )
    //}
    return this.sitemap.find(route => {
      return route.Permalink === url
    }).Id;
  }

  private getArchive(id: string, year: number = null, month: number = null, page: number = null, category: string = null, tag: string = null): Observable<any> {
    const url: string = `${CmsService.url}/archive?id=${id}&year=${year}&month=${month}&page=${page}&category=${category}&tag=${tag}`;
    return this.http.get(url)
      .pipe(map(res => res.json()),
        catchError(this.handleError));
  }

  private getPage(id: string): Observable<any> {
    const url: string = `${CmsService.url}/page?id=${id}`;
    return this.http.get(url)
      .pipe(map(res => res.json()),
        catchError(this.handleError));
  }

  private getPost(id: string): Observable<any> {
    const url: string = `${CmsService.url}/post?id=${id}`;
    return this.http.get(url)
      .pipe(map(res => res.json()),
        catchError(this.handleError));
  }

  private getTeaserPage(id: string): Observable<any> {
    const url: string = `${CmsService.url}/teaserpage?id=${id}`;
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
