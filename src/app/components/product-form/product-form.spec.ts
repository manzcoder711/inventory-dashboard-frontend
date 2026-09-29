import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../shared/toast/toast.service';
import { ProductForm } from './product-form';

describe('ProductForm', () => {
  let fixture: ComponentFixture<ProductForm>;
  let httpMock: HttpTestingController;

  const el = <T extends HTMLElement = HTMLElement>(selector: string) =>
    (fixture.nativeElement as HTMLElement).querySelector<T>(selector);

  const submitButton = () => el<HTMLButtonElement>('button[type="submit"]')!;

  // Types into a real input the way a user would, so the reactive form picks it up.
  const type = (selector: string, value: string) => {
    const input = el<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });

    fixture = TestBed.createComponent(ProductForm);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should create in "add" mode without loading anything', () => {
    fixture.detectChanges(); // no :id in the route, so ngOnInit makes no request

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.productId()).toBeNull();
  });

  it('shows a 409 inline under the SKU field and stays on the form', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    vi.spyOn(console, 'error').mockImplementation(() => undefined); // the component logs the error
    fixture.detectChanges();

    type('#name', 'Duplicate Mouse');
    type('#sku', 'WM-1001');
    type('#price', '5');
    type('#quantityInStock', '1');
    submitButton().click();

    httpMock
      .expectOne(`${environment.apiUrl}/products`)
      .flush(
        { message: "SKU 'WM-1001' is already in use." },
        { status: 409, statusText: 'Conflict' },
      );
    await fixture.whenStable();

    // The server's message, next to the field, wired up for screen readers (Story 2.4).
    const sku = el<HTMLInputElement>('#sku')!;
    expect(el('#sku-error')?.textContent?.trim()).toBe("SKU 'WM-1001' is already in use.");
    expect(sku.getAttribute('aria-invalid')).toBe('true');
    expect(sku.getAttribute('aria-describedby')).toBe('sku-error');

    // Not treated as a generic failure, and not as a success.
    expect(el('.form-error')).toBeNull();
    expect(TestBed.inject(ToastService).toasts()).toEqual([]);
    expect(navigate).not.toHaveBeenCalled();
    expect(submitButton().disabled).toBe(false);

    // Editing the SKU clears the server error.
    type('#sku', 'WM-1002');
    await fixture.whenStable();
    expect(el('#sku-error')).toBeNull();
    expect(sku.getAttribute('aria-invalid')).toBeNull();
  });
});
