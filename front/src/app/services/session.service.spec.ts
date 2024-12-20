import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let sessionService: SessionService

  const mockSessionInformation: SessionInformation = {
    token: "token",
    type: "type",
    id: 1,
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    admin: false
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});

    sessionService = TestBed.inject(SessionService);
  })

  it('should be created', () => {
    expect(sessionService).toBeTruthy();
  })

  it('should log in', () => {
    // Arrange
    let observedIsLogged = false
    sessionService.isLogged = observedIsLogged
    sessionService.$isLogged().subscribe({
      next(v) {
        observedIsLogged = v
      }
    })

    // Act
    sessionService.logIn(mockSessionInformation)

    // Assert
    expect(sessionService.isLogged).toBeTruthy()
    expect(sessionService.sessionInformation).toBe(mockSessionInformation)
    expect(observedIsLogged).toBeTruthy()
  })

  it('should log out', () => {
    // Arrange
    let observedIsLogged = true
    sessionService.isLogged = observedIsLogged
    sessionService.$isLogged().subscribe({
      next(v) {
        observedIsLogged = v
      }
    })

    // Act
    sessionService.logOut()

    // Assert
    expect(sessionService.isLogged).toBeFalsy()
    expect(sessionService.sessionInformation).toBeUndefined()
    expect(observedIsLogged).toBeFalsy()
  })
})
