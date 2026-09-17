import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  let fixture: ComponentFixture<ErrorStateComponent>;

  const baseInputs = {
    image: 'assets/images/errors/404.webp',
    titleKey: 'DASHBOARD.ERRORS.NOT_FOUND.TITLE',
    messageKey: 'DASHBOARD.ERRORS.NOT_FOUND.MESSAGE',
  };

  /** Renders with the given inputs and hands back the root element. */
  const render = (inputs: Record<string, unknown>): HTMLElement => {
    fixture = TestBed.createComponent(ErrorStateComponent);

    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }

    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent],
      // No translations are loaded, so the pipe echoes the key back. That is
      // what we want to assert: the page asks for the right key.
      providers: [provideRouter([]), provideTranslateService({})],
    }).compileComponents();
  });

  it('shows the title and the message', () => {
    const el = render(baseInputs);

    expect(el.querySelector('h1')?.textContent?.trim()).toBe(
      'DASHBOARD.ERRORS.NOT_FOUND.TITLE',
    );
    expect(el.querySelector('p')?.textContent?.trim()).toBe(
      'DASHBOARD.ERRORS.NOT_FOUND.MESSAGE',
    );
  });

  it('points the illustration at the given asset', () => {
    const el = render(baseInputs);

    expect(el.querySelector('img')?.getAttribute('src')).toContain(
      'assets/images/errors/404.webp',
    );
  });

  it('hides the action when no link was given', () => {
    // 404 and 500 render without a button.
    const el = render(baseInputs);

    expect(el.querySelector('a')).toBeNull();
  });

  it('shows the action once a key and a link are given', () => {
    // Only the 401 page passes both.
    const el = render({
      ...baseInputs,
      image: 'assets/images/errors/401.webp',
      actionKey: 'DASHBOARD.ERRORS.UNAUTHORIZED.ACTION',
      actionLink: '/',
    });

    const action = el.querySelector('a');
    expect(action?.textContent?.trim()).toBe(
      'DASHBOARD.ERRORS.UNAUTHORIZED.ACTION',
    );
    expect(action?.getAttribute('href')).toBe('/');
  });
});
