import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteSearchComponent } from './activite-search.component';

describe('ActiviteSearchComponent', () => {
  let component: ActiviteSearchComponent;
  let fixture: ComponentFixture<ActiviteSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiviteSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
