import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkersEditPage } from './markers-edit.page';

describe('MarkersEditPage', () => {
  let component: MarkersEditPage;
  let fixture: ComponentFixture<MarkersEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkersEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
