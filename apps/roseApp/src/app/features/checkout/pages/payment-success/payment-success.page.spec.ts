import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CheckCheckoutSessionResponseModel } from '../../models/payment/check-checkout-session-response.model';
import { PaymentService } from '../../services/payment.service';
import { PaymentSuccessPage } from './payment-success.page';
import { TranslateService } from '@ngx-translate/core';


describe('PaymentSuccessPage', () => {
  let fixture: ComponentFixture<PaymentSuccessPage>;
  let component: PaymentSuccessPage;
  
  const routerMock = {
    navigate : vi.fn(),
  };
  const paymentServiceMock = {
  checkCheckoutSession: vi.fn(),
};
const activatedRouteMock = {
  snapshot: {
    queryParamMap: {
      get: vi.fn(),
    }
  }
};
const translateServiceMock = {
  instant: vi.fn(),
};
const mockOrderDetailsResponse :CheckCheckoutSessionResponseModel= {
      status: true,
      code: 200,
      payload: {
        sessionId: "cs_test_a1b2c3",
        paymentStatus: "paid",
        sessionStatus: "complete",
        amountTotal: 115,
        currency: "usd",
        order: {
         orderId: "9403eda9-83c9-4251-be22-7bc80c4e2918",
         paymentStatus: "SUCCEEDED"
    }
  }
};
const errorResponse = {
    status: false,
    code: 0,
    message: 'string',
    errors: [
      {
        path: 'string',
        message: 'string',
        messages: ['string'],
      },
    ],
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [PaymentSuccessPage,
         
      ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: PaymentService, useValue: paymentServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TranslateService, useValue: translateServiceMock },
      ]
      
    })
      
      .compileComponents();

    fixture = TestBed.createComponent(PaymentSuccessPage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /checkout/payment if session_id is not present', () => {
    activatedRouteMock.snapshot.queryParamMap.get.mockReturnValue(null);
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/checkout/payment']);
  });

  it('should check checkout session if session_id is present', () => {
    activatedRouteMock.snapshot.queryParamMap.get.mockReturnValue('test-session-id');
    paymentServiceMock.checkCheckoutSession.mockReturnValue(
      of(mockOrderDetailsResponse)
    );
    component.ngOnInit();
    expect(paymentServiceMock.checkCheckoutSession).toHaveBeenCalledWith('test-session-id');
  });
  
  it('should set amountTotal when payment is successful',()=>{
    activatedRouteMock.snapshot.queryParamMap.get.mockReturnValue('test-session-id');
    paymentServiceMock.checkCheckoutSession.mockReturnValue(
      of(mockOrderDetailsResponse)
    );
    component.ngOnInit();
    expect(component.amountTotal).toBe(115);
  })

  it('should navigate to cancel when checking checkout session fails', () => {
    activatedRouteMock.snapshot.queryParamMap.get.mockReturnValue('test-session-id');
    paymentServiceMock.checkCheckoutSession.mockReturnValue(
      throwError(() => errorResponse)
    );
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/checkout/cancel']);
  });

  it('should navigate to products when continue shopping is clicked', () => {
  component.continueShopping();

  expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should navigate to order when view orders is clicked', () => {
    component.viewOrders();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/order']);
  });


  

    


  
  
  

  
});