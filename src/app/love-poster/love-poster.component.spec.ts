import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LovePosterComponent } from './love-poster.component';

describe('LovePosterComponent', () => {
  let component: LovePosterComponent;
  let fixture: ComponentFixture<LovePosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LovePosterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LovePosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
