import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreSearchComponent } from './genre-search.component';

describe('GenreSearchComponent', () => {
  let component: GenreSearchComponent;
  let fixture: ComponentFixture<GenreSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
