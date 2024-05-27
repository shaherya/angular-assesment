import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignProductComponent } from './campaign-product.component';

describe('CampaignProductComponent', () => {
  let component: CampaignProductComponent;
  let fixture: ComponentFixture<CampaignProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
