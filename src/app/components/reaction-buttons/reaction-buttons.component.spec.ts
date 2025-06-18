import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionButtonsComponent } from './reaction-buttons.component';

describe('ReactionsButtonsComponent', () => {
  let component: ReactionButtonsComponent;
  let fixture: ComponentFixture<ReactionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactionButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
