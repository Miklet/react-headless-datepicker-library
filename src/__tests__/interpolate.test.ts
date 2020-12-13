import { interpolate } from '../interpolate';

describe('utils/interpolate', () => {
  it('interpolates', () => {
    const result = interpolate('{{word1}} is {{word2}}', {
      word1: 'what',
      word2: 'love',
    });

    expect(result).toBe('what is love');
  });
});
