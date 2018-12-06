import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PraticienAddComponent } from './praticien-add.component';

describe('PraticienAddComponent', () => {
  let component: PraticienAddComponent;
  let fixture: ComponentFixture<PraticienAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PraticienAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PraticienAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
