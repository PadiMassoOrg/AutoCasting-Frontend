import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CASTING_STATUS_ARCHIVED,
  CASTING_STATUS_CLOSED,
  CASTING_STATUS_DRAFT,
  CASTING_STATUS_PAUSED,
  CASTING_STATUS_PUBLISHED,
} from '../../../sitemetadata/utils/siteMetadataUtils';
import { useCastingOverflowMenuItems } from './useCastingOverflowMenuItems';

const navigateMock = vi.fn();
const showToastMock = vi.fn();
const copyToClipboardGracefulMock = vi.fn().mockResolvedValue(true);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

vi.mock('autocasting-ui-library-padimasso', () => ({
  showToast: (...args: unknown[]) => showToastMock(...args),
}));

vi.mock('../../../../shared/utils/domUtils', () => ({
  copyToClipboardGraceful: (...args: unknown[]) => copyToClipboardGracefulMock(...args),
}));

type MenuItem = { key: string; disabled?: boolean; onSelect?: () => void | Promise<void>; type?: string };

const findItem = (items: MenuItem[], key: string) => items.find((item) => item.key === key);

describe('useCastingOverflowMenuItems', () => {
  beforeEach(() => {
    navigateMock.mockClear();
    showToastMock.mockClear();
    copyToClipboardGracefulMock.mockClear();
  });

  const renderMenu = (
    statusCode?: string | null,
    extra: Partial<Parameters<typeof useCastingOverflowMenuItems>[0]> = {}
  ) =>
    renderHook(() =>
      useCastingOverflowMenuItems({
        detailsPath: '/castings/123',
        editCastingPath: '/castings/123/edit',
        onApplicants: vi.fn(),
        statusCode,
        ...extra,
      })
    ).result.current as unknown as MenuItem[];

  it('enables details/applicants/copyLink/edit for a published casting', () => {
    const items = renderMenu(CASTING_STATUS_PUBLISHED);

    expect(findItem(items, 'details')?.disabled).toBe(false);
    expect(findItem(items, 'applicants')?.disabled).toBe(false);
    expect(findItem(items, 'copy_link')?.disabled).toBe(false);
    expect(findItem(items, 'edit')?.disabled).toBe(true);
  });

  it('only enables edit and delete for a draft casting', () => {
    const items = renderMenu(CASTING_STATUS_DRAFT);

    expect(findItem(items, 'details')?.disabled).toBe(true);
    expect(findItem(items, 'applicants')?.disabled).toBe(true);
    expect(findItem(items, 'copy_link')?.disabled).toBe(true);
    expect(findItem(items, 'edit')?.disabled).toBe(false);
  });

  it('enables applicants but not copyLink for a closed casting', () => {
    const items = renderMenu(CASTING_STATUS_CLOSED);

    expect(findItem(items, 'applicants')?.disabled).toBe(false);
    expect(findItem(items, 'copy_link')?.disabled).toBe(true);
  });

  it('enables applicants and copyLink for a paused casting', () => {
    const items = renderMenu(CASTING_STATUS_PAUSED);

    expect(findItem(items, 'applicants')?.disabled).toBe(false);
    expect(findItem(items, 'copy_link')?.disabled).toBe(false);
  });

  it('disables everything but delete for an archived casting', () => {
    const items = renderMenu(CASTING_STATUS_ARCHIVED);

    expect(findItem(items, 'details')?.disabled).toBe(true);
    expect(findItem(items, 'applicants')?.disabled).toBe(true);
    expect(findItem(items, 'copy_link')?.disabled).toBe(true);
    expect(findItem(items, 'edit')?.disabled).toBe(true);
  });

  it('defaults to details-only visibility when statusCode is missing', () => {
    const items = renderMenu(null);

    expect(findItem(items, 'details')?.disabled).toBe(false);
    expect(findItem(items, 'applicants')?.disabled).toBe(true);
    expect(findItem(items, 'copy_link')?.disabled).toBe(true);
  });

  it('disables edit when there is no editCastingPath even if status allows it', () => {
    const items = renderMenu(CASTING_STATUS_DRAFT, { editCastingPath: undefined });

    expect(findItem(items, 'edit')?.disabled).toBe(true);
  });

  it('does not include a delete action when onDelete is not provided', () => {
    const items = renderMenu(CASTING_STATUS_PUBLISHED);

    expect(findItem(items, 'delete')).toBeUndefined();
  });

  it('includes a delete action honoring deleteDisabled when onDelete is provided', () => {
    const onDelete = vi.fn();
    const items = renderMenu(CASTING_STATUS_PUBLISHED, { onDelete, deleteDisabled: true });

    expect(findItem(items, 'delete')?.disabled).toBe(true);
  });

  it('copies the absolute details URL to the clipboard on copy_link select', async () => {
    const items = renderMenu(CASTING_STATUS_PUBLISHED);

    await findItem(items, 'copy_link')?.onSelect?.();

    expect(copyToClipboardGracefulMock).toHaveBeenCalledWith(expect.stringContaining('/castings/123'));
    expect(showToastMock).toHaveBeenCalled();
  });

  it('navigates to detailsPath when the details action is selected', () => {
    const items = renderMenu(CASTING_STATUS_PUBLISHED);

    findItem(items, 'details')?.onSelect?.();

    expect(navigateMock).toHaveBeenCalledWith('/castings/123');
  });
});
