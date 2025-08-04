import Rand, { PRNG } from 'rand-seed';

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
  seconds = Math.floor(seconds % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms
    .toString()
    .padStart(4, "0")}`;
}

function shuffle(list: any[], mode: string, seed: number = -1) {
  let rand;
  if (seed) {
    rand = new Rand(seed.toString())
  } else {
    rand = new Rand();
  }
  switch (mode) {
    default: // THE KNUTH SHUFFL: https://stackoverflow.com/a/2450976/6794873
      let i = list.length;
      while (i > 0) {
        let randomIndex = Math.floor(rand.next() * i);
        i--;

        [list[i], list[randomIndex]] = [list[randomIndex], list[i]];
      }
  }
}

function addCookie(data: { key: string; value: string; exp: number }) {
  const key = data.key;
  const value = data.value;
  const exp = new Date(data.exp).toUTCString();

  document.cookie = `${key}=${value}`;
}

function getCookie(key: string) {
  // courtesy of https://stackoverflow.com/a/11767598
  // Get name followed by anything except a semicolon
  var cookiestring = RegExp(key + "=[^;]+").exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
}

export { objToQueryString, fetchp, formatTime, shuffle, addCookie, getCookie };
