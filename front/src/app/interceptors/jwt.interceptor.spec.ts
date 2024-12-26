import { HttpEvent, HttpRequest, HttpResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { expect } from '@jest/globals';
import { Observable, of } from "rxjs";

import { SessionService } from "../services/session.service";
import { JwtInterceptor } from "./jwt.interceptor";

describe('JwtInterceptor', () => {
  let jwtInterceptor: JwtInterceptor

  const mockSessionService = {
    isLogged: false,
    sessionInformation: {
      admin: true,
      token: 'token'
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{
        provide: SessionService, useValue: mockSessionService
      }],
    });

    jwtInterceptor = TestBed.inject(JwtInterceptor)
  })

  it('should create', () => {
    expect(jwtInterceptor).toBeTruthy()
  })

  it('should not intercept if not logged in', (done) => {
    // Arrange
    const url = '/api/anycall';
    const mockHandler = {
      handle: (req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => of(new HttpResponse(req))
    };
    mockSessionService.isLogged = false;
    const spy = jest.spyOn(mockHandler, 'handle');

    // Act
    jwtInterceptor.intercept(new HttpRequest('GET', url), mockHandler).subscribe(() => {

      // Assert
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          headers: {
            headers: new Map(),
            lazyUpdate: null,
            normalizedNames: new Map()
          }
        })
      )
      done()

    })
    expect.assertions(1)
  })

  it('should intercept if logged in', (done) => {
    // Arrange
    const url = '/api/anycall';
    const token = 'token';
    const mockHandler = {
      handle: (req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => of(new HttpResponse(req))
    };
    mockSessionService.isLogged = true;
    mockSessionService.sessionInformation.admin = true;
    mockSessionService.sessionInformation.token = 'token';
    const spy = jest.spyOn(mockHandler, 'handle');

    // Act
    jwtInterceptor.intercept(new HttpRequest('GET', url), mockHandler).subscribe(() => {

      // Assert
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          headers: {
            headers: new Map(),
            "lazyInit": {'headers': new Map(), 'lazyUpdate': null, 'normalizedNames': new Map()},
            lazyUpdate: [{'name': 'Authorization', 'op': 's', 'value': `Bearer ${token}`}],
            normalizedNames: new Map()
          }
        })
      )
      done()

    })
    expect.assertions(1)
  })
})
