import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PaymentCancelPage } from './payment-cancel.page';
import { TranslateService } from '@ngx-translate/core';

describe('PaymentCancelPage', () => {
   let fixture: ComponentFixture<PaymentCancelPage>;
  let component: PaymentCancelPage;
  
  const routerMock = {
    navigate : vi.fn(),
  };
  const translateServiceMock = {
  instant: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [PaymentCancelPage],
      providers: [
        {provide: Router,useValue: routerMock},
        {provide: TranslateService,useValue: translateServiceMock}
      ],
    }).compileComponents();
     fixture = TestBed.createComponent(PaymentCancelPage);
     component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to products when continueShopping is called', () => {
    component.continueShopping();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });
   
  it('should navigate to payment when tryAgain is called', () => {
    component.tryAgain();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/checkout/payment']);
  });

});
