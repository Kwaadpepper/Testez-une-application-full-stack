import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { expect, jest } from '@jest/globals';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let registerComponent: RegisterComponent
  let fixture: ComponentFixture<RegisterComponent>
  let router: Router
  let sessionService: SessionService
  let authService:AuthService
  let httpTestingController:HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent }
        ])
      ]
    })
      .compileComponents()

    httpTestingController = TestBed.inject(HttpTestingController)

    router = TestBed.inject(Router)
    sessionService = TestBed.inject(SessionService)
    authService = TestBed.inject(AuthService)

    fixture = TestBed.createComponent(RegisterComponent)
    registerComponent = fixture.componentInstance
    fixture.detectChanges()
  });

  it('should create', () => {
    expect(registerComponent).toBeTruthy()
  })

  it('should register successfully',  fakeAsync(() => {
    // -- Arrange
    registerComponent.onError = false
    const authServiceRegister = new Subject<void>()
    const authServiceRegister$ = authServiceRegister.asObservable()

    authService.register = jest.fn(() => authServiceRegister$)
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true))

    // -- Act
    registerComponent.submit()
    authServiceRegister.next()
    tick(1000)

    // Assert
    expect(authService.register).toHaveBeenCalled()
    expect(registerComponent.onError).toBeFalsy()
    expect(router.navigate).toHaveBeenCalledWith(['/login'])
  }))

  it('should fail to register gracefully', fakeAsync(() => {
    // -- Arrange
    registerComponent.onError = false
    const authServiceRegister = new Subject<void>()
    const authServiceRegister$ = authServiceRegister.asObservable()

    authService.register = jest.fn(() => authServiceRegister$)
    jest.spyOn(router, 'navigate')

    // -- Act
    registerComponent.submit()
    authServiceRegister.error(new Error())
    tick(1000)

    // Assert
    expect(authService.register).toHaveBeenCalled()
    expect(registerComponent.onError).toBeTruthy()
    expect(router.navigate).not.toHaveBeenCalled()
  }))

  it('should register gracefully IT', () => {
    // -- Arrange
    const divElement: HTMLElement = fixture.nativeElement
    const firstNameInput = divElement.querySelectorAll('input').item(0) as HTMLInputElement | null
    const lastNameInput = divElement.querySelectorAll('input').item(1) as HTMLInputElement | null
    const emailNameInput = divElement.querySelectorAll('input').item(2) as HTMLInputElement | null
    const passwordNameInput = divElement.querySelectorAll('input').item(3) as HTMLInputElement | null
    const submitButton = divElement.querySelector('button[type="submit"]') as HTMLButtonElement | null
    jest.spyOn(authService, 'register')
    jest.spyOn(router, 'navigate')

    // -- Act
    firstNameInput!.value = 'firstName'
    firstNameInput!.dispatchEvent(new Event('input'))
    lastNameInput!.value = 'lastName'
    lastNameInput!.dispatchEvent(new Event('input'))
    emailNameInput!.value = 'user@example.net'
    emailNameInput!.dispatchEvent(new Event('input'))
    passwordNameInput!.value = 'superpassword'
    passwordNameInput!.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    submitButton!.click()

    // Assert
    const req = httpTestingController.expectOne({
      url: 'api/auth/register',
      method: 'POST'
    });
    req.flush({}, {status: 200, statusText: ''})
    expect(authService.register).toHaveBeenCalled()
    expect(registerComponent.onError).toBeFalsy()
    httpTestingController.verify();
    expect(router.navigate).toHaveBeenCalledWith(['/login'])
  })

  it('should fail to register gracefully IT', fakeAsync(() => {
    // -- Arrange
    const divElement: HTMLElement = fixture.nativeElement
    const firstNameInput = divElement.querySelectorAll('input').item(0) as HTMLInputElement | null
    const lastNameInput = divElement.querySelectorAll('input').item(1) as HTMLInputElement | null
    const emailNameInput = divElement.querySelectorAll('input').item(2) as HTMLInputElement | null
    const passwordNameInput = divElement.querySelectorAll('input').item(3) as HTMLInputElement | null
    const submitButton = divElement.querySelector('button[type="submit"]') as HTMLButtonElement | null
    jest.spyOn(authService, 'register')
    jest.spyOn(router, 'navigate')

    // -- Act
    firstNameInput!.value = 'firstName'
    firstNameInput!.dispatchEvent(new Event('input'))
    lastNameInput!.value = 'lastName'
    lastNameInput!.dispatchEvent(new Event('input'))
    emailNameInput!.value = 'user@example.net'
    emailNameInput!.dispatchEvent(new Event('input'))
    passwordNameInput!.value = 'superpassword'
    passwordNameInput!.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    submitButton!.click()

    // Assert
    const req = httpTestingController.expectOne({
      url: 'api/auth/register',
      method: 'POST'
    });
    req.flush({}, {status: 400, statusText: ''})
    expect(authService.register).toHaveBeenCalled()
    expect(registerComponent.onError).toBeTruthy()
    httpTestingController.verify()
    tick(4000)
    fixture.detectChanges()
    expect(divElement.querySelector('span.error')).toBeTruthy()
    expect(divElement.querySelector('span.error')!.textContent).toBe('An error occurred')
  }))

    it('should require values to register IT', async () => {
      // -- Arrange
      const divElement: HTMLElement = fixture.nativeElement
      const submitButton = divElement.querySelector('button[type="submit"]') as HTMLButtonElement | null

      // -- Act


      // Assert
      expect(registerComponent.form.invalid).toBeTruthy()
      expect(submitButton!.disabled).toBeTruthy()
    })
})
