import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';


describe('AppComponent', () => {
  let sessionService: SessionService
  let router: Router
  let httpTestingController: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents()

    httpTestingController = TestBed.inject(HttpTestingController)

    sessionService = TestBed.inject(SessionService)
    router = TestBed.inject(Router)
  })

  it('should create the app', () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance

    // Assert
    expect(app).toBeTruthy()
  })

  it('should logout from the app', async () => {
    // Arrange
    sessionService = TestBed.inject(SessionService)
    sessionService.isLogged = true
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    jest.spyOn(sessionService, 'logOut')
    jest.spyOn(router, 'navigate')

    // Act
    app.logout()

    // Assert
    expect(app).toBeTruthy()
    expect(await firstValueFrom(app.$isLogged())).toBeFalsy()
    expect(sessionService.logOut).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith([''])
  })

  it('should logout from the app IT', async () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    jest.spyOn(sessionService, 'logOut')
    jest.spyOn(router, 'navigate')

    // Act
    sessionService.logIn({
      id: 1,
      firstName: "firstName",
      lastName: "lastName",
      token: "token",
      username: "username",
      admin: false,
      type: "type",
    })
    expect(await firstValueFrom(app.$isLogged())).toBeTruthy()
    app.logout()

    // Assert
    expect(app).toBeTruthy()
    expect(await firstValueFrom(app.$isLogged())).toBeFalsy()
    expect(sessionService.logOut).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith([''])
  })
})
