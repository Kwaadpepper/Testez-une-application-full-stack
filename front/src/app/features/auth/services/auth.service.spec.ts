import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const pathService = 'api/auth'
  let authService: AuthService
  let httpClient: HttpClient

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    })

    authService = TestBed.inject(AuthService)
    httpClient = TestBed.inject(HttpClient)
  })

  it('should be created', () => {
    expect(authService).toBeTruthy()
  })

  it('should make a log in request', () => {
    // Arrange
    let loginRequest: LoginRequest = {
      email: "user@example.net",
      password: "superpassword"
    }
    jest.spyOn(httpClient, 'post')

    // Act
    const ouput = authService.login(loginRequest)

    // Assert
    expect(ouput).toBeDefined()
    expect(ouput).toBeInstanceOf(Observable)
    expect(httpClient.post).toHaveBeenCalledTimes(1)
    expect(httpClient.post).toHaveBeenCalledWith(`${pathService}/login`, loginRequest)
  })

  it('should make a register request', () => {
    // Arrange
    let registerRequest: RegisterRequest = {
      email: "user@example.net",
      firstName: "firstName",
      lastName: "lastName",
      password: "password"
    }
    jest.spyOn(httpClient, 'post')

    // Act
    const ouput = authService.register(registerRequest)

    // Assert
    expect(ouput).toBeDefined()
    expect(ouput).toBeInstanceOf(Observable)
    expect(httpClient.post).toHaveBeenCalledTimes(1)
    expect(httpClient.post).toHaveBeenCalledWith(`${pathService}/register`, registerRequest)
  })
})
