import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationSearchComponent } from './prestation-search.component';

describe('PrestationSearchComponent', () => {
  let component: PrestationSearchComponent;
  let fixture: ComponentFixture<PrestationSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestationSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
