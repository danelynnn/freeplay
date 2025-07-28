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

function formatTime(seconds: number) {
  var ms = Math.floor((seconds % 1) * 1000);
  seconds = Math.floor(seconds);
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds - hours * 3600) / 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms
    .toString()
    .padStart(4, "0")}`;
}

function shuffle(list: any[], mode: string) {
  switch (mode) {
    default: // THE KNUTH SHUFFL: https://stackoverflow.com/a/2450976/6794873
      let i = list.length;
      while (i > 0) {
        let randomIndex = Math.floor(Math.random() * i);
        i--;

        [list[i], list[randomIndex]] = [list[randomIndex], list[i]];
      }
  }
}

export { objToQueryString, fetchp, formatTime, shuffle };
