import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllProductosPage } from './all-productos.page';

describe('AllProductosPage', () => {
  let component: AllProductosPage;
  let fixture: ComponentFixture<AllProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
