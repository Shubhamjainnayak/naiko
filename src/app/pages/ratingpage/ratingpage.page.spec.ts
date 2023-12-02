import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingpagePage } from './ratingpage.page';

describe('RatingpagePage', () => {
  let component: RatingpagePage;
  let fixture: ComponentFixture<RatingpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
