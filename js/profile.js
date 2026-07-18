import { graphql } from "./graphql.js";

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

        transaction(
          where: { type: { _eq: "level" } }
          order_by: { createdAt: desc }
          limit: 1
        ) {
          amount
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
      `level: ${data.transaction[0].amount}`;
  } catch (err) {
    console.log(err);
  }
}
loaadProfile();
