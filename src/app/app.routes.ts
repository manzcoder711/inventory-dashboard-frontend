import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductForm } from './components/product-form/product-form';
import { Login } from './auth/login/login';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: ProductList, canActivate: [authGuard] },
  { path: 'products/new', component: ProductForm, canActivate: [authGuard] },
  { path: 'products/:id/edit', component: ProductForm, canActivate: [authGuard] },
];
