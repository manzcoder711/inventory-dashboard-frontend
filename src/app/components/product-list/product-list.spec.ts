import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ProductList } from './product-list';

describe('ProductList', () => {
  let fixture: ComponentFixture<ProductList>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });

    fixture = TestBed.createComponent(ProductList);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Fails the test if any request was made that the test didn't expect and answer.
  afterEach(() => httpMock.verify());

  it('should create and load products on init', () => {
    fixture.detectChanges(); // runs ngOnInit, which requests the product list

    // The fake backend never answers on its own, so the test answers the request.
    httpMock.expectOne(`${environment.apiUrl}/products`).flush([]);

    expect(fixture.componentInstance).toBeTruthy();
  });
});
