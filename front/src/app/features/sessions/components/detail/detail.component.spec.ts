import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';
import { firstValueFrom, lastValueFrom, Observable, of } from 'rxjs';

import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';

import { TeacherService } from 'src/app/services/teacher.service';
import { SessionService } from '../../../../services/session.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';


describe('DetailComponent', () => {
  let component: DetailComponent
  let fixture: ComponentFixture<DetailComponent>
  let sessionService: SessionService
  let sessionApiService: SessionApiService
  let sessionApiServiceDetails$: Observable<Session>
  let teacherService: TeacherService
  let teacherServiceDetails$: Observable<Teacher>

  const mockSessionInformation: Partial<SessionInformation> = {
    admin: true,
    id: 1
  }
  const mockTeacher: Teacher = {
    id: 1,
    lastName: "lastName",
    firstName: "firstName",
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const mockSession: Session = {
    id: mockSessionInformation.id,
    name: "name",
    description: "description",
    date: new Date(),
    teacher_id: mockTeacher.id,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatIconModule,
        MatCardModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService },
        { provide: SessionApiService },
      ],
    })
      .compileComponents()

    sessionService = TestBed.inject(SessionService)
    sessionService.sessionInformation = mockSessionInformation as SessionInformation

    sessionApiService = TestBed.inject(SessionApiService)

    sessionApiServiceDetails$ = of(mockSession)
    sessionApiService.detail = () => sessionApiServiceDetails$

    teacherService = TestBed.inject(TeacherService)
    teacherServiceDetails$ = of(mockTeacher)
    teacherService.detail = () => teacherServiceDetails$

    fixture = TestBed.createComponent(DetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should go back', () => {
    // Arrange
    window.history.back = jest.fn()

    // Act
    component.back()

    // Assert
    expect(component).toBeTruthy()
    expect(window.history.back).toBeCalled()
  })

  it('should fetch a session', async () => {
    // -- Arrange
    jest.spyOn(sessionApiService, 'detail')
    jest.spyOn(teacherService, 'detail')

    // Assert
    await firstValueFrom(sessionApiServiceDetails$)
    expect(component.session).toBe(mockSession)
    expect(component.isParticipate).toBeFalsy()
    await firstValueFrom(teacherServiceDetails$)
    expect(component.teacher).toBe(mockTeacher)
  })

  it('should delete a session', async () => {
    // -- Arrange
    const matSnackBar = TestBed.inject(MatSnackBar)
    const router = TestBed.inject(Router)
    const sessionApiServiceDelete$ = of('')

    matSnackBar.open = jest.fn() as typeof matSnackBar.open
    sessionApiService.delete = jest.fn(() => sessionApiServiceDelete$)
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true))

    // -- Act
    component.delete()

    // Assert
    expect(sessionApiService.delete).toHaveBeenCalled()

    await lastValueFrom(sessionApiServiceDelete$)
    expect(matSnackBar.open).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['sessions'])
  })

  it('should participate', async () => {
    // Arrange
    const participate$ = of('')
    sessionApiService.participate = () => participate$ as Observable<never>
    jest.spyOn(sessionApiService, 'participate')
    jest.spyOn(sessionApiService, 'detail')

    // Act
    component.participate()

    // Assert
    expect(sessionApiService.participate).toHaveBeenCalled()
    await firstValueFrom(participate$)
    expect(sessionApiService.detail).toHaveBeenCalled()
  })

  it('should remove participation', async () => {
    // Arrange
    const unParticipate$ = of('')
    sessionApiService.unParticipate = () => unParticipate$ as Observable<never>
    jest.spyOn(sessionApiService, 'unParticipate')
    jest.spyOn(sessionApiService, 'detail')

    // Act
    component.unParticipate()

    // Assert
    expect(sessionApiService.unParticipate).toHaveBeenCalled()
    await firstValueFrom(unParticipate$)
    expect(sessionApiService.detail).toHaveBeenCalled()
  })
})

