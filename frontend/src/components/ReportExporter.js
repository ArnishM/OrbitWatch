/**
 * ReportExporter.js
 * Generates a crisp 3-page PDF using jsPDF primitives only.
 * IMPORTANT: jsPDF built-in fonts (Helvetica/Times) do NOT support emoji.
 * Every icon/symbol here uses plain ASCII or Latin-1 only.
 */
import { jsPDF } from 'jspdf';

// ── Colours (RGB arrays) ───────────────────────────────────────────────────
const NAVY    = [3,   13,  26];
const SURFACE = [7,   26,  46];
const CARD    = [10,  37,  64];
const BORDER  = [30,  58,  90];
const MUTED   = [100, 116, 139];
const WHITE   = [255, 255, 255];
const BLUE    = [33,  150, 243];
const CYAN    = [0,   188, 212];
const GREEN   = [67,  160,  71];
const ORANGE  = [251, 140,   0];
const RED     = [229,  57,  53];
const PURPLE  = [156,  39, 176];

// ── Primitives ─────────────────────────────────────────────────────────────
function fill(doc, c)  { doc.setFillColor(c[0], c[1], c[2]); }
function draw(doc, c)  { doc.setDrawColor(c[0], c[1], c[2]); }
function tcolor(doc,c) { doc.setTextColor(c[0], c[1], c[2]); }

function box(doc, x, y, w, h, bg, r = 0) {
  fill(doc, bg);
  r > 0 ? doc.roundedRect(x, y, w, h, r, r, 'F') : doc.rect(x, y, w, h, 'F');
}

function boxStroke(doc, x, y, w, h, bg, strokeC, r = 0, lw = 0.3) {
  box(doc, x, y, w, h, bg, r);
  draw(doc, strokeC);
  doc.setLineWidth(lw);
  r > 0 ? doc.roundedRect(x, y, w, h, r, r, 'S') : doc.rect(x, y, w, h, 'S');
}

function hline(doc, x1, y1, x2, c, lw = 0.3) {
  draw(doc, c);
  doc.setLineWidth(lw);
  doc.line(x1, y1, x2, y1);
}

function t(doc, str, x, y, { size = 10, color = WHITE, bold = false, align = 'left', maxW } = {}) {
  doc.setFontSize(size);
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  tcolor(doc, color);
  const opts = { align };
  if (maxW) opts.maxWidth = maxW;
  doc.text(String(str ?? ''), x, y, opts);
}

function wrappedText(doc, str, x, y, maxW, { size = 9, color = WHITE, bold = false, lineH = 5 } = {}) {
  doc.setFontSize(size);
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  tcolor(doc, color);
  const lines = doc.splitTextToSize(String(str ?? ''), maxW);
  doc.text(lines, x, y);
  return lines.length * lineH;
}

function progressBar(doc, x, y, w, h, pct, barColor) {
  box(doc, x, y, w, h, SURFACE);                             // track
  const filled = Math.max(2, (Math.min(pct, 100) / 100) * w);
  box(doc, x, y, filled, h, barColor);
}

function colorDot(doc, x, y, r, c) {
  fill(doc, c);
  doc.circle(x, y, r, 'F');
}

function statusLabel(doc, label, x, y, c) {
  // A small pill-shaped coloured badge using only text
  box(doc, x - 1, y - 3.5, doc.getTextWidth(label) + 6, 5.5, [c[0], c[1], c[2]], 2);
  t(doc, label, x + 2, y, { size: 7, color: WHITE, bold: true });
}

// ── Page chrome ─────────────────────────────────────────────────────────────
function pageBackground(doc, W, H) {
  box(doc, 0, 0, W, H, NAVY);
}

