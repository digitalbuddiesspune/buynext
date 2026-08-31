/** Hex-only CSS for PDF capture — no Tailwind / oklch dependency */
export const INVOICE_EXPORT_CSS = `
.invoice-export{
  width:794px;
  max-width:794px;
  min-height:1123px;
  margin:0 auto;
  background:#fff;
  color:#111827;
  padding:40px 36px;
  font-family:Arial,Helvetica,sans-serif;
  font-size:14px;
  line-height:1.6;
  box-sizing:border-box;
  display:flex;
  flex-direction:column;
}
.invoice-export-sheet{
  margin-top:auto;
  margin-bottom:auto;
  width:100%;
}
.invoice-export *{box-sizing:border-box;}
.invoice-export-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;}
.invoice-export-logo{height:70px;max-width:220px;object-fit:contain;}
.invoice-export-doc-title{font-size:30px;font-weight:700;letter-spacing:.12em;text-align:right;margin:0;}
.invoice-export-company{font-size:11px;color:#6B7280;margin:0 0 20px;line-height:1.5;}
.invoice-export-block{border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-bottom:20px;}
.invoice-export-block:last-of-type{margin-bottom:0;}
.invoice-export-block-title{background:#F3F4F6;color:#111827;font-weight:700;padding:8px 14px;}
.invoice-export-table{width:100%;border-collapse:collapse;}
.invoice-export-table th{background:#F9FAFB;border:1px solid #E5E7EB;padding:5px 10px;font-size:11px;text-transform:uppercase;text-align:left;vertical-align:middle;line-height:1.3;}
.invoice-export-table th.center{text-align:center;}
.invoice-export-table th.right{text-align:right;}
.invoice-export-table td{border:1px solid #E5E7EB;padding:5px 10px;font-size:12px;vertical-align:middle;line-height:1.3;}
.invoice-export-table td.center{text-align:center;}
.invoice-export-table td.right{text-align:right;}
.invoice-export-table tbody tr:nth-child(even){background:#FCFCFC;}
.invoice-export-details-table{width:100%;border-collapse:collapse;}
.invoice-export-details-table td{border:1px solid #E5E7EB;padding:5px 10px;font-size:12px;vertical-align:middle;line-height:1.3;}
.invoice-export-details-table td:first-child{background:#FAFAFA;width:40%;font-weight:600;color:#6B7280;}
.invoice-export-details-table tr:last-child td{border-bottom:none;}
.invoice-export-body-text{padding:8px 14px;font-size:12px;color:#374151;line-height:1.4;}
.invoice-export-body-text p{margin:0 0 4px;}
.invoice-export-body-text .name{font-weight:700;color:#111827;margin-bottom:4px;}
.invoice-export-totals{display:flex;justify-content:flex-end;margin-top:16px;margin-bottom:20px;}
.invoice-export-totals-box{width:320px;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;}
.invoice-export-totals-row{display:flex;justify-content:space-between;padding:5px 12px;border-bottom:1px solid #E5E7EB;font-size:12px;}
.invoice-export-totals-grand{display:flex;justify-content:space-between;padding:8px 12px;background:#fff;color:#111827;font-weight:700;font-size:13px;border-top:1px solid #E5E7EB;}
.invoice-export-footer{margin-top:0;padding-top:16px;border-top:1px dashed #D1D5DB;text-align:center;font-size:11px;color:#6B7280;}

@media print {
  @page {
    size: A4;
    margin: 10mm;
  }
  html, body {
    height: auto !important;
    overflow: visible !important;
  }
  .invoice-export {
    min-height: auto !important;
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    display: block !important;
    page-break-after: auto;
  }
  .invoice-export-sheet {
    margin: 0 !important;
  }
  .invoice-export-block,
  .invoice-export-totals-box {
    page-break-inside: avoid;
  }
  .invoice-export-table tr {
    page-break-inside: avoid;
  }
}
`;
