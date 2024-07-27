import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignsPage } from './signs.page';

describe('SignsPage', () => {
  let component: SignsPage;
  let fixture: ComponentFixture<SignsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
