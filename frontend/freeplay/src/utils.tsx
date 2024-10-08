function objToQueryString(obj: object) {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(
      encodeURIComponent(key) +
        "=" +
        encodeURIComponent(obj[key as keyof object])
    );
  }
  return "?" + keyValuePairs.join("&");
}

export { objToQueryString };
