import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Observable } from 'rxjs';
import { Session } from '../interfaces/session.interface';
import { SessionApiService } from './session-api.service';

describe('SessionsService', () => {
  const pathService = 'api/session'
  let sessionsService: SessionApiService
  let httpClient: HttpClient

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    })

    httpClient = TestBed.inject(HttpClient)
    sessionsService = TestBed.inject(SessionApiService)
  })

  it('should be created', () => {
    expect(sessionsService).toBeTruthy();
  })

  it('should get all', () => {
    // Arrange
    jest.spyOn(httpClient, 'get')

    // Act
    const output = sessionsService.all()

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.get).toHaveBeenCalledTimes(1)
    expect(httpClient.get).toHaveBeenCalledWith(pathService)
  })

  it('should get a session details', () => {
    // Arrange
    const sessionId = 1
    jest.spyOn(httpClient, 'get')

    // Act
    const output = sessionsService.detail(String(sessionId))

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.get).toHaveBeenCalledTimes(1)
    expect(httpClient.get).toHaveBeenCalledWith(`${pathService}/${sessionId}`)
  })

  it('should delete a session', () => {
    // Arrange
    const sessionId = 1
    jest.spyOn(httpClient, 'delete')

    // Act
    const output = sessionsService.delete(String(sessionId))

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.delete).toHaveBeenCalledTimes(1)
    expect(httpClient.delete).toHaveBeenCalledWith(`${pathService}/${sessionId}`)
  })

  it('should participate to a session', () => {
    // Arrange
    const sessionId = 1
    const userId = 1
    jest.spyOn(httpClient, 'post')

    // Act
    const output = sessionsService.participate(String(sessionId), String(userId))

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.post).toHaveBeenCalledTimes(1)
    expect(httpClient.post).toHaveBeenCalledWith(`${pathService}/${sessionId}/participate/${userId}`, null)
  })

  it('should remove a participation from a session', () => {
    // Arrange
    const sessionId = 1
    const userId = 1
    jest.spyOn(httpClient, 'delete')

    // Act
    const output = sessionsService.unParticipate(String(sessionId), String(userId))

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.delete).toHaveBeenCalledTimes(1)
    expect(httpClient.delete).toHaveBeenCalledWith(`${pathService}/${sessionId}/participate/${userId}`)
  })

  it('should create a session', () => {
    // Arrange
    const newSession: Session = {
      name: "name",
      description: "description",
      date: new Date(),
      teacher_id: 1,
      users: []
    }
    jest.spyOn(httpClient, 'post')

    // Act
    const output = sessionsService.create(newSession)

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.post).toHaveBeenCalledTimes(1)
    expect(httpClient.post).toHaveBeenCalledWith(`${pathService}`, newSession)
  })

  it('should update a session', () => {
    // Arrange
    const sessionId = 1
    const existingSession: Session = {
      name: "name",
      description: "description",
      date: new Date(),
      teacher_id: 1,
      users: []
    }
    jest.spyOn(httpClient, 'put')

    // Act
    const output = sessionsService.update(String(sessionId), existingSession)

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.put).toHaveBeenCalledTimes(1)
    expect(httpClient.put).toHaveBeenCalledWith(`${pathService}/${sessionId}`, existingSession)
  })
})
