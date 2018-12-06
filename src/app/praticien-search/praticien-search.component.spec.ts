import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PraticienSearchComponent } from './praticien-search.component';

describe('PraticienSearchComponent', () => {
  let component: PraticienSearchComponent;
  let fixture: ComponentFixture<PraticienSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PraticienSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PraticienSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
