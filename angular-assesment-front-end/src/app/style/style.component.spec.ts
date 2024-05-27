import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelStyleComponent } from './style.component';

describe('StyleComponent', () => {
  let component: FunnelStyleComponent;
  let fixture: ComponentFixture<FunnelStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunnelStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunnelStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
