export async function login(identifier, password) {
  const credentials = btoa(`${identifier}:${password}`);

  const res = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });
  if (!res.ok) {
    throw new Error(`http error ${res.status}`);
  }
    const data = await res.text();
    localStorage.setItem("token", data);
    return data 
}
