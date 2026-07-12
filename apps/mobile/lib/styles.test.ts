import { globalStyles, radii } from './styles';
import { colors } from './theme';

describe('global styles', () => {
  it('exposes reusable style primitives', () => {
    expect(radii.md).toBe(8);
    expect(globalStyles.primaryAction.backgroundColor).toBe(colors.primary);
    expect(globalStyles.primaryActionLabel.fontWeight).toBe('700');
    expect(globalStyles.cardSurface.borderWidth).toBe(1);
    expect(globalStyles.bodyText.lineHeight).toBe(22);
    expect(globalStyles.eyebrow.textTransform).toBe('uppercase');
    expect(globalStyles.heroTitle.lineHeight).toBe(36);
    expect(globalStyles.sectionTitle.fontSize).toBe(18);
  });
});
