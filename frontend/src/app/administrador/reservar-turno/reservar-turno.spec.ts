import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservarTurno } from './reservar-turno';

describe('ReservarTurno', () => {
  let component: ReservarTurno;
  let fixture: ComponentFixture<ReservarTurno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservarTurno],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservarTurno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
