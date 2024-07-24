import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayersCreatePage } from './layers-create.page';

describe('LayersCreatePage', () => {
  let component: LayersCreatePage;
  let fixture: ComponentFixture<LayersCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LayersCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
