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
          setTimeout(resolve, 3000);
        })
    )
  );
}

/** Copy resolved RGB styles from live DOM — avoids html2canvas choking on Tailwind oklch() */
function inlineComputedStyles(source, target) {
  if (!source || !target) return;

  const computed = window.getComputedStyle(source);
  STYLE_PROPS.forEach((prop) => {
    const value = computed[prop];
    if (value) target.style[prop] = value;
  });

  const sourceChildren = source.children;
  const targetChildren = target.children;
  for (let i = 0; i < sourceChildren.length; i += 1) {
    inlineComputedStyles(sourceChildren[i], targetChildren[i]);
  }
}

function stripClonedStylesheets(clonedDoc) {
  clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
    node.remove();
  });
}

/** html2canvas cannot parse Tailwind v4 oklch() — temporarily patch/disable stylesheets */
function withOklchSafeStylesheets(run) {
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

  return run().finally(() => {
    styleBackups.forEach(([style, content]) => {
      style.textContent = content;
    });
    linkBackups.forEach(([link, disabled]) => {
      link.disabled = disabled;
    });
  });
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
    'pointer-events:none',
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

export async function downloadInvoicePdf(element, filename) {
  if (!element) throw new Error('Invoice element not found');

  const snapshot = prepareElementForCapture(element);

  try {
    await waitForImages(element);
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    const canvas = await withOklchSafeStylesheets(() =>
      html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc, clonedElement) => {
          stripClonedStylesheets(clonedDoc);
          inlineComputedStyles(element, clonedElement);
          clonedElement.style.background = '#ffffff';
        },
      })
    );

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = contentHeight;
    let position = margin;

    pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      pdf.addPage();
      position = margin - (contentHeight - heightLeft);
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(filename || 'invoice.pdf');
  } finally {
    restoreElementAfterCapture(element, snapshot);
  }
}
