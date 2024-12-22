import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { expect, jest } from '@jest/globals';

import { Subject } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let registerComponent: RegisterComponent
  let fixture: ComponentFixture<RegisterComponent>
  let router: Router
  let sessionService: SessionService
  let authService:AuthService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents()

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
})
