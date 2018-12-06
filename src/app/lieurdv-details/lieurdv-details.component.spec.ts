import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LieurdvDetailsComponent } from './lieurdv-details.component';

describe('LieurdvDetailsComponent', () => {
  let component: LieurdvDetailsComponent;
  let fixture: ComponentFixture<LieurdvDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LieurdvDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LieurdvDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
