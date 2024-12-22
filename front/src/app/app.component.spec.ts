import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';


describe('AppComponent', () => {
  let sessionService: SessionService
  let router: Router

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

  it('should logout from the app', () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    jest.spyOn(sessionService, 'logOut')
    jest.spyOn(router, 'navigate')

    // Act
    app.logout()

    // Assert
    expect(app).toBeTruthy()
    expect(firstValueFrom(app.$isLogged())).toBeTruthy()
    expect(sessionService.logOut).toHaveBeenCalledTimes(1)
    expect(router.navigate).toHaveBeenCalledWith([''])
  })
})
