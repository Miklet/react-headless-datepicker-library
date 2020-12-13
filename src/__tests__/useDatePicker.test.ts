import { renderHook } from '@testing-library/react-hooks';
import { useDatePicker } from '../useDatePicker';

describe('useDatePicker', () => {
  describe('getRootProps', () => {
    it('returns ARIA attributes required for dialog', () => {
      const { result } = renderUseDatePickerHook();

      expect(result.current.getRootProps()).toEqual({
        role: 'dialog' as const,
        'aria-modal': true,
        'aria-label': 'Choose date',
        ref: expect.any(Function),
      });
    });
  });
});

function renderUseDatePickerHook() {
  return renderHook(useDatePicker);
}
