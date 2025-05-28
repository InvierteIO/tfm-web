import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalScopeHabilitationComponent } from './legal-scope-habilitation.component';

describe('LegalScopeHabilitationComponent', () => {
  let component: LegalScopeHabilitationComponent;
  let fixture: ComponentFixture<LegalScopeHabilitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalScopeHabilitationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalScopeHabilitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
