// we're sending the query as JSON in the request body, which is why POST is commonly used.
// 3. Why read the token inside graphql()? =>encapsulation.

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
        throw new Error('fetch failed');
    }
    const json = await res.json()
    if (json.errors) {
        throw new Error(json.errors[0].message);
    }
    //cuz graphql can return 200 even when the query has erroes, e.g: undefined user=> 200. that's why we 're gonna check it with json.errors
    return json.data;

}