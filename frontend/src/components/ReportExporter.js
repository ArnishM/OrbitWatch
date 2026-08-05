/**
 * ReportExporter.jsx
 * Generates a polished, dark-themed PDF report using jsPDF primitives.
 * No canvas capture — all text/shapes drawn programmatically so text is
 * always crisp, selectable, and readable (no blurry screenshots).
 */
import { jsPDF } from 'jspdf';

// ── Brand colours ──────────────────────────────────────────────────────────
const C = {
  navy:     [3,  13,  26],
  surface:  [7,  26,  46],
  card:     [10, 37,  64],
  blue:     [33, 150, 243],
  cyan:     [0,  188, 212],
  green:    [67, 160, 71],
  orange:   [251,140, 0],
  red:      [229, 57, 53],
  purple:   [156, 39, 176],
  white:    [255,255,255],
  muted:    [148,163,184],
  border:   [30,  58,  90],
};

// ── Helpers ────────────────────────────────────────────────────────────────
function rgb(arr) { return { r: arr[0], g: arr[1], b: arr[2] }; }

function setFill(doc, arr)   { doc.setFillColor(arr[0], arr[1], arr[2]); }
function setDraw(doc, arr)   { doc.setDrawColor(arr[0], arr[1], arr[2]); }
function setFont(doc, arr)   { doc.setTextColor(arr[0], arr[1], arr[2]); }

function rect(doc, x, y, w, h, fill, radius = 0) {
  setFill(doc, fill);
  if (radius > 0) doc.roundedRect(x, y, w, h, radius, radius, 'F');
  else             doc.rect(x, y, w, h, 'F');
}

function line(doc, x1, y1, x2, y2, color, lw = 0.3) {
  setDraw(doc, color);
  doc.setLineWidth(lw);
  doc.line(x1, y1, x2, y2);
}

function text(doc, str, x, y, opts = {}) {
  const { size = 10, color = C.white, bold = false, align = 'left' } = opts;
  doc.setFontSize(size);
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  setFont(doc, color);
  doc.text(String(str), x, y, { align });
}

function badge(doc, label, x, y, color, w = 28) {
  rect(doc, x, y - 4, w, 6, [color[0], color[1], color[2], 0.18], 3);
  setDraw(doc, color);
  doc.setLineWidth(0.2);
  doc.roundedRect(x, y - 4, w, 6, 3, 3, 'S');
  text(doc, label, x + w / 2, y, { size: 7, color, align: 'center' });
}

function progressBar(doc, x, y, w, h, pct, fillColor) {
  rect(doc, x, y, w, h, [20, 50, 80], 2);           // track
  rect(doc, x, y, Math.max(2, w * pct / 100), h, fillColor, 2); // fill
}

// ── Page header / footer ───────────────────────────────────────────────────
function drawPageHeader(doc, district, year, pageNum, totalPages) {
  const W = doc.internal.pageSize.getWidth();

  // Dark nav bar
  rect(doc, 0, 0, W, 18, C.navy);
  rect(doc, 0, 0, W, 0.5, C.blue);                  // top accent line

  // Logo icon
  rect(doc, 6, 3, 12, 12, C.surface, 3);
  text(doc, '🛰', 12, 11, { size: 8, align: 'center' });

  // Brand name
  text(doc, 'OrbitWatch', 22, 8, { size: 11, bold: true });
  text(doc, 'SDG Intelligence Platform', 22, 13, { size: 7, color: C.muted });

  // Right: district + year + page
  text(doc, `${district} District · ${year}`, W - 8, 8, { size: 9, color: C.muted, align: 'right' });
  text(doc, `Page ${pageNum} of ${totalPages}`, W - 8, 13, { size: 7, color: C.muted, align: 'right' });

  // Separator
  line(doc, 0, 18, W, 18, C.border, 0.4);
}

function drawPageFooter(doc) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  line(doc, 0, H - 12, W, H - 12, C.border, 0.3);
  text(doc, 'Data sources: ISRO Bhuvan · Sentinel-2 L2A · Microsoft Planetary Computer', 8, H - 7, { size: 6.5, color: C.muted });
  text(doc, `Generated ${new Date().toLocaleString('en-IN')}`, W - 8, H - 7, { size: 6.5, color: C.muted, align: 'right' });
}

// ── Section heading ────────────────────────────────────────────────────────
function sectionHeading(doc, label, y, accentColor = C.blue) {
  const W = doc.internal.pageSize.getWidth();
  rect(doc, 0, y, W, 10, C.surface);
  rect(doc, 0, y, 3, 10, accentColor);                // left bar
  text(doc, label, 8, y + 6.5, { size: 10, bold: true });
  return y + 10;
}

