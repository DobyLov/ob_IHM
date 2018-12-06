import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PraticienDetailsComponent } from './praticien-details.component';

describe('PraticienDetailsComponent', () => {
  let component: PraticienDetailsComponent;
  let fixture: ComponentFixture<PraticienDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PraticienDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PraticienDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