function header(doc, district, year, pageNum, total, W) {
  // Background bar
  box(doc, 0, 0, W, 20, SURFACE);
  // Top accent line
  box(doc, 0, 0, W, 1, BLUE);

  // Logo block
  box(doc, 6, 3.5, 13, 13, CARD, 3);
  // "OW" text as logo fallback (no emoji)
  t(doc, 'OW', 12.5, 12, { size: 7, color: BLUE, bold: true, align: 'center' });

  // Brand
  t(doc, 'OrbitWatch', 23, 9, { size: 11, bold: true });
  t(doc, 'SDG Intelligence Platform', 23, 15, { size: 7, color: MUTED });

  // Right info
  t(doc, `${district} District  |  ${year}`, W - 8, 9, { size: 8.5, color: MUTED, align: 'right' });
  t(doc, `Page ${pageNum} of ${total}`, W - 8, 15, { size: 7, color: MUTED, align: 'right' });

  hline(doc, 0, 20, W, BORDER, 0.5);
}

function footer(doc, W, H) {
  hline(doc, 0, H - 13, W, BORDER, 0.3);
  t(doc, 'Data: ISRO Bhuvan  |  Sentinel-2 L2A  |  Microsoft Planetary Computer', 8, H - 7, { size: 6.5, color: MUTED });
  t(doc, `Generated ${new Date().toLocaleString('en-IN')}`, W - 8, H - 7, { size: 6.5, color: MUTED, align: 'right' });
}

// ── Section heading ──────────────────────────────────────────────────────────
function sectionHead(doc, label, y, accentColor, W) {
  box(doc, 0, y, W, 11, SURFACE);
  box(doc, 0, y, 3.5, 11, accentColor);
  t(doc, label, 9, y + 7.5, { size: 9.5, bold: true });
  return y + 11;
}

