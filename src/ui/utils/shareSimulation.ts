import { toBlob } from 'html-to-image';

export const SHARE_TITLE = '新NISAシミュレーター';
export const DEFAULT_SUMMARY_TEXT = '新NISAのシミュレーション結果を作成しました。';
export const SHARE_IMAGE_FILENAME = 'nisa-simulation.png';

export type ShareOutcome = 'shared' | 'copied' | 'aborted' | 'failed';

export interface ShareNavigator {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data?: ShareData) => boolean;
  clipboard?: {
    writeText: (text: string) => Promise<void>;
  };
}

export interface ShareSimulationOptions {
  shareUrl: string;
  summaryText?: string;
  chartElement?: HTMLElement;
  navigatorObj?: ShareNavigator;
  captureFile?: (element: HTMLElement) => Promise<File>;
}

const isAbortError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'name' in error &&
  error.name === 'AbortError';

const shouldIncludeNode = (domNode: HTMLElement): boolean =>
  domNode.dataset?.shareIgnore !== 'true';

function getTrimmedCaptureSize(element: HTMLElement): { width: number; height: number } {
  const rect = element.getBoundingClientRect();
  let ignoredHeight = 0;

  element.querySelectorAll<HTMLElement>('[data-share-ignore="true"]').forEach((ignored) => {
    const parentGap = ignored.parentElement
      ? parseFloat(getComputedStyle(ignored.parentElement).rowGap || '0') || 0
      : 0;
    ignoredHeight += ignored.getBoundingClientRect().height + parentGap;
  });

  return {
    width: Math.max(1, Math.round(rect.width)),
    height: Math.max(1, Math.round(rect.height - ignoredHeight)),
  };
}

export async function captureChartFile(element: HTMLElement): Promise<File> {
  const { width, height } = getTrimmedCaptureSize(element);
  const blob = await toBlob(element, {
    width,
    height,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    skipFonts: true,
    filter: shouldIncludeNode,
    style: { height: 'auto' },
  });

  if (!blob) {
    throw new Error('Failed to capture chart image');
  }

  return new File([blob], SHARE_IMAGE_FILENAME, { type: 'image/png' });
}

async function tryShare(
  navigatorObj: ShareNavigator,
  data: ShareData
): Promise<'shared' | 'aborted' | 'failed'> {
  if (!navigatorObj.share) return 'failed';
  try {
    await navigatorObj.share(data);
    return 'shared';
  } catch (error) {
    return isAbortError(error) ? 'aborted' : 'failed';
  }
}

async function buildShareFile(
  chartElement: HTMLElement,
  navigatorObj: ShareNavigator,
  captureFile: (element: HTMLElement) => Promise<File>
): Promise<File | undefined> {
  if (!navigatorObj.canShare) return undefined;
  try {
    const file = await captureFile(chartElement);
    return navigatorObj.canShare({ files: [file] }) ? file : undefined;
  } catch {
    return undefined;
  }
}

export async function shareSimulationResult({
  shareUrl,
  summaryText = DEFAULT_SUMMARY_TEXT,
  chartElement,
  navigatorObj = navigator,
  captureFile = captureChartFile,
}: ShareSimulationOptions): Promise<ShareOutcome> {
  if (chartElement && navigatorObj.share && navigatorObj.canShare) {
    const file = await buildShareFile(chartElement, navigatorObj, captureFile);
    if (file) {
      const result = await tryShare(navigatorObj, {
        files: [file],
        title: SHARE_TITLE,
        // Apps like LINE and X drop `url` when a file is attached, so include it in `text`.
        text: `${summaryText}\n${shareUrl}`,
      });
      if (result !== 'failed') return result;
    }
  }

  if (navigatorObj.share) {
    const result = await tryShare(navigatorObj, {
      title: SHARE_TITLE,
      text: summaryText,
      url: shareUrl,
    });
    if (result !== 'failed') return result;
  }

  if (navigatorObj.clipboard?.writeText) {
    try {
      await navigatorObj.clipboard.writeText(shareUrl);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
