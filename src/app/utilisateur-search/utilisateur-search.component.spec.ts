import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurSearchComponent } from './utilisateur-search.component';

describe('UtilisateurSearchComponent', () => {
  let component: UtilisateurSearchComponent;
  let fixture: ComponentFixture<UtilisateurSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilisateurSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilisateurSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
