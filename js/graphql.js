
export async function graphql(query) {
    const tok = localStorage.getItem('token');
    const res = await fetch(
      "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tok}`,
        },
        body: JSON.stringify({ query }),
      },
    );

    if (!res.ok) {
        return "err"
    }
    const json = await res.json()
    if (json.errors) {
        return "err"
    }
    return json.data;

}