import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationAddComponent } from './prestation-add.component';

describe('PrestationAddComponent', () => {
  let component: PrestationAddComponent;
  let fixture: ComponentFixture<PrestationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
