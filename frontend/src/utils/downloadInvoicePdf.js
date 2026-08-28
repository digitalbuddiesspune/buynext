import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const STYLE_PROPS = [
  'color',
  'backgroundColor',
  'backgroundImage',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderWidth',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',
  'borderRadius',
  'fontSize',
  'fontWeight',
  'fontFamily',
  'lineHeight',
  'textAlign',
  'textTransform',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'width',
  'height',
  'maxWidth',
  'minWidth',
  'display',
  'flexDirection',
  'alignItems',
  'justifyContent',
  'gap',
  'gridTemplateColumns',
  'verticalAlign',
  'objectFit',
  'boxSizing',
  'overflow',
  'whiteSpace',
  'wordBreak',
  'flexShrink',
];

function waitForImages(element) {
  const images = element.querySelectorAll('img');
  return Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(resolve, 4000);
        })
    )
  );
}

function walkElements(element, callback) {
  callback(element);
  Array.from(element.children).forEach((child) => walkElements(child, callback));
}

/** Inline computed styles while Tailwind/CSS is still active */
function snapshotAndInlineStyles(element) {
  const snapshots = [];

  walkElements(element, (el) => {
    snapshots.push({
      el,
      style: el.getAttribute('style'),
      className: el.className,
    });

    const computed = window.getComputedStyle(el);
    STYLE_PROPS.forEach((prop) => {
      const value = computed[prop];
      if (value && value !== 'initial' && value !== 'normal' && value !== 'auto') {
        el.style[prop] = value;
      }
    });
  });

  return () => {
    snapshots.forEach(({ el, style, className }) => {
      if (style) el.setAttribute('style', style);
      else el.removeAttribute('style');
      el.className = className;
    });
  };
}

function stripDocumentStylesheets(clonedDoc, captureRoot) {
  clonedDoc.head?.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
    node.remove();
  });

  // Keep export styles embedded inside the invoice only
  clonedDoc.body?.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
    if (!captureRoot.contains(node)) node.remove();
  });
}

function patchOklchInDocument() {
  const styleBackups = [];
  document.querySelectorAll('style').forEach((style) => {
    const content = style.textContent || '';
    if (content.includes('oklch')) {
      styleBackups.push([style, content]);
      style.textContent = content.replace(/oklch\([^)]*\)/gi, '#374151');
    }
  });

  const linkBackups = [];
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    linkBackups.push([link, link.disabled]);
    link.disabled = true;
  });

  return () => {
    styleBackups.forEach(([style, content]) => {
      style.textContent = content;
    });
    linkBackups.forEach(([link, disabled]) => {
      link.disabled = disabled;
    });
  };
}

function prepareElementForCapture(element) {
  const snapshot = {
    className: element.className,
    style: element.getAttribute('style'),
    hidden: element.getAttribute('aria-hidden'),
  };

  element.setAttribute('aria-hidden', 'true');
  element.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:794px',
    'max-width:794px',
    'background:#ffffff',
    'z-index:99999',
    'opacity:1',
    'visibility:visible',
    'pointer-events:none',
    'overflow:visible',
  ].join(';');

  return snapshot;
}

function restoreElementAfterCapture(element, snapshot) {
  element.className = snapshot.className;
  if (snapshot.style) element.setAttribute('style', snapshot.style);
  else element.removeAttribute('style');
  if (snapshot.hidden) element.setAttribute('aria-hidden', snapshot.hidden);
  else element.removeAttribute('aria-hidden');
}

function createCaptureBackdrop() {
  const backdrop = document.createElement('div');
  backdrop.setAttribute('data-invoice-capture-backdrop', 'true');
  backdrop.style.cssText =
    'position:fixed;inset:0;background:#ffffff;z-index:99998;pointer-events:none';
  document.body.appendChild(backdrop);
  return () => backdrop.remove();
}

export async function downloadInvoicePdf(element, filename) {
  if (!element) throw new Error('Invoice element not found');

  const captureTarget = element.querySelector('.invoice-export') || element;
  const elementSnapshot = prepareElementForCapture(element);
  const removeBackdrop = createCaptureBackdrop();
  const restoreInlined = snapshotAndInlineStyles(captureTarget);

  try {
    await waitForImages(captureTarget);
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    const canvas = await (async () => {
      const restoreStylesheets = patchOklchInDocument();
      try {
        return await html2canvas(captureTarget, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: -window.scrollY,
          width: captureTarget.scrollWidth,
          height: captureTarget.scrollHeight,
          windowWidth: captureTarget.scrollWidth,
          windowHeight: captureTarget.scrollHeight,
          onclone: (clonedDoc, clonedElement) => {
            stripDocumentStylesheets(clonedDoc, clonedElement);
            clonedElement.style.background = '#ffffff';
            clonedElement.style.width = '794px';
            clonedElement.style.maxWidth = '794px';
          },
        });
      } finally {
        restoreStylesheets();
      }
    })();

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;
    const printableHeight = pageHeight - margin * 2;

    let heightLeft = contentHeight;
    let position = margin;

    pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
    heightLeft -= printableHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = margin - (contentHeight - heightLeft);
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= printableHeight;
    }

    pdf.save(filename || 'invoice.pdf');
  } finally {
    restoreInlined();
    restoreElementAfterCapture(element, elementSnapshot);
    removeBackdrop();
  }
}
