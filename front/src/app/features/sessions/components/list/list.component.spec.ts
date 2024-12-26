import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';

import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { SessionService } from 'src/app/services/session.service';
import { Session } from '../../interfaces/session.interface';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent
  let fixture: ComponentFixture<ListComponent>
  let httpTestingController: HttpTestingController

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }]
    })
      .compileComponents()

    httpTestingController = TestBed.inject(HttpTestingController)

    fixture = TestBed.createComponent(ListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display a list of sessions IT', () => {
    // -- Arrange
    const divElement: HTMLElement = fixture.nativeElement
    const divItemListElement = divElement.querySelector('div.items') as HTMLElement | null

    // Acct
    const req = httpTestingController.expectOne({
      url: 'api/session',
      method: 'GET'
    })
    req.flush([
      mockSession,
      {...mockSession, ...{id: 2}},
      {...mockSession, ...{id: 3}},
      {...mockSession, ...{id: 4}}
    ])

    fixture.detectChanges()

    // Assert
    expect(divItemListElement!.childElementCount).toBe(4)
  })

  it('should display create button as user is admin IT', () => {
    // -- Arrange
    mockSessionInformation.admin = true
    const divElement: HTMLElement = fixture.nativeElement
    fixture.detectChanges()

    // Act
    const req = httpTestingController.expectOne({
      url: 'api/session',
      method: 'GET'
    })
    req.flush([mockSession])

    fixture.detectChanges()

    // Assert
    expect(divElement!.querySelector('button[data-test="create"]')).toBeTruthy()
  })

  it('should display detail button on a session as use is admin IT', () => {
    // -- Arrange
    mockSessionInformation.admin = true
    const divElement: HTMLElement = fixture.nativeElement
    const divItemListElement = divElement.querySelector('div.items') as HTMLElement | null
    fixture.detectChanges()

    // Act
    const req = httpTestingController.expectOne({
      url: 'api/session',
      method: 'GET'
    })
    req.flush([mockSession])

    fixture.detectChanges()

    // Assert
    expect(divItemListElement!.children.item(0)!.querySelector(`button[data-test-edit="${mockSession.id}"]`)).toBeTruthy()
  })
})
