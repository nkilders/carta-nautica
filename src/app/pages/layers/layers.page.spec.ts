import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayersPage } from './layers.page';

describe('LayersPage', () => {
  let component: LayersPage;
  let fixture: ComponentFixture<LayersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LayersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