// ── Main export function ───────────────────────────────────────────────────
export async function exportReport({ district, year, stats, sdgScores, insights, alerts, predictions, backendOnline }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 210
  const H = doc.internal.pageSize.getHeight();  // 297

  // ── PAGE 1 ─────────────────────────────────────────────────────────────

  // Full background
  rect(doc, 0, 0, W, H, C.navy);

  drawPageHeader(doc, district, year, 1, 3);

  // ── Hero cover block ───────────────────────────────────────────────────
  let y = 24;

  // Cover card
  rect(doc, 6, y, W - 12, 52, C.surface, 4);
  setDraw(doc, C.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(6, y, W - 12, 52, 4, 4, 'S');

  // Gradient-ish left accent strip
  rect(doc, 6, y, 4, 52, C.blue, 4);

  // Title
  text(doc, 'ENVIRONMENTAL SDG INTELLIGENCE', 16, y + 10, { size: 7, color: C.blue, bold: true });
  text(doc, `${district} District`, 16, y + 20, { size: 22, bold: true });
  text(doc, `Annual Report — ${year}`, 16, y + 29, { size: 12, color: C.muted });

  // Data source badge
  const ds = backendOnline ? 'Live Sentinel-2 Data' : 'Simulated Reference Data';
  const dsColor = backendOnline ? C.green : C.orange;
  badge(doc, ds, 16, y + 40, dsColor, 52);

  // Generated date
  text(doc, `Prepared: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, W - 14, y + 40, { size: 8, color: C.muted, align: 'right' });

  y += 58;

  // ── Executive Summary ─────────────────────────────────────────────────
  y = sectionHeading(doc, '1. EXECUTIVE SUMMARY', y, C.blue);
  y += 6;

  const summaryLines = [
    `This report presents satellite-derived environmental metrics for ${district} District for the year ${year}.`,
    `Data is processed from Sentinel-2 Level-2A imagery using NDWI, NDVI, and NDBI spectral indices.`,
    `Findings are mapped to UN Sustainable Development Goal targets (SDG-6, SDG-11, SDG-13, SDG-15).`,
  ];
  for (const l of summaryLines) {
    const lines = doc.splitTextToSize(l, W - 20);
    text(doc, lines.join('\n'), 10, y, { size: 9, color: C.muted });
    y += lines.length * 5 + 2;
  }

  y += 4;

  // ── Key Metrics ────────────────────────────────────────────────────────
  y = sectionHeading(doc, '2. KEY ENVIRONMENTAL METRICS', y, C.cyan);
  y += 6;

  const metricCards = [
    { label: 'Water Bodies', value: `${stats.water} km²`, unit: 'Surface Area', change: stats.waterChange, color: C.cyan,   icon: '💧' },
    { label: 'Vegetation',   value: `${stats.veg} km²`,   unit: 'Green Cover',  change: stats.vegChange,   color: C.green,  icon: '🌿' },
    { label: 'Urban Area',   value: `${stats.urban} km²`, unit: 'Built-up',     change: stats.urbanChange, color: C.orange, icon: '🏙' },
    { label: 'Surface Temp', value: `${stats.temp}°C`,    unit: 'Avg. Temp',    change: stats.tempChange,  color: C.red,    icon: '🌡' },
  ];

  const colW = (W - 14) / 4;
  for (let i = 0; i < metricCards.length; i++) {
    const m = metricCards[i];
    const cx = 7 + i * colW;
    const cw = colW - 3;

    // Card bg
    rect(doc, cx, y, cw, 32, C.card, 3);
    setDraw(doc, m.color);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, y, cw, 32, 3, 3, 'S');

    // Top colour bar
    rect(doc, cx, y, cw, 2, m.color, 3);

    // Icon
    text(doc, m.icon, cx + cw / 2, y + 10, { size: 11, align: 'center' });

    // Value
    text(doc, m.value, cx + cw / 2, y + 19, { size: 11, bold: true, color: m.color, align: 'center' });

    // Label
    text(doc, m.label, cx + cw / 2, y + 25, { size: 7, color: C.white, align: 'center' });

    // Change
    if (m.change) {
      const changeColor = m.change.startsWith('+') ? C.red : C.green;
      text(doc, m.change, cx + cw / 2, y + 30, { size: 7, color: changeColor, align: 'center' });
    }
  }

  y += 38;

  // ── SDG Scores ────────────────────────────────────────────────────────
  y = sectionHeading(doc, '3. SDG COMPLIANCE SCORES', y, C.green);
  y += 6;

  const sdgItems = [
    { label: 'SDG-6: Clean Water & Sanitation',  score: sdgScores.Water,      color: C.cyan   },
    { label: 'SDG-15: Life on Land (Vegetation)', score: sdgScores.Vegetation, color: C.green  },
    { label: 'SDG-11: Sustainable Cities',        score: sdgScores.Urban,      color: C.orange },
    { label: 'SDG-13: Climate Action',            score: sdgScores.Climate,    color: C.red    },
  ];

  const overall = Math.round(Object.values(sdgScores).reduce((a, b) => a + b, 0) / 4);

  // Overall score box
  rect(doc, 7, y, W - 14, 16, C.card, 3);
  text(doc, 'Overall SDG Score', 13, y + 6, { size: 9, color: C.muted });
  text(doc, `${overall}/100`, 13, y + 13, { size: 14, bold: true, color: overall >= 70 ? C.green : overall >= 50 ? C.orange : C.red });
  const overallStatus = overall >= 70 ? 'Good Standing' : overall >= 50 ? 'Moderate Risk' : 'Critical';
  text(doc, overallStatus, W - 14, y + 10, { size: 9, color: overall >= 70 ? C.green : overall >= 50 ? C.orange : C.red, align: 'right' });
  progressBar(doc, 60, y + 8, W - 80, 4, overall, overall >= 70 ? C.green : overall >= 50 ? C.orange : C.red);

  y += 22;

  for (const s of sdgItems) {
    rect(doc, 7, y, W - 14, 11, C.surface, 2);
    text(doc, s.label, 12, y + 7, { size: 8.5, color: C.white });
    const scoreStr = `${s.score}/100`;
    text(doc, scoreStr, W - 36, y + 7, { size: 8.5, color: s.color, bold: true });
    progressBar(doc, W - 34, y + 3.5, 28, 4, s.score, s.color);
    y += 14;
  }

  drawPageFooter(doc);

  // ── PAGE 2 ─────────────────────────────────────────────────────────────
  doc.addPage();
  rect(doc, 0, 0, W, H, C.navy);
  drawPageHeader(doc, district, year, 2, 3);

  y = 24;

  // ── AI Insights ───────────────────────────────────────────────────────
  y = sectionHeading(doc, '4. AI-GENERATED ENVIRONMENTAL INSIGHTS', y, C.purple);
  y += 6;

  const insightTypeMap = {
    danger:  { color: C.red,    label: '⚠ Critical',  border: C.red    },
    warning: { color: C.orange, label: '⚡ Warning',   border: C.orange },
    success: { color: C.green,  label: '✓ Positive',  border: C.green  },
    info:    { color: C.blue,   label: 'ℹ Info',      border: C.blue   },
  };

  const insightsToShow = insights?.slice(0, 6) || [];
  for (const ins of insightsToShow) {
    const cfg = insightTypeMap[ins.type] || insightTypeMap.info;
    const textLines = doc.splitTextToSize(ins.text, W - 36);
    const cardH = Math.max(14, textLines.length * 4.5 + 6);

    rect(doc, 7, y, W - 14, cardH, C.card, 3);
    rect(doc, 7, y, 3, cardH, cfg.color, 3);            // left bar

    text(doc, cfg.label, 14, y + 5.5, { size: 7, color: cfg.color, bold: true });
    text(doc, textLines, 14, y + 11, { size: 8.5, color: C.white });

    y += cardH + 4;
  }

  y += 2;

  // ── Environmental Alerts ──────────────────────────────────────────────
  y = sectionHeading(doc, '5. ENVIRONMENTAL ALERTS', y, C.red);
  y += 6;

  const alertsToShow = alerts?.slice(0, 6) || [];
  if (alertsToShow.length === 0) {
    rect(doc, 7, y, W - 14, 12, C.card, 3);
    text(doc, '✅ All environmental indicators are within acceptable thresholds.', 13, y + 7.5, { size: 9, color: C.green });
    y += 16;
  } else {
    for (const a of alertsToShow) {
      const sevColor = a.severity === 'critical' ? C.red : a.severity === 'warning' ? C.orange : C.green;
      const textLines = doc.splitTextToSize(a.text, W - 40);
      const cardH = Math.max(13, textLines.length * 4.5 + 5);

      rect(doc, 7, y, W - 14, cardH, C.card, 3);
      rect(doc, 7, y, 2, cardH, sevColor);

      text(doc, a.icon || '⚠', 14, y + cardH / 2 + 1, { size: 10 });
      text(doc, textLines, 22, y + 6, { size: 8.5, color: C.white });
      text(doc, a.time || '', W - 10, y + cardH / 2 + 1, { size: 7, color: C.muted, align: 'right' });

      y += cardH + 3;
    }
  }

  drawPageFooter(doc);

  // ── PAGE 3 ─────────────────────────────────────────────────────────────
  doc.addPage();
  rect(doc, 0, 0, W, H, C.navy);
  drawPageHeader(doc, district, year, 3, 3);

  y = 24;

  // ── Predictions ───────────────────────────────────────────────────────
  y = sectionHeading(doc, '6. 5-YEAR PREDICTIVE OUTLOOK (2025 – 2030)', y, C.orange);
  y += 6;

  // Disclaimer
  rect(doc, 7, y, W - 14, 10, C.surface, 3);
  text(doc, 'ℹ  Projections generated using Scikit-Learn linear regression on historical Sentinel-2 time series (2021–2024).', 12, y + 6.5, { size: 7.5, color: C.muted });
  y += 14;

  const predItems = predictions || [
    { label: 'Water Bodies',  val: '18.2 km²', delta: '-26%', conf: 92, color: C.cyan   },
    { label: 'Vegetation',    val: '128 km²',  delta: '-19%', conf: 88, color: C.green  },
    { label: 'Urban Area',    val: '118 km²',  delta: '+32%', conf: 94, color: C.orange },
    { label: 'Surface Temp',  val: '36.4°C',   delta: '+4.4°C', conf: 76, color: C.red  },
  ];

  for (const p of predItems) {
    rect(doc, 7, y, W - 14, 16, C.card, 3);

    const dotColor = p.color || C.blue;
    setFill(doc, dotColor);
    doc.circle(14, y + 8, 2.5, 'F');

    text(doc, p.label, 20, y + 6, { size: 9, bold: true });
    text(doc, 'Projected 2030 value', 20, y + 12, { size: 7.5, color: C.muted });

    text(doc, p.val, W - 55, y + 8, { size: 12, bold: true, color: dotColor, align: 'right' });

    const dColor = String(p.delta).startsWith('+') ? C.red : C.green;
    text(doc, p.delta, W - 8, y + 8, { size: 10, bold: true, color: dColor, align: 'right' });

    if (p.conf) {
      text(doc, `Confidence: ${p.conf}%`, W - 8, y + 14, { size: 7, color: C.muted, align: 'right' });
    }

    y += 20;
  }

  y += 4;

  // ── Recommendations ───────────────────────────────────────────────────
  y = sectionHeading(doc, '7. POLICY RECOMMENDATIONS', y, C.green);
  y += 6;

  const recs = [
    { num: '01', title: 'Water Conservation',  desc: `Implement rainwater harvesting programs in urban expansion zones of ${district}. Target 15% increase in water body area by 2027.` },
    { num: '02', title: 'Green Buffer Zones',  desc: 'Mandate minimum 20% green cover in all new development layouts. Enforce through local building codes aligned with SDG-15.' },
    { num: '03', title: 'Heat Island Mitigation', desc: 'Deploy reflective roofing and tree-planting drives in high NDBI areas. Aim to reduce surface temperature by 1.5°C by 2028.' },
    { num: '04', title: 'Urban Growth Management', desc: `Establish growth boundary limits for ${district}. Review development clearances against satellite change-detection benchmarks quarterly.` },
  ];

  for (const r of recs) {
    const descLines = doc.splitTextToSize(r.desc, W - 40);
    const cardH = descLines.length * 4.5 + 14;

    rect(doc, 7, y, W - 14, cardH, C.card, 3);
    setFill(doc, C.blue);
    doc.circle(14, y + 9, 5, 'F');
    text(doc, r.num, 14, y + 11, { size: 8, bold: true, align: 'center' });

    text(doc, r.title, 23, y + 8, { size: 9.5, bold: true, color: C.white });
    text(doc, descLines, 23, y + 14, { size: 8, color: C.muted });

    y += cardH + 4;
  }

  // ── Sign-off ──────────────────────────────────────────────────────────
  y += 4;
  rect(doc, 7, y, W - 14, 18, C.surface, 4);
  rect(doc, 7, y, W - 14, 2, C.blue, 3);
  text(doc, 'OrbitWatch — Turning Satellite Data into SDG Action', W / 2, y + 10, { size: 9, bold: true, align: 'center', color: C.white });
  text(doc, 'github.com/ArnishM/OrbitWatch  ·  Powered by Sentinel-2 + FastAPI + React', W / 2, y + 16, { size: 7, color: C.muted, align: 'center' });

  drawPageFooter(doc);

  // ── Save ───────────────────────────────────────────────────────────────
  const filename = `OrbitWatch_${district}_${year}_Report.pdf`;
  doc.save(filename);
}
