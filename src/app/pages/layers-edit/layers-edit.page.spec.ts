import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayersEditPage } from './layers-edit.page';

describe('LayersEditPage', () => {
  let component: LayersEditPage;
  let fixture: ComponentFixture<LayersEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LayersEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
