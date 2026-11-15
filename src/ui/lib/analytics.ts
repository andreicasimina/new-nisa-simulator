declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initGA(): void {
  const tagId = import.meta.env.VITE_GA_TAG_ID?.trim();
  if (!tagId) return;

  const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`;
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', tagId);
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (!window.gtag) return;

  if (params) {
    window.gtag('event', eventName, params);
  } else {
    window.gtag('event', eventName);
  }
}
