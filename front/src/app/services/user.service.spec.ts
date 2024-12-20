import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

describe('UserService', () => {
  const pathService = 'api/user'
  let userService: UserService
  let httpClient: HttpClient

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    })

    httpClient = TestBed.inject(HttpClient)
    userService = TestBed.inject(UserService)
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  })

  it('should get by id', () => {
    // Arrange
    const userId = 1;
    jest.spyOn(httpClient, 'get')

    // Act
    const output = userService.getById(String(userId))

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.get).toHaveBeenCalledTimes(1)
    expect(httpClient.get).toHaveBeenCalledWith(`${pathService}/${userId}`)
  })

  it('should delete by id', () => {
    // Arrange
    const userId = 1;
    jest.spyOn(httpClient, 'delete')

    // Act
    const output = userService.delete(String(userId))

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.delete).toHaveBeenCalledTimes(1)
    expect(httpClient.delete).toHaveBeenCalledWith(`${pathService}/${userId}`)
  })
})
