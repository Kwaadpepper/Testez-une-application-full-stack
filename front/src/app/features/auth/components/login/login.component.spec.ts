import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { firstValueFrom, of, Subject } from 'rxjs';

import { SessionInformation } from './../../../../interfaces/sessionInformation.interface';

import { By } from '@angular/platform-browser';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>
  let router: Router
  let sessionService: SessionService
  let authService: AuthService
  let httpTestingController: HttpTestingController

  const mockSessionInformation: SessionInformation = {
    token: 'token',
    type: 'type',
    id: 1,
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    admin: false
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService },
        { provide: SessionService }
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents()

    httpTestingController = TestBed.inject(HttpTestingController)

    router = TestBed.inject(Router)
    sessionService = TestBed.inject(SessionService)
    authService = TestBed.inject(AuthService)

    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should login successfully', async () => {
    // -- Arrange
    const authServiceLogin$ = of(mockSessionInformation)
    authService.login = jest.fn(() => authServiceLogin$)
    sessionService.logIn = jest.fn()
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true))

    // -- Act
    component.submit()

    // Assert
    expect(authService.login).toHaveBeenCalled()

    await firstValueFrom(authServiceLogin$)
    expect(router.navigate).toHaveBeenCalledWith(['/sessions'])
    expect(sessionService.logIn).toHaveBeenCalled()
  })

  it('should fail to login gracefully', fakeAsync(() => {
    // -- Arrange
    const authServiceLogin = new Subject<SessionInformation>()
    const authServiceLogin$ = authServiceLogin.asObservable()

    authService.login = jest.fn(() => authServiceLogin$)
    sessionService.logIn = jest.fn()

    // -- Act
    component.submit()
    authServiceLogin.error(new Error())
    tick(1000)

    // Assert
    expect(authService.login).toHaveBeenCalled()
    expect(component.onError).toBeTruthy()
  }))

  it('should login gracefully IT', () => {
    // -- Arrange
    const divElement: HTMLElement = fixture.nativeElement
    const inputEmail = divElement.querySelectorAll('input').item(0) as HTMLInputElement | null
    const inputPassword = divElement.querySelectorAll('input').item(1) as HTMLInputElement | null
    const submitButton = divElement.querySelector('button[type="submit"]') as HTMLButtonElement | null
    jest.spyOn(authService, 'login')
    jest.spyOn(router, 'navigate')

    // -- Act
    inputEmail!.value = 'user@example.net'
    inputEmail!.dispatchEvent(new Event('input'));
    inputPassword!.value = 'superpassword'
    inputPassword!.dispatchEvent(new Event('input'));
    fixture.detectChanges()
    submitButton!.click()

    // Assert
    const req = httpTestingController.expectOne({
      url: 'api/auth/login',
      method: 'POST'
    });
    req.flush(mockSessionInformation, {status: 200, statusText: ''})
    expect(authService.login).toHaveBeenCalled()
    expect(component.onError).toBeFalsy()
    httpTestingController.verify();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions'])
  })


  it('should require credentials to login IT', async () => {
    // -- Arrange
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'))

    // -- Act


    // Assert
    expect(component.form.invalid).toBeTruthy()
    expect(submitButton.nativeElement.disabled).toBeTruthy()
  })

  it('should be able to login if credentials are given IT', async () => {
    // -- Arrange
    const divElement: HTMLElement = fixture.nativeElement
    const inputEmail = divElement.querySelectorAll('input').item(0) as HTMLInputElement | null
    const inputPassword = divElement.querySelectorAll('input').item(1) as HTMLInputElement | null
    const submitButton = divElement.querySelector('button[type="submit"]') as HTMLButtonElement | null

    console.log(divElement.querySelectorAll('input').item(0))

    // -- Act
    inputEmail!.value = 'user@example.net'
    inputEmail!.dispatchEvent(new Event('input'));
    inputPassword!.value = 'superpassword'
    inputPassword!.dispatchEvent(new Event('input'));
    fixture.detectChanges()


    // Assert
    expect(component.form.invalid).toBeFalsy()
    expect(submitButton!.disabled).toBeFalsy()
  })

  it('should fail to login gracefully and display error message IT', fakeAsync(() => {
    // -- Arrange
    const divElement: HTMLElement = fixture.nativeElement
    const inputEmail = divElement.querySelectorAll('input').item(0) as HTMLInputElement | null
    const inputPassword = divElement.querySelectorAll('input').item(1) as HTMLInputElement | null
    const submitButton = divElement.querySelector('button[type="submit"]') as HTMLButtonElement | null
    const authServiceLogin = new Subject<SessionInformation>()
    const authServiceLogin$ = authServiceLogin.asObservable()

    authService.login = jest.fn(() => authServiceLogin$)
    sessionService.logIn = jest.fn()

    // -- Act
    inputEmail!.value = 'user@example.net'
    inputEmail!.dispatchEvent(new Event('input'));
    inputPassword!.value = 'superpassword'
    inputPassword!.dispatchEvent(new Event('input'));
    fixture.detectChanges()
    authServiceLogin.error(new Error())
    submitButton!.click()
    tick(1000)

    // Assert
    expect(authService.login).toHaveBeenCalled()
    expect(component.onError).toBeTruthy()
    fixture.detectChanges()
    tick(1000)
    expect(divElement.querySelector('p.error')).toBeTruthy()
    expect(divElement.querySelector('p.error')!.textContent).toBe('An error occurred')
  }))
})
