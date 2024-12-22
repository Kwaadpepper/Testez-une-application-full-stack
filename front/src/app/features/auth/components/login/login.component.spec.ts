import { HttpClientTestingModule } from '@angular/common/http/testing';
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

import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>
  let router: Router
  let sessionService: SessionService
  let authService:AuthService

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
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true))

    // -- Act
    component.submit()
    authServiceLogin.error(new Error())
    tick(1000)

    // Assert
    expect(authService.login).toHaveBeenCalled()
    expect(component.onError).toBeTruthy()
  }))
})
