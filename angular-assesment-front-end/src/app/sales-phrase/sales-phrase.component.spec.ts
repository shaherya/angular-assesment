import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPhraseComponent } from './sales-phrase.component';

describe('SalesPhraseComponent', () => {
  let component: SalesPhraseComponent;
  let fixture: ComponentFixture<SalesPhraseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPhraseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
