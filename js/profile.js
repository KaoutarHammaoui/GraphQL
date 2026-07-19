import { graphql } from "./graphql.js";
import { drawXpChart, drawAuditChart } from "./charts.js";

const tok = localStorage.getItem("token");
if (!tok) {
  console.log("No token found");
  window.location.href = "index.html";
}

async function loaadProfile() {
  try {
    const data = await graphql(`
      {
        user {
          id
          login
          auditRatio
          totalUp
          totalDown
          xps(
            where: {
              _and: [
                { path: { _like: "/oujda/module/%" } }
                { path: { _nlike: "/oujda/module/piscine-js/%" } }
              ]
            }
          ) {
            amount
          }
        }
        level: transaction(
          where: { type: { _eq: "level" } }
          order_by: { createdAt: desc }
          limit: 1
        ) {
          amount
          path
          createdAt
        }

        projects: transaction(
          where: {
            _and: [
              { type: { _eq: "xp" } }
              { path: { _like: "/oujda/module/%" } }
              { path: { _nlike: "/oujda/module/piscine-js/%" } }
              { path: { _nlike: "/oujda/module/checkpoint/%" } }
            ]
          }
          order_by: { createdAt: desc }
        ) {
          path
          amount
          createdAt
        }
      }
    `);
    const user = data.user[0];
    const xps = data.user[0].xps;
    const totalXp = xps.reduce((sum, t) => sum + Number(t.amount), 0) / 1000;

    document.getElementById("log").textContent = user.login;
    document.getElementById("userId").textContent = `User ID: ${user.id}`;
    document.getElementById("xp").textContent = `xp: ${Math.floor(totalXp)} KB`;
    document.getElementById("ratio").textContent =
      `ratio: ${user.auditRatio.toFixed(1)}`;
    document.getElementById("level").textContent =
      `level: ${data.level[0].amount}`;

    const tbody = document.getElementById("projects");

    data.projects.forEach((project) => {
      const row = document.createElement("tr");

      row.innerHTML = `
    <td>${project.path.split("/").pop()}</td>
    <td>${formatXP(Number(project.amount))}</td>
    <td>${new Date(project.createdAt).toLocaleDateString()}</td>
  `;

      tbody.appendChild(row);
    });

    drawXpChart([...data.projects].reverse());
    drawAuditChart(user.totalUp, user.totalDown);
  } catch (err) {
    console.log(err);
  }
}

export function formatXP(amount) {
  if (amount < 1000) {
    return `${amount} B`;
  }

  const kb = amount / 1000;

  if (Number.isInteger(kb)) {
    return `${kb} kB`;
  }
  if (kb < 10) {
    return `${kb.toFixed(2)} kB`;
  }
  return `${kb.toFixed(1)} kB`;
}
loaadProfile();
