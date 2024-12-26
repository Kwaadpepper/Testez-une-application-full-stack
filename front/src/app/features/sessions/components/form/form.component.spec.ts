import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { Session } from '../../interfaces/session.interface';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent
  let fixture: ComponentFixture<FormComponent>
  let router: Router
  let sessionService: SessionService
  let matSnackBar: MatSnackBar
  let sessionApiService: SessionApiService

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
  const mockRouter = {
    navigate: jest.fn(),
    url: '/'
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
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [SessionService, SessionApiService, {
        provide: ActivatedRoute,
        useValue: mockActivatedRoute,
      }, {
        provide: Router,
        useValue: mockRouter
      }],
      declarations: [FormComponent]
    })
      .compileComponents()

    router = TestBed.inject(Router)

    sessionApiService = TestBed.inject(SessionApiService)

    matSnackBar = TestBed.inject(MatSnackBar)
    matSnackBar.open = jest.fn() as typeof matSnackBar.open

    sessionService = TestBed.inject(SessionService)
    sessionService.sessionInformation = mockSessionInformation as SessionInformation
  })

  it('should create', () => {
    // Act
    fixture = TestBed.createComponent(FormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    // Assert
    expect(component).toBeTruthy()
  })

  it('should prevent non admin users to have access', () => {
    // Arrange
    mockSessionInformation.admin = false

    // Act
    fixture = TestBed.createComponent(FormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    // Assert
    expect(router.navigate).toHaveBeenCalledWith(['/sessions'])
  })

  it('should should init form inputs without a session', () => {
    // Arrange
    mockSessionInformation.admin = true

    // Act
    fixture = TestBed.createComponent(FormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    // Assert
    expect(component.sessionForm).toBeDefined()
    expect(component.sessionForm!.get('name')?.value).toBe('')
    expect(component.sessionForm!.get('date')?.value).toBe('')
    expect(component.sessionForm!.get('teacher_id')?.value).toBe('')
    expect(component.sessionForm!.get('description')?.value).toBe('')
  })

  it('should should init form inputs with a session', fakeAsync(() => {
    // Arrange
    mockRouter.url = '/sessions/update/1'
    mockActivatedRoute.snapshot.paramMap = {
      get: () => 1,
    }
    mockSessionInformation.admin = true
    const sessionApiServiceDetails = new Subject<Session>()
    const sessionApiServiceDetails$ = sessionApiServiceDetails.asObservable()
    sessionApiService.detail = jest.fn(() => sessionApiServiceDetails$)

    // Act
    fixture = TestBed.createComponent(FormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    sessionApiServiceDetails.next(mockSession)
    tick(1000)

    // Assert
    expect(component.sessionForm).toBeDefined()
    expect(component.sessionForm!.get('name')?.value).toBe('name')
    expect(component.sessionForm!.get('date')?.value).toBe(mockSession.date.toISOString().slice(0, 10))
    expect(component.sessionForm!.get('teacher_id')?.value).toBe(1)
    expect(component.sessionForm!.get('description')?.value).toBe('description')
  }))

  it('should create a session', fakeAsync(() => {
    // Arrange
    mockRouter.url = '/sessions/create'
    mockSessionInformation.admin = true
    const sessionApiService = TestBed.inject(SessionApiService)
    const sessionApiServiceCreate = new Subject<Session>()
    const sessionApiServiceCreate$ = sessionApiServiceCreate.asObservable()
    sessionApiService.create = jest.fn(() => sessionApiServiceCreate$)
    fixture = TestBed.createComponent(FormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    // Act
    component.submit()
    sessionApiServiceCreate.next(mockSession)
    tick(1000)

    // Assert
    expect(sessionApiService.create).toHaveBeenCalled()
    expect(matSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', {'duration': 3000})
    expect(router.navigate).toHaveBeenCalledWith(['sessions'])
  }))

  it('should update a session', fakeAsync(() => {
    // Arrange
    mockRouter.url = '/sessions/update/1'
    mockActivatedRoute.snapshot.paramMap = {
      get: () => 1,
    }
    mockSessionInformation.admin = true
    const sessionApiService = TestBed.inject(SessionApiService)
    const sessionApiServiceUpdate = new Subject<Session>()
    const sessionApiServiceUpdate$ = sessionApiServiceUpdate.asObservable()
    sessionApiService.update = jest.fn(() => sessionApiServiceUpdate$)
    fixture = TestBed.createComponent(FormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    // Act
    component.submit()
    sessionApiServiceUpdate.next(mockSession)
    tick(1000)

    // Assert
    expect(sessionApiService.update).toHaveBeenCalled()
    expect(matSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', {'duration': 3000})
    expect(router.navigate).toHaveBeenCalledWith(['sessions'])
  }))
})
