import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
  let httpTestingController: HttpTestingController

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
    users: [3],
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => 1,
      },
    },
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatIconModule,
        MatCardModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService },
        { provide: SessionApiService },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        }
      ],
    })
      .compileComponents()

    httpTestingController = TestBed.inject(HttpTestingController)

    sessionService = TestBed.inject(SessionService)
    sessionService.sessionInformation = mockSessionInformation as SessionInformation

    sessionApiService = TestBed.inject(SessionApiService)
    teacherService = TestBed.inject(TeacherService)

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
    sessionApiServiceDetails$ = of(mockSession)
    sessionApiService.detail = () => sessionApiServiceDetails$
    teacherServiceDetails$ = of(mockTeacher)
    teacherService.detail = () => teacherServiceDetails$
    jest.spyOn(sessionApiService, 'detail')
    jest.spyOn(teacherService, 'detail')

    // Act
    component.ngOnInit()

    // Assert
    await firstValueFrom(sessionApiServiceDetails$)
    expect(component.session).toBe(mockSession)
    expect(component.isParticipate).toBeFalsy()
    await firstValueFrom(teacherServiceDetails$)
    expect(component.teacher).toBe(mockTeacher)
  })

  it('should delete a session', async () => {
    // -- Arrange
    sessionApiServiceDetails$ = of(mockSession)
    sessionApiService.detail = () => sessionApiServiceDetails$
    teacherServiceDetails$ = of(mockTeacher)
    teacherService.detail = () => teacherServiceDetails$
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
    sessionApiServiceDetails$ = of(mockSession)
    sessionApiService.detail = () => sessionApiServiceDetails$
    teacherServiceDetails$ = of(mockTeacher)
    teacherService.detail = () => teacherServiceDetails$
    const participate$ = of('')
    sessionApiService.participate = () => participate$ as Observable<never>
    jest.spyOn(sessionApiService, 'participate')
    jest.spyOn(sessionApiService, 'detail')
    mockSession.users = [1, 3]

    // Act
    component.participate()

    // Assert
    expect(component.isParticipate).toBeTruthy()
    expect(sessionApiService.participate).toHaveBeenCalled()
    await firstValueFrom(participate$)
    expect(sessionApiService.detail).toHaveBeenCalled()
  })

  it('should remove participation', async () => {
    // Arrange
    sessionApiServiceDetails$ = of(mockSession)
    sessionApiService.detail = () => sessionApiServiceDetails$
    teacherServiceDetails$ = of(mockTeacher)
    teacherService.detail = () => teacherServiceDetails$
    const unParticipate$ = of('')
    sessionApiService.unParticipate = () => unParticipate$ as Observable<never>
    jest.spyOn(sessionApiService, 'unParticipate')
    jest.spyOn(sessionApiService, 'detail')
    mockSession.users = [3]

    // Act
    component.unParticipate()

    // Assert
    expect(component.isParticipate).toBeFalsy()
    expect(sessionApiService.unParticipate).toHaveBeenCalled()
    await firstValueFrom(unParticipate$)
    expect(sessionApiService.detail).toHaveBeenCalled()
  })

  it('should display session information IT', () => {
    // -- Arrange
    const divElement: HTMLElement = fixture.nativeElement
    mockActivatedRoute.snapshot.paramMap = {
      get: () => 1,
    }

    // Act
    httpTestingController.expectOne({
      url: 'api/session/1',
      method: 'GET'
    }).flush(mockSession)
    httpTestingController.expectOne({
      url: 'api/teacher/1',
      method: 'GET'
    }).flush(mockTeacher)

    fixture.detectChanges()

    // Assert
    expect((divElement!.querySelector('[data-test="teacher"]') as HTMLElement | null)!.textContent)
      .toBe(`${mockTeacher.firstName} ${mockTeacher.lastName.toUpperCase()}`)
    expect((divElement!.querySelector('[data-test-attendees=""]') as HTMLElement | null)!.textContent)
      .toBe(`${mockSession.users.length} attendees`)
    expect((divElement!.querySelector('[data-test-description=""]') as HTMLElement | null)!.textContent?.trim())
      .toBe(`Description: ${mockSession.description}`)
  })

  it('should display remove button if user is an admin IT', () => {
    // -- Arrange
    mockSessionInformation.admin = true
    mockSessionInformation.id = 1
    mockSession.users = [1]
    const divElement: HTMLElement = fixture.nativeElement
    mockActivatedRoute.snapshot.paramMap = {
      get: () => 1,
    }

    // Act
    httpTestingController.expectOne({
      url: 'api/session/1',
      method: 'GET'
    }).flush(mockSession)
    httpTestingController.expectOne({
      url: 'api/teacher/1',
      method: 'GET'
    }).flush(mockTeacher)

    fixture.detectChanges()

    // Assert
    expect((divElement!.querySelector('[data-test-delete=""]') as HTMLElement | null)).toBeTruthy()
  })

  it('should display participate button if a user is not participating IT', fakeAsync(() => {
    // -- Arrange
    component.isAdmin = false
    mockSessionInformation.id = 1
    mockSession.users = []
    const divElement: HTMLElement = fixture.nativeElement
    mockActivatedRoute.snapshot.paramMap = {
      get: () => 1,
    }

    // Act
    const getSessionsReqs = httpTestingController.expectOne({
      url: 'api/session/1',
      method: 'GET'
    }).flush(mockSession)
    httpTestingController.expectOne({
      url: 'api/teacher/1',
      method: 'GET'
    }).flush(mockTeacher)

    fixture.detectChanges()
    tick(1000)

    // Assert
    expect(component.isAdmin).toBeFalsy()
    expect(component.isParticipate).toBeFalsy()
    expect((divElement!.querySelector('button[data-test-participate=""]') as HTMLElement | null)).toBeTruthy()
  }))

  it('should display unparticipate button if a user is participating IT', fakeAsync(() => {
    // -- Arrange
    component.isAdmin = false
    mockSessionInformation.id = 1
    mockSession.users = [1]
    const divElement: HTMLElement = fixture.nativeElement
    mockActivatedRoute.snapshot.paramMap = {
      get: () => 1,
    }

    // Act
    httpTestingController.expectOne({
      url: 'api/session/1',
      method: 'GET'
    }).flush(mockSession)
    httpTestingController.expectOne({
      url: 'api/teacher/1',
      method: 'GET'
    }).flush(mockTeacher)

    fixture.detectChanges()
    tick(1000)

    // Assert
    expect(component.isAdmin).toBeFalsy()
    expect(component.isParticipate).toBeTruthy()
    expect((divElement!.querySelector('button[data-test-unparticipate=""]') as HTMLElement | null)).toBeTruthy()
  }))
})

