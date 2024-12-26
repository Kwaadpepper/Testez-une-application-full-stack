import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';


import { Subject } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { SessionService } from 'src/app/services/session.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent
  let fixture: ComponentFixture<FormComponent>
  let router: Router
  let sessionService: SessionService
  let matSnackBar: MatSnackBar
  let sessionApiService: SessionApiService
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
        NoopAnimationsModule
      ],
      providers: [SessionService, TeacherService, SessionApiService, {
        provide: ActivatedRoute,
        useValue: mockActivatedRoute,
      }, {
        provide: Router,
        useValue: mockRouter
      }],
      declarations: [FormComponent]
    })
      .compileComponents()

    httpTestingController = TestBed.inject(HttpTestingController)

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

  it('should update a session IT', fakeAsync(async () => {
    // Arrange
    mockRouter.url = '/sessions/update'
    mockSessionInformation.admin = true
    const sessionApiService = TestBed.inject(SessionApiService)
    fixture = TestBed.createComponent(FormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    jest.spyOn(sessionApiService, 'update')
    jest.spyOn(matSnackBar, 'open')
    jest.spyOn(router, 'navigate')

    // Act

    httpTestingController.expectOne({
      url: 'api/session/1',
      method: 'GET'
    }).flush(mockSession, { status: 200, statusText: '' })
    tick(1000)
    fixture.detectChanges()
    const divElement: HTMLElement = fixture.nativeElement
    const inputName = divElement.querySelectorAll('input').item(0) as HTMLInputElement | null
    const submitButton = divElement.querySelector('button[type="submit"]') as HTMLButtonElement | null
    inputName!.value = "session description"
    inputName!.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    submitButton!.click()
    httpTestingController.expectOne({
      url: 'api/session/1',
      method: 'PUT'
    }).flush({}, { status: 200, statusText: '' })
    tick(1000)

    // Assert
    expect(submitButton!.disabled).toBeFalsy()
    expect(component!.sessionForm).toBeTruthy()
    expect(sessionApiService.update).toHaveBeenCalled()
    expect(matSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', {'duration': 3000})
    expect(router.navigate).toHaveBeenCalledWith(['sessions'])
  }))

  it('should not update a session if elements are missing IT', fakeAsync(async () => {
    // Arrange
    mockRouter.url = '/sessions/update'
    mockSessionInformation.admin = true
    const sessionApiService = TestBed.inject(SessionApiService)
    fixture = TestBed.createComponent(FormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    jest.spyOn(sessionApiService, 'update')
    jest.spyOn(matSnackBar, 'open')
    jest.spyOn(router, 'navigate')

    // Act

    httpTestingController.expectOne({
      url: 'api/session/1',
      method: 'GET'
    }).flush(mockSession, { status: 200, statusText: '' })
    tick(1000)
    fixture.detectChanges()
    const divElement: HTMLElement = fixture.nativeElement
    const inputName = divElement.querySelectorAll('input').item(0) as HTMLInputElement | null
    const submitButton = divElement.querySelector('button[type="submit"]') as HTMLButtonElement | null
    inputName!.value = ""
    inputName!.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    submitButton!.click()
    tick(1000)

    // Assert
    expect(submitButton!.disabled).toBeTruthy()
    expect(component!.sessionForm).toBeTruthy()
    expect(sessionApiService.update).not.toHaveBeenCalled()
  }))

  it('should not create a session if elements are missing IT', fakeAsync(async () => {
    // Arrange
    mockRouter.url = '/sessions/create'
    mockSessionInformation.admin = true
    const sessionApiService = TestBed.inject(SessionApiService)
    fixture = TestBed.createComponent(FormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    let loader = TestbedHarnessEnvironment.loader(fixture);

    const divElement: HTMLElement = fixture.nativeElement
    const inputName = divElement.querySelectorAll('input').item(0) as HTMLInputElement | null
    const inputDate = divElement.querySelectorAll('input').item(1) as HTMLInputElement | null
    const selectTeacher = (await loader.getAllHarnesses(MatSelectHarness))[0];
    const inputDescription = divElement.querySelectorAll('textarea').item(0) as HTMLTextAreaElement | null
    const submitButton = divElement.querySelector('button[type="submit"]') as HTMLButtonElement | null
    fixture.detectChanges()

    jest.spyOn(sessionApiService, 'create')
    jest.spyOn(matSnackBar, 'open')

    // Act
    httpTestingController.expectOne({
      url: 'api/teacher',
      method: 'GET'
    }).flush([mockTeacher])
    tick(1000)
    inputName!.value = ""
    inputName!.dispatchEvent(new Event('input'))
    inputDate!.value = new Date().toISOString().split('T')[0]
    inputDate!.dispatchEvent(new Event('input'))
    // Select first teacher
    await selectTeacher.open()
    await selectTeacher.clickOptions()
    await selectTeacher.close()
    fixture.detectChanges()
    inputDescription!.value = "session description"
    inputDescription!.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    submitButton!.click()
    tick(1000)
    httpTestingController.expectNone({
      url: 'api/session',
      method: 'POST'
    })
    tick(1000)

    // Assert
    expect(submitButton!.disabled).toBeTruthy()
    expect(sessionApiService.create).not.toHaveBeenCalled()
    expect(matSnackBar.open).not.toHaveBeenCalled()
  }))

  it('should create a session IT', fakeAsync(async () => {
    // Arrange
    mockRouter.url = '/sessions/create'
    mockSessionInformation.admin = true
    const sessionApiService = TestBed.inject(SessionApiService)
    fixture = TestBed.createComponent(FormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    let loader = TestbedHarnessEnvironment.loader(fixture);

    const divElement: HTMLElement = fixture.nativeElement
    const inputName = divElement.querySelectorAll('input').item(0) as HTMLInputElement | null
    const inputDate = divElement.querySelectorAll('input').item(1) as HTMLInputElement | null
    const selectTeacher = (await loader.getAllHarnesses(MatSelectHarness))[0];
    const inputDescription = divElement.querySelectorAll('textarea').item(0) as HTMLTextAreaElement | null
    const submitButton = divElement.querySelector('button[type="submit"]') as HTMLButtonElement | null
    fixture.detectChanges()

    jest.spyOn(sessionApiService, 'create')
    jest.spyOn(matSnackBar, 'open')
    jest.spyOn(router, 'navigate')

    // Act
    httpTestingController.expectOne({
      url: 'api/teacher',
      method: 'GET'
    }).flush([mockTeacher])
    tick(1000)
    inputName!.value = "session name"
    inputName!.dispatchEvent(new Event('input'))
    inputDate!.value = new Date().toISOString().split('T')[0]
    inputDate!.dispatchEvent(new Event('input'))
    // Select first teacher
    await selectTeacher.open()
    await selectTeacher.clickOptions()
    await selectTeacher.close()
    fixture.detectChanges()
    inputDescription!.value = "session description"
    inputDescription!.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    submitButton!.click()
    tick(1000)
    httpTestingController.expectOne({
      url: 'api/session',
      method: 'POST'
    }).flush({}, { status: 200, statusText: '' })
    tick(1000)

    // Assert
    expect(sessionApiService.create).toHaveBeenCalled()
    expect(matSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', {'duration': 3000})
    expect(router.navigate).toHaveBeenCalledWith(['sessions'])
  }))
})
