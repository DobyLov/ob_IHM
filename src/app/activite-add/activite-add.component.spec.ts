import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteAddComponent } from './activite-add.component';

describe('ActiviteAddComponent', () => {
  let component: ActiviteAddComponent;
  let fixture: ComponentFixture<ActiviteAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiviteAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
