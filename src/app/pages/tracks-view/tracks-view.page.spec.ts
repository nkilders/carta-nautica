import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TracksViewPage } from './tracks-view.page';

describe('TracksViewPage', () => {
  let component: TracksViewPage;
  let fixture: ComponentFixture<TracksViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