// ── Main export ──────────────────────────────────────────────────────────────
export async function exportReport({
  district, year, stats, sdgScores, insights, alerts, predictions, backendOnline
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 210
  const H = doc.internal.pageSize.getHeight();  // 297
  const PAGES = 3;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PAGE 1 — Cover + Metrics + SDG Scores
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  pageBackground(doc, W, H);
  header(doc, district, year, 1, PAGES, W);

  let y = 26;

  // ── Cover card ──────────────────────────────────────
  boxStroke(doc, 6, y, W - 12, 54, CARD, BORDER, 4, 0.4);
  box(doc, 6, y, 4, 54, BLUE, 4);  // Left accent bar

  t(doc, 'ENVIRONMENTAL SDG INTELLIGENCE REPORT', 16, y + 9, { size: 7, color: BLUE, bold: true });
  t(doc, `${district} District`, 16, y + 20, { size: 21, bold: true });
  t(doc, `Annual Report  |  Year ${year}`, 16, y + 29, { size: 11, color: MUTED });
  hline(doc, 16, y + 34, W - 14, BORDER, 0.3);

  // Data source + date
  const dsLabel = backendOnline ? 'Live Sentinel-2 Data' : 'Simulated Reference Data';
  const dsColor = backendOnline ? GREEN : ORANGE;
  colorDot(doc, 19, y + 42, 2.5, dsColor);
  t(doc, dsLabel, 24, y + 43.5, { size: 8.5, color: dsColor, bold: true });

  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  t(doc, `Prepared: ${dateStr}`, W - 12, y + 43.5, { size: 8, color: MUTED, align: 'right' });

  y += 60;

  // ── 1. Executive Summary ────────────────────────────
  y = sectionHead(doc, '1. EXECUTIVE SUMMARY', y, BLUE, W);
  y += 5;

  const summaryParas = [
    `This report presents satellite-derived environmental metrics for ${district} District for the year ${year}.`,
    `Data is processed from Sentinel-2 Level-2A imagery using NDWI, NDVI, and NDBI spectral indices to quantify water bodies, vegetation cover, and urban built-up areas.`,
    `Findings are aligned to UN Sustainable Development Goals: SDG-6 (Clean Water), SDG-11 (Sustainable Cities), SDG-13 (Climate Action), and SDG-15 (Life on Land).`,
  ];

  for (const para of summaryParas) {
    const h = wrappedText(doc, para, 10, y, W - 20, { size: 9, color: [180, 195, 215] });
    y += h + 3;
  }

  y += 3;

  // ── 2. Key Metrics ──────────────────────────────────
  y = sectionHead(doc, '2. KEY ENVIRONMENTAL METRICS', y, CYAN, W);
  y += 5;

  const metrics = [
    { label: 'WATER BODIES',  sub: 'Surface Area',  val: `${stats.water} km2`, change: stats.waterChange, color: CYAN   },
    { label: 'VEGETATION',    sub: 'Green Cover',    val: `${stats.veg} km2`,   change: stats.vegChange,   color: GREEN  },
    { label: 'URBAN AREA',    sub: 'Built-up',       val: `${stats.urban} km2`, change: stats.urbanChange, color: ORANGE },
    { label: 'SURFACE TEMP',  sub: 'Average',        val: `${stats.temp} C`,    change: stats.tempChange,  color: RED    },
  ];

  const cw = (W - 14) / 4;
  metrics.forEach((m, i) => {
    const cx = 7 + i * cw;
    const cwd = cw - 3;
    boxStroke(doc, cx, y, cwd, 35, CARD, BORDER, 3, 0.3);
    box(doc, cx, y, cwd, 2.5, m.color, 3);  // top colour strip

    t(doc, m.label, cx + cwd / 2, y + 11, { size: 7, color: m.color, bold: true, align: 'center' });
    t(doc, m.sub,   cx + cwd / 2, y + 16, { size: 6.5, color: MUTED, align: 'center' });
    t(doc, m.val,   cx + cwd / 2, y + 24, { size: 10,  bold: true, color: WHITE, align: 'center' });

    if (m.change) {
      const isUp = m.change.startsWith('+');
      const chColor = isUp ? RED : GREEN;
      const arrow = isUp ? '(+)' : '(-)';
      t(doc, `${arrow} ${m.change}`, cx + cwd / 2, y + 31, { size: 7.5, color: chColor, align: 'center' });
    }
  });

  y += 41;

  // ── 3. SDG Compliance ──────────────────────────────
  y = sectionHead(doc, '3. SDG COMPLIANCE SCORES', y, GREEN, W);
  y += 5;

  const overall = Math.round(Object.values(sdgScores).reduce((a, b) => a + b, 0) / 4);
  const overallColor = overall >= 70 ? GREEN : overall >= 50 ? ORANGE : RED;
  const overallLabel = overall >= 70 ? 'Good Standing' : overall >= 50 ? 'Moderate Risk' : 'Critical Risk';

  // Overall score row
  boxStroke(doc, 7, y, W - 14, 17, CARD, BORDER, 3, 0.3);
  t(doc, 'OVERALL SDG SCORE', 13, y + 6.5, { size: 8, color: MUTED, bold: true });
  t(doc, `${overall} / 100`, 13, y + 13, { size: 13, bold: true, color: overallColor });
  t(doc, overallLabel, W - 12, y + 10, { size: 9, color: overallColor, bold: true, align: 'right' });
  progressBar(doc, 65, y + 8, W - 85, 4, overall, overallColor);
  y += 22;

  const sdgRows = [
    { label: 'SDG-6:  Clean Water & Sanitation',      key: 'Water',      color: CYAN   },
    { label: 'SDG-15: Life on Land (Vegetation)',      key: 'Vegetation', color: GREEN  },
    { label: 'SDG-11: Sustainable Cities & Infra',     key: 'Urban',      color: ORANGE },
    { label: 'SDG-13: Climate Action',                 key: 'Climate',    color: RED    },
  ];

  for (const row of sdgRows) {
    const score = sdgScores[row.key] ?? 0;
    boxStroke(doc, 7, y, W - 14, 12, SURFACE, BORDER, 2, 0.2);
    colorDot(doc, 14, y + 6, 2.5, row.color);
    t(doc, row.label, 20, y + 7.5, { size: 8.5, color: WHITE });
    t(doc, `${score} / 100`, W - 45, y + 7.5, { size: 8.5, color: row.color, bold: true });
    progressBar(doc, W - 42, y + 4, 33, 4, score, row.color);
    y += 15;
  }

  footer(doc, W, H);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PAGE 2 — AI Insights + Alerts
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  doc.addPage();
  pageBackground(doc, W, H);
  header(doc, district, year, 2, PAGES, W);
  y = 26;

  // ── 4. AI Insights ─────────────────────────────────
  y = sectionHead(doc, '4. AI-GENERATED ENVIRONMENTAL INSIGHTS', y, PURPLE, W);
  y += 5;

  const insightCfg = {
    danger:  { color: RED,    tag: 'CRITICAL' },
    warning: { color: ORANGE, tag: 'WARNING'  },
    success: { color: GREEN,  tag: 'POSITIVE' },
    info:    { color: BLUE,   tag: 'INFO'     },
  };

  const insightsToShow = (insights ?? []).slice(0, 6);
  for (const ins of insightsToShow) {
    const cfg = insightCfg[ins.type] ?? insightCfg.info;
    // Strip non-ASCII characters from insight text to avoid garbled output
    const safeText = (ins.text ?? '').replace(/[^\x00-\x7F]/g, '');
    const lines = doc.splitTextToSize(safeText, W - 38);
    const cardH = Math.max(16, lines.length * 4.8 + 9);

    boxStroke(doc, 7, y, W - 14, cardH, CARD, BORDER, 3, 0.3);
    box(doc, 7, y, 3.5, cardH, cfg.color, 3);  // left accent

    // Tag pill
    statusLabel(doc, cfg.tag, 15, y + 6, cfg.color);
    t(doc, lines, 15, y + 12, { size: 8.5, color: [210, 225, 240] });

    y += cardH + 4;
    if (y > H - 30) break;
  }

  y += 4;

  // ── 5. Environmental Alerts ─────────────────────────
  y = sectionHead(doc, '5. ENVIRONMENTAL ALERTS', y, RED, W);
  y += 5;

  const alertsToShow = (alerts ?? []).slice(0, 5);
  if (alertsToShow.length === 0) {
    boxStroke(doc, 7, y, W - 14, 13, CARD, BORDER, 3, 0.3);
    colorDot(doc, 16, y + 6.5, 3, GREEN);
    t(doc, 'All environmental indicators are within acceptable thresholds.', 23, y + 8, { size: 9, color: GREEN });
    y += 17;
  } else {
    for (const a of alertsToShow) {
      const sevColor = a.severity === 'critical' ? RED : a.severity === 'warning' ? ORANGE : GREEN;
      const sevTag   = a.severity === 'critical' ? 'CRITICAL' : a.severity === 'warning' ? 'WARNING' : 'OK';
      // Strip emoji/non-ASCII from alert text
      const safeText = (a.text ?? '').replace(/[^\x00-\x7F]/g, '').trim();
      const lines = doc.splitTextToSize(safeText, W - 50);
      const cardH = Math.max(14, lines.length * 4.8 + 8);

      boxStroke(doc, 7, y, W - 14, cardH, CARD, BORDER, 3, 0.3);
      box(doc, 7, y, 3.5, cardH, sevColor, 3);

      statusLabel(doc, sevTag, 15, y + 7, sevColor);
      t(doc, lines, 15, y + 12, { size: 8.5, color: [210, 225, 240] });
      if (a.time) {
        t(doc, String(a.time), W - 10, y + cardH - 4, { size: 7, color: MUTED, align: 'right' });
      }
      y += cardH + 4;
      if (y > H - 30) break;
    }
  }

  footer(doc, W, H);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PAGE 3 — Predictions + Recommendations
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  doc.addPage();
  pageBackground(doc, W, H);
  header(doc, district, year, 3, PAGES, W);
  y = 26;

  // ── 6. Predictions ──────────────────────────────────
  y = sectionHead(doc, '6. 5-YEAR PREDICTIVE OUTLOOK  (2025 - 2030)', y, ORANGE, W);
  y += 5;

  // Disclaimer
  boxStroke(doc, 7, y, W - 14, 11, SURFACE, BORDER, 2, 0.2);
  t(doc, 'Model: Scikit-Learn linear regression on Sentinel-2 time series data (2021-2024).', 12, y + 7, { size: 7.5, color: MUTED });
  y += 15;

  const defaultPreds = [
    { label: 'Water Bodies',  val: '18.2 km2', delta: '-26%',  conf: 92, color: CYAN   },
    { label: 'Vegetation',    val: '128 km2',  delta: '-19%',  conf: 88, color: GREEN  },
    { label: 'Urban Area',    val: '118 km2',  delta: '+32%',  conf: 94, color: ORANGE },
    { label: 'Surface Temp',  val: '36.4 C',   delta: '+4.4C', conf: 76, color: RED    },
  ];
  const predItems = predictions ?? defaultPreds;

  for (const p of predItems) {
    const pColor = p.color ?? BLUE;
    const isUp   = String(p.delta ?? '').startsWith('+');
    const dColor = isUp ? RED : GREEN;
    const safeVal   = String(p.val   ?? '').replace(/[^\x00-\x7F]/g, '');
    const safeDelta = String(p.delta ?? '').replace(/[^\x00-\x7F]/g, '');

    boxStroke(doc, 7, y, W - 14, 17, CARD, BORDER, 3, 0.3);
    colorDot(doc, 15, y + 8.5, 3, pColor);
    t(doc, p.label ?? '', 22, y + 7,  { size: 9, bold: true });
    t(doc, 'Projected 2030 value',  22, y + 13, { size: 7,  color: MUTED });
    t(doc, safeVal,   W - 52, y + 10, { size: 12, bold: true, color: pColor, align: 'right' });
    t(doc, safeDelta, W - 10, y + 8,  { size: 10, bold: true, color: dColor, align: 'right' });
    if (p.conf) {
      t(doc, `Confidence: ${p.conf}%`, W - 10, y + 14, { size: 7, color: MUTED, align: 'right' });
    }
    y += 21;
  }

  y += 4;

  // ── 7. Policy Recommendations ───────────────────────
  y = sectionHead(doc, '7. POLICY RECOMMENDATIONS', y, GREEN, W);
  y += 5;

  const recs = [
    {
      num: '01',
      title: 'Water Conservation',
      desc: `Implement rainwater harvesting in urban expansion zones of ${district}. Target 15% increase in water body coverage by 2027 through check dam construction and lake rejuvenation programs.`,
    },
    {
      num: '02',
      title: 'Green Buffer Zones',
      desc: 'Mandate minimum 20% green cover in all new development layouts. Enforce through local building codes and development control rules aligned with SDG-15 targets.',
    },
    {
      num: '03',
      title: 'Urban Heat Mitigation',
      desc: `Deploy reflective roofing materials and urban tree-planting drives in high NDBI zones of ${district}. Target a 1.5 deg C reduction in surface temperature by 2028.`,
    },
    {
      num: '04',
      title: 'Growth Boundary Management',
      desc: 'Establish clear urban growth boundary limits. Review new development clearances against satellite change-detection benchmarks on a quarterly basis to prevent uncontrolled sprawl.',
    },
  ];

  for (const r of recs) {
    const lines   = doc.splitTextToSize(r.desc, W - 42);
    const cardH   = lines.length * 4.8 + 16;

    boxStroke(doc, 7, y, W - 14, cardH, CARD, BORDER, 3, 0.3);

    // Number circle
    fill(doc, BLUE);
    doc.circle(16, y + cardH / 2, 5.5, 'F');
    t(doc, r.num, 16, y + cardH / 2 + 1.5, { size: 7.5, bold: true, align: 'center' });

    t(doc, r.title, 26, y + 8,  { size: 10, bold: true });
    t(doc, lines,   26, y + 14, { size: 8, color: [180, 195, 215] });

    y += cardH + 5;
    if (y > H - 30) break;
  }

  // ── Sign-off ─────────────────────────────────────────
  y += 4;
  if (y < H - 36) {
    boxStroke(doc, 7, y, W - 14, 20, SURFACE, BLUE, 4, 0.5);
    box(doc, 7, y, W - 14, 2, BLUE, 4);
    t(doc, 'OrbitWatch  |  Turning Satellite Data into SDG Action', W / 2, y + 11, { size: 9.5, bold: true, align: 'center' });
    t(doc, `github.com/ArnishM/OrbitWatch  |  Powered by Sentinel-2 + FastAPI + React`, W / 2, y + 17, { size: 7, color: MUTED, align: 'center' });
  }

  footer(doc, W, H);

  // ── Save ──────────────────────────────────────────────
  doc.save(`OrbitWatch_${district}_${year}_Report.pdf`);
}
