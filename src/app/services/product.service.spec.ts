import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { ProductService } from './product.service';

const baseUrl = `${environment.apiUrl}/products`;

const product: Product = {
  id: 5,
  name: 'Wireless Mouse',
  description: null,
  sku: 'WM-1001',
  price: 19.99,
  quantityInStock: 80,
  category: 'Electronics',
  createdAt: '2026-09-13T13:53:14Z',
  updatedAt: null,
};

// What the form sends: everything except the server-owned fields.
const writeBody = {
  name: product.name,
  description: product.description,
  sku: product.sku,
  price: product.price,
  quantityInStock: product.quantityInStock,
  category: product.category,
};

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll GETs the product list', async () => {
    const result = firstValueFrom(service.getAll());

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([product]);

    expect(await result).toEqual([product]);
  });

  it('getById GETs a single product by id', async () => {
    const result = firstValueFrom(service.getById(5));

    const req = httpMock.expectOne(`${baseUrl}/5`);
    expect(req.request.method).toBe('GET');
    req.flush(product);

    expect(await result).toEqual(product);
  });

  it('create POSTs the new product and returns what the server saved', async () => {
    const result = firstValueFrom(service.create(writeBody));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(writeBody);
    req.flush(product, { status: 201, statusText: 'Created' });

    expect(await result).toEqual(product);
  });

  it('update PUTs the changes to the product URL', async () => {
    const body = { id: 5, ...writeBody };
    const result = firstValueFrom(service.update(5, body));

    const req = httpMock.expectOne(`${baseUrl}/5`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(null, { status: 204, statusText: 'No Content' });

    await result;
  });

  it('delete sends DELETE to the product URL', async () => {
    const result = firstValueFrom(service.delete(5));

    const req = httpMock.expectOne(`${baseUrl}/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });

    await result;
  });

  // The form's inline SKU error relies on the 409 reaching it with the server's message intact.
  it('passes a 409 through to the caller with the server message', async () => {
    const result = firstValueFrom(service.create(writeBody));

    httpMock
      .expectOne(baseUrl)
      .flush(
        { message: "SKU 'WM-1001' is already in use." },
        { status: 409, statusText: 'Conflict' },
      );

    await expect(result).rejects.toMatchObject({
      status: 409,
      error: { message: "SKU 'WM-1001' is already in use." },
    });
  });
});
