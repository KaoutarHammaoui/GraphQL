import { formatXP } from "./profile.js";

export function drawXpChart(projects) {
  const svg = document.getElementById("xpChart");
  svg.innerHTML = "";

  const chartHeight = 180;
  const minWidth = 14
  const neededWidth = projects.length * minWidth
  const chartWidth = Math.max(650, neededWidth);
  const maxXP = Math.max(...projects.map((p) => Number(p.amount)));
  const barWidth = chartWidth / projects.length;

  const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");

  axis.setAttribute("x1", 0);
  axis.setAttribute("y1", chartHeight);
  axis.setAttribute("x2", chartWidth);
  axis.setAttribute("y2", chartHeight);

  axis.setAttribute("stroke", "#3a3252");

  svg.setAttribute("width", chartWidth);
  svg.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
  svg.appendChild(axis);

  projects.forEach((project, index) => {
    const barHeight = Math.max(
      (Number(project.amount) / maxXP) * chartHeight,
      2,
    );
    const gap = 2;
    const x = index * barWidth ;
    const y = chartHeight - barHeight;
    const rectWidth=Math.max(barWidth-gap,2)
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const title = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "title",
    );

    title.textContent = `${project.path.split("/").pop()}
${formatXP(Number(project.amount))}`;

    rect.appendChild(title);
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", rectWidth);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("fill", "url(#xpBarGradient)");
    rect.setAttribute("stroke", "#c084fc");
    rect.setAttribute("stroke-width", "1");
    rect.setAttribute("rx", 3);
    rect.setAttribute("ry", 3);
    svg.appendChild(rect);
  });

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <linearGradient id="xpBarGradient" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#ff4fd8" />
    </linearGradient>
  `;
  svg.appendChild(defs);
}

export function drawAuditChart(up, down) {
  const svg = document.getElementById("auditChart");

  const size = 220;
  const center = size / 2;

  const radius = 80;
  const stroke = 12;

  const total = up + down;

  if (total === 0) {
    svg.innerHTML = `
      <circle
        cx="${center}"
        cy="${center}"
        r="${radius}"
        fill="none"
        stroke="#251c3d"
        stroke-width="${stroke}"
      />
      <text
        x="${center}"
        y="${center - 4}"
        text-anchor="middle"
        font-size="15"
        fill="#9a8fb5">
        No audits
      </text>
      <text
        x="${center}"
        y="${center + 18}"
        text-anchor="middle"
        font-size="12"
        fill="#6a6285">
        yet
      </text>
    `;
    return;
  }

  const upPercent = up / total;
  const downPercent = down / total;

  const upText = formatXP(up);
  const downText = formatXP(down);

  const circumference = 2 * Math.PI * radius;

  const upLength = circumference * upPercent;
  const downLength = circumference * downPercent;

  const ratioLabel = down === 0 ? "—" : `${(up / down).toFixed(1)}×`;

  svg.innerHTML = `
    <circle
      cx="${center}"
      cy="${center}"
      r="${radius}"
      fill="none"
      stroke="#251c3d"
      stroke-linecap="round"
      stroke-width="${stroke}"
    />

    <circle
      cx="${center}"
      cy="${center}"
      r="${radius}"
      fill="none"
      stroke="#8b5cf6"
      stroke-width="${stroke}"
      stroke-linecap="round"
      stroke-dasharray="${upLength} ${circumference}"
      transform="rotate(-90 ${center} ${center})"
      style="filter: drop-shadow(0 0 6px rgba(139,92,246,0.8));"
    />

    <circle
      cx="${center}"
      cy="${center}"
      r="${radius}"
      fill="none"
      stroke="#ff4fd8"
      stroke-width="${stroke}"
      stroke-linecap="round"
      stroke-dasharray="${downLength} ${circumference}"
      stroke-dashoffset="${-upLength}"
      transform="rotate(-90 ${center} ${center})"
      style="filter: drop-shadow(0 0 6px rgba(255,79,216,0.8));"
    />

  <text
    x="${center}"
    y="${center - 8}"
    text-anchor="middle"
    font-size="24"
    font-weight="bold"
    fill="#f3eefb">
    ${ratioLabel}
  </text>

  <text
    x="${center}"
    y="${center + 18}"
    text-anchor="middle"
    font-size="12"
    fill="#9a8fb5">
    Audit Ratio
  </text>

  <text
    x="35"
    y="215"
    font-size="13"
    fill="#8b5cf6">
    ↑ ${upText}
</text>

<text
    x="145"
    y="215"
    font-size="13"
    fill="#ff4fd8">
    ↓ ${downText}
</text>
  `;
}
