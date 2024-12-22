import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';
import { firstValueFrom, lastValueFrom, Observable, of } from 'rxjs';

import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { User } from 'src/app/interfaces/user.interface';

import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent
  let fixture: ComponentFixture<MeComponent>
  let matSnackBar: MatSnackBar
  let sessionService: SessionService
  let userService: UserService
  let userServiceGetById$: Observable<User>


  const mockSessionInformation: Partial<SessionInformation> = {
    admin: true,
    id: 1
  }

  const mockUser: User = {
    id: 1,
    firstName: "firstName",
    lastName: "lastName",
    admin: false,
    email: "user@example.net",
    password: "no password",
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: SessionService },
        { provide: UserService }
      ],
    })
      .compileComponents()

    matSnackBar = TestBed.inject(MatSnackBar)
    matSnackBar.open = jest.fn() as typeof matSnackBar.open

    sessionService = TestBed.inject(SessionService)
    sessionService.sessionInformation = mockSessionInformation as SessionInformation

    userService = TestBed.inject(UserService)
    userServiceGetById$ = of(mockUser)
    userService.getById = jest.fn(() => userServiceGetById$)
    jest.spyOn(userService, 'getById')

    fixture = TestBed.createComponent(MeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  });

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should fetch user on init', async () => {
    // Assert
    await firstValueFrom(userServiceGetById$)
    expect(userService.getById).toHaveBeenCalled()
  })

  it('should display user information', () => {
    // -- Arrange
    const compiled = fixture.debugElement.nativeElement;
    const pList = (compiled.querySelectorAll('p') as NodeList)

    // Assert
    expect((pList.item(0) as HTMLParagraphElement | undefined)?.textContent).toBe(`Name: ${mockUser.firstName} ${mockUser.lastName.toUpperCase()}`);
    expect((pList.item(1) as HTMLParagraphElement | undefined)?.textContent).toBe(`Email: ${mockUser.email}`);
  })

  it('should delete', async () => {
    // -- Arrange
    const router = TestBed.inject(Router)
    const userServiceDelete$ = of('')
    userService.delete = jest.fn(() => userServiceDelete$)
    jest.spyOn(matSnackBar, 'open')
    jest.spyOn(sessionService, 'logOut')
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true))

    // -- Act
    component.delete()

    // Assert
    expect(userService.delete).toHaveBeenCalled()

    await lastValueFrom(userServiceDelete$)
    expect(matSnackBar.open).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['/'])
    expect(sessionService.logOut).toHaveBeenCalled()
  })
})
