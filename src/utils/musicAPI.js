export async function searchSongs(query) {
  const res = await fetch(`https://api.deezer.com/search?q=${query}&output=jsonp`);
  const text = await res.text();
  const json = JSON.parse(text.match(/\((.*)\)/)[1]); // convert JSONP
  return json.data;
}