import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { Observable } from 'rxjs';
import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  const pathService = 'api/teacher'
  let teacherService: TeacherService
  let httpClient: HttpClient

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    })

    httpClient = TestBed.inject(HttpClient)
    teacherService = TestBed.inject(TeacherService)
  })

  it('should be created', () => {
    expect(teacherService).toBeTruthy();
  })

  it('should get all', () => {
    // Arrange
    jest.spyOn(httpClient, 'get')

    // Act
    const output = teacherService.all()

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.get).toHaveBeenCalledTimes(1)
    expect(httpClient.get).toHaveBeenCalledWith(pathService)
  })

  it('should get by id', () => {
    // Arrange
    const teacherId = 1;
    jest.spyOn(httpClient, 'get')

    // Act
    const output = teacherService.detail(String(teacherId))

    // Assert
    expect(output).toBeDefined()
    expect(output).toBeInstanceOf(Observable)
    expect(httpClient.get).toHaveBeenCalledTimes(1)
    expect(httpClient.get).toHaveBeenCalledWith(`${pathService}/${teacherId}`)
  })
})
