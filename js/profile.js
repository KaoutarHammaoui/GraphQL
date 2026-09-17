import { graphql } from "./graphql.js";
import { drawXpChart, drawAuditChart } from "./charts.js";
import { query } from "./query.js";

async function CheckToken() {
  let res = await graphql(query);
  if (res === "err") {
    localStorage.removeItem('token');
    window.location.replace('index.html');
    return;
  }
}
const tok = localStorage.getItem("token");
if (tok) {
  await CheckToken();
} else {
  window.location.replace("index.html");
}

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.replace("index.html");
});

async function loaadProfile() {
  try {
    const data = await graphql(query);
    const user = data.user[0];
    let totalXp = data.xps.aggregate.sum.amount;
    
    totalXp=totalXp/1000
    if (totalXp > 1000) {
      console.log("xps:",{totalXp})
      document.getElementById("xp").textContent = `xp: ${(totalXp / 1000).toFixed(1)} MB`;
    } else {
      document.getElementById("xp").textContent = `xp: ${Math.floor((totalXp ))} KB`;
    }


    document.getElementById("avatar").src = user.avatarUrl;
    document.getElementById("log").textContent = user.login;
    document.getElementById("userId").textContent = `User ID: ${user.id}`;
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

export function formatXPRatio(amount) {
  let unite = "B"
  if (amount < 1000) {
    return `${amount} ${unite}`;
  }

  let kb = amount / 1000;
  unite = "kB"

  if (Number.isInteger(kb)) {
    return `${kb}${unite}`;
  }
  if (kb < 10) {
    return `${kb.toFixed(2)} ${unite}`;
  }
  if (kb > 1000) {
    kb = (kb / 1000)
    unite = "MB"
  }
  return `${kb.toFixed(1)} ${unite}`;
}

loaadProfile();
