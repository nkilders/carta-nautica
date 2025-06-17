import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TracksEditPage } from './tracks-edit.page';

describe('TracksEditPage', () => {
  let component: TracksEditPage;
  let fixture: ComponentFixture<TracksEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
