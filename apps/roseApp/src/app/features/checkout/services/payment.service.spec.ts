import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BASE_URL_CONFIG } from '@org/auth';

import { PaymentService } from './payment.service';
import { CreateCheckoutSessionResponseModel } from '../models/payment/create-checkout-session-response.model';
import { CheckCheckoutSessionResponseModel } from '../models/payment/check-checkout-session-response.model';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpTestingController: HttpTestingController;

  const mockBaseUrlConfig = {
    apiUrl: 'https://api.example.test',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: BASE_URL_CONFIG,
          useValue: mockBaseUrlConfig,
        },
      ],
    });

    service = TestBed.inject(PaymentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a checkout session', () => {
    const orderId = '9403eda9-83c9-4251-be22-7bc80c4e2918';
    const mockResponse :CreateCheckoutSessionResponseModel = {
        status: true,
        code: 200,
        payload: {
          checkoutUrl: 'https://stripe.com',
          sessionId: 'cs_test_a1b2c3',
          expiresAt: '2026-08-28T12:00:00Z',
          reused: false
        }
    };

    service.createCheckoutSession(orderId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        
        
        
    });

    const expectedUrl = `${mockBaseUrlConfig.apiUrl}/payments/checkout-session`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ orderId });

    req.flush(mockResponse);
  });



  it('should check a checkout session', () => {
    const sessionId = 'cs_test_a1b2c3';
    const mockResponse : CheckCheckoutSessionResponseModel = {
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

    service.checkCheckoutSession(sessionId).subscribe((response)=>{
        expect(response).toEqual(mockResponse);
        
    });

    const expectedUrl = `${mockBaseUrlConfig.apiUrl}/payments/checkout-session`;
    const req = httpTestingController.expectOne(
      request =>
      request.url === expectedUrl &&
      request.method === 'GET'
    );
    expect(req.request.params.get('sessionId')).toBe(sessionId);

    req.flush(mockResponse);
});
});