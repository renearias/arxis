import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireauthComponent } from './fireauth.component';

describe('FireauthComponent', () => {
  let component: FireauthComponent;
  let fixture: ComponentFixture<FireauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
