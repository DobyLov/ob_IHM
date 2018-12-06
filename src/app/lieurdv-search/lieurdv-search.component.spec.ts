import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LieurdvSearchComponent } from './lieurdv-search.component';

describe('LieurdvSearchComponent', () => {
  let component: LieurdvSearchComponent;
  let fixture: ComponentFixture<LieurdvSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LieurdvSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LieurdvSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
