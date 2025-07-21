import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeamarkViewPage } from './seamark-view.page';

describe('SeamarkViewPage', () => {
  let component: SeamarkViewPage;
  let fixture: ComponentFixture<SeamarkViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeamarkViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
