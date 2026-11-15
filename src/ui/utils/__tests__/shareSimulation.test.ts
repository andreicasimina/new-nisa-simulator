import { describe, expect, it, vi } from 'vitest';
import {
  SHARE_HASHTAGS,
  SHARE_IMAGE_FILENAME,
  SHARE_TITLE,
  ShareNavigator,
  buildShareText,
  shareSimulationResult,
} from '../shareSimulation';

const SHARE_URL = 'https://example.com/new-nisa-simulator/#d=NoRgukA';
const SUMMARY = '新NISAシミュレーション結果（20年後の評価額: 1,000万円）';
const FAKE_ELEMENT = {} as HTMLElement;
const FAKE_FILE = new File(['png'], SHARE_IMAGE_FILENAME, { type: 'image/png' });

const abortError = () => {
  const err = new Error('Share canceled');
  err.name = 'AbortError';
  return err;
};

describe('buildShareText', () => {
  it('separates summary, short URL, and hashtags with blank lines', () => {
    expect(buildShareText(SUMMARY, SHARE_URL)).toBe(
      `${SUMMARY}\n\n${SHARE_URL}\n\n${SHARE_HASHTAGS}`
    );
  });

  it('omits URL line when shareUrl is not provided', () => {
    expect(buildShareText(SUMMARY)).toBe(`${SUMMARY}\n\n${SHARE_HASHTAGS}`);
  });
});

describe('shareSimulationResult', () => {
  it('shares image file and URL with hashtags embedded in text when canShare({ files }) is true', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const canShare = vi.fn().mockReturnValue(true);
    const writeText = vi.fn();
    const captureFile = vi.fn().mockResolvedValue(FAKE_FILE);

    const navigatorObj: ShareNavigator = {
      share,
      canShare,
      clipboard: { writeText },
    };

    const outcome = await shareSimulationResult({
      shareUrl: SHARE_URL,
      summaryText: SUMMARY,
      chartElement: FAKE_ELEMENT,
      navigatorObj,
      captureFile,
    });

    expect(outcome).toBe('shared');
    expect(captureFile).toHaveBeenCalledWith(FAKE_ELEMENT);
    expect(canShare).toHaveBeenCalledWith({ files: [FAKE_FILE] });
    expect(share).toHaveBeenCalledTimes(1);
    expect(share).toHaveBeenCalledWith({
      files: [FAKE_FILE],
      title: SHARE_TITLE,
      text: `${SUMMARY}\n\n${SHARE_URL}\n\n${SHARE_HASHTAGS}`,
    });
    expect(writeText).not.toHaveBeenCalled();
  });

  it('ignores AbortError during file share without falling back', async () => {
    const share = vi.fn().mockRejectedValue(abortError());
    const canShare = vi.fn().mockReturnValue(true);
    const writeText = vi.fn();

    const outcome = await shareSimulationResult({
      shareUrl: SHARE_URL,
      summaryText: SUMMARY,
      chartElement: FAKE_ELEMENT,
      navigatorObj: { share, canShare, clipboard: { writeText } },
      captureFile: vi.fn().mockResolvedValue(FAKE_FILE),
    });

    expect(outcome).toBe('aborted');
    expect(share).toHaveBeenCalledTimes(1);
    expect(writeText).not.toHaveBeenCalled();
  });

  it('falls back to URL-only navigator.share when canShare({ files }) is false', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const canShare = vi.fn().mockReturnValue(false);
    const writeText = vi.fn();

    const outcome = await shareSimulationResult({
      shareUrl: SHARE_URL,
      summaryText: SUMMARY,
      chartElement: FAKE_ELEMENT,
      navigatorObj: { share, canShare, clipboard: { writeText } },
      captureFile: vi.fn().mockResolvedValue(FAKE_FILE),
    });

    expect(outcome).toBe('shared');
    expect(share).toHaveBeenCalledTimes(1);
    expect(share).toHaveBeenCalledWith({
      title: SHARE_TITLE,
      text: `${SUMMARY}\n\n${SHARE_HASHTAGS}`,
      url: SHARE_URL,
    });
    expect(writeText).not.toHaveBeenCalled();
  });

  it('falls back to URL-only navigator.share when captureFile fails or returns null', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const canShare = vi.fn().mockReturnValue(true);

    const outcome = await shareSimulationResult({
      shareUrl: SHARE_URL,
      summaryText: SUMMARY,
      chartElement: FAKE_ELEMENT,
      navigatorObj: { share, canShare },
      captureFile: vi.fn().mockRejectedValue(new Error('capture failed')),
    });

    expect(outcome).toBe('shared');
    expect(share).toHaveBeenCalledWith({
      title: SHARE_TITLE,
      text: `${SUMMARY}\n\n${SHARE_HASHTAGS}`,
      url: SHARE_URL,
    });
  });

  it('ignores AbortError during URL-only fallback without falling back to clipboard', async () => {
    const share = vi.fn().mockRejectedValue(abortError());
    const canShare = vi.fn().mockReturnValue(false);
    const writeText = vi.fn();

    const outcome = await shareSimulationResult({
      shareUrl: SHARE_URL,
      summaryText: SUMMARY,
      chartElement: FAKE_ELEMENT,
      navigatorObj: { share, canShare, clipboard: { writeText } },
      captureFile: vi.fn().mockResolvedValue(FAKE_FILE),
    });

    expect(outcome).toBe('aborted');
    expect(writeText).not.toHaveBeenCalled();
  });

  it('falls back to clipboard when navigator.share throws a non-AbortError', async () => {
    const share = vi.fn().mockRejectedValue(new Error('NotAllowedError'));
    const canShare = vi.fn().mockReturnValue(true);
    const writeText = vi.fn().mockResolvedValue(undefined);

    const outcome = await shareSimulationResult({
      shareUrl: SHARE_URL,
      summaryText: SUMMARY,
      chartElement: FAKE_ELEMENT,
      navigatorObj: { share, canShare, clipboard: { writeText } },
      captureFile: vi.fn().mockResolvedValue(FAKE_FILE),
    });

    expect(outcome).toBe('copied');
    expect(share).toHaveBeenCalledTimes(2);
    expect(writeText).toHaveBeenCalledWith(SHARE_URL);
  });

  it('falls back to clipboard when navigator.share is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    const outcome = await shareSimulationResult({
      shareUrl: SHARE_URL,
      summaryText: SUMMARY,
      chartElement: FAKE_ELEMENT,
      navigatorObj: { clipboard: { writeText } },
    });

    expect(outcome).toBe('copied');
    expect(writeText).toHaveBeenCalledWith(SHARE_URL);
  });
});
