import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkersCreatePage } from './markers-create.page';

describe('MarkersCreatePage', () => {
  let component: MarkersCreatePage;
  let fixture: ComponentFixture<MarkersCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkersCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
