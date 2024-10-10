import { json } from "stream/consumers";

function objToQueryString(obj: object) {
  let params = new URLSearchParams();

  for (const key in obj) {
    params.append(key, obj[key as keyof object]);
  }

  return params.toString();
}

async function fetchp(url: string) {
  const data = [];
  const first_page = await fetch(url).then((response) => response.json());
  data.push(...first_page["items"]);
  let nextPageToken = first_page.nextPageToken;

  while (nextPageToken) {
    const page = await fetch(`${url}&pageToken=${nextPageToken}`).then(
      (response) => response.json()
    );
    data.push(...page["items"]);
    nextPageToken = page.nextPageToken;
  }

  return data;
}

export { objToQueryString, fetchp };
