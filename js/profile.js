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
        }
      }
    `);
      const user = data.user[0];
      document.getElementById('log').textContent = user.login;
      document.getElementById('userId').textContent = `User ID: ${user.id}`;
  } catch (err) {
    console.log(err);
  }
}
loaadProfile();
