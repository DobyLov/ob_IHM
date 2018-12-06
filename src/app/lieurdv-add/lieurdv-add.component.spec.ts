import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LieurdvAddComponent } from './lieurdv-add.component';

describe('LieurdvAddComponent', () => {
  let component: LieurdvAddComponent;
  let fixture: ComponentFixture<LieurdvAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LieurdvAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LieurdvAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
