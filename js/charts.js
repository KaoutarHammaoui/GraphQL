import { formatXP } from "./profile.js";

export function drawXpChart(projects) {
  const svg = document.getElementById("xpChart");
  svg.innerHTML = "";

  const chartHeight = 180;
  const chartWidth = 650;

  const maxXP = Math.max(...projects.map((p) => Number(p.amount)));
  const barWidth = chartWidth / projects.length;

  const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");

  axis.setAttribute("x1", 0);
  axis.setAttribute("y1", chartHeight);
  axis.setAttribute("x2", chartWidth);
  axis.setAttribute("y2", chartHeight);

  axis.setAttribute("stroke", "#999");

  svg.appendChild(axis);

  projects.forEach((project, index) => {
    const barHeight = Math.max(
      (Number(project.amount) / maxXP) * chartHeight,
      2,
    );
    const gap = 2;
    const x = index * (barWidth + gap);
    const y = chartHeight - barHeight;

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
    rect.setAttribute("width", barWidth - 4);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("fill", "red");
    rect.setAttribute("stroke", "black");
    rect.setAttribute("stroke-width", "1");
    rect.setAttribute("rx", 3);
    rect.setAttribute("ry", 3);
    svg.appendChild(rect);
  });
}

export function drawAuditChart(up, down) {
  const svg = document.getElementById("auditChart");

  const size = 220;
  const center = size / 2;

  const radius = 80;
  const stroke = 12;

  const total = up + down;

  const upPercent = up / total;
  const downPercent = down / total;

  const circumference = 2 * Math.PI * radius;

  const upLength = circumference * upPercent;
  const downLength = circumference * downPercent;

  svg.innerHTML = `
    <!-- background -->
    <circle
      cx="${center}"
      cy="${center}"
      r="${radius}"
      fill="none"
      stroke="#4CAF50"
      stroke-linecap="round"
      stroke-width="${stroke}"
    />

    <!-- green -->
    <circle
      cx="${center}"
      cy="${center}"
      r="${radius}"
      fill="none"
      stroke="#4CAF50"
      stroke-width="${stroke}"
      stroke-dasharray="${upLength} ${circumference}"
      transform="rotate(-90 ${center} ${center})"
    />

    <!-- red -->
    <circle
      cx="${center}"
      cy="${center}"
      r="${radius}"
      fill="none"
      stroke="#F44336"
      stroke-width="${stroke}"
      stroke-dasharray="${downLength} ${circumference}"
      stroke-dashoffset="${-upLength}"
      transform="rotate(-90 ${center} ${center})"
    />

    <text
      x="${center}"
      y="${center}"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="18"
      font-weight="bold"
    >
    ${(up / down).toFixed(1)}    </text>
  `;
}
