import { login } from "./auth.js";

const form = document.getElementById('loginF');

form.addEventListener("submit",async(e) => {
    e.preventDefault();
    const emailUsername = document.getElementById("emailUsername").value;
    const password = document.getElementById('password').value;
    const error = document.getElementById('error');
    try {
        error.textContent = "";
        await login(emailUsername, password);
        window.location.href = "profile.html";
    } catch (err){
        error.textContent='Invalid username or password'
    } 
})