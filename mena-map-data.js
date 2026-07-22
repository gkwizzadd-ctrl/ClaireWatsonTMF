/* MENA Map Data — Global Radar (Claire Watson / TM Forum)
   Country list scoped to MENA (topojson IDs match world-atlas 50m data, same dataset as
   world-topo.js), plus a name-normalization table so Sheet values like "UAE" or "KSA" — however
   Claire or her team actually types them — still match the map's canonical country names.
*/
window.MENA_COUNTRIES = {
  '012': 'Algeria',
  '048': 'Bahrain',
  '818': 'Egypt',
  '364': 'Iran',
  '368': 'Iraq',
  '376': 'Israel',
  '400': 'Jordan',
  '414': 'Kuwait',
  '422': 'Lebanon',
  '434': 'Libya',
  '478': 'Mauritania',
  '504': 'Morocco',
  '512': 'Oman',
  '275': 'Palestine',
  '634': 'Qatar',
  '682': 'Saudi Arabia',
  '729': 'Sudan',
  '760': 'Syria',
  '788': 'Tunisia',
  '792': 'Turkey',
  '784': 'United Arab Emirates',
  '887': 'Yemen'
};

/* Normalizes free-text country values (typed by hand, or auto-parsed from an "HQ" field) to the
   map's canonical name. Case-insensitive, trims whitespace. Falls back to the trimmed input
   unchanged if no alias matches — so an exact canonical name still works even if not listed here. */
window.COUNTRY_ALIASES = {
  'algeria': 'Algeria',
  'bahrain': 'Bahrain',
  'egypt': 'Egypt', 'arab republic of egypt': 'Egypt',
  'iran': 'Iran', 'islamic republic of iran': 'Iran',
  'iraq': 'Iraq',
  'israel': 'Israel',
  'jordan': 'Jordan',
  'kuwait': 'Kuwait',
  'lebanon': 'Lebanon',
  'libya': 'Libya',
  'mauritania': 'Mauritania',
  'morocco': 'Morocco',
  'oman': 'Oman',
  'palestine': 'Palestine', 'palestinian territories': 'Palestine', 'west bank and gaza': 'Palestine', 'state of palestine': 'Palestine',
  'qatar': 'Qatar',
  'saudi arabia': 'Saudi Arabia', 'ksa': 'Saudi Arabia', 'saudi': 'Saudi Arabia', 'kingdom of saudi arabia': 'Saudi Arabia',
  'sudan': 'Sudan',
  'syria': 'Syria', 'syrian arab republic': 'Syria',
  'tunisia': 'Tunisia',
  'turkey': 'Turkey', 'türkiye': 'Turkey', 'turkiye': 'Turkey',
  'united arab emirates': 'United Arab Emirates', 'uae': 'United Arab Emirates', 'u.a.e.': 'United Arab Emirates', 'u.a.e': 'United Arab Emirates',
  'yemen': 'Yemen'
};

function normalizeCountryName(raw) {
  if (!raw) return '';
  const key = String(raw).trim().toLowerCase();
  return window.COUNTRY_ALIASES[key] || String(raw).trim();
}

/* name -> topojson id, derived from MENA_COUNTRIES (for looking up a country's id when a Sheet
   row only has the country name, e.g. to plot/highlight it on the map). */
window.MENA_NAME_TO_ID = Object.fromEntries(
  Object.entries(window.MENA_COUNTRIES).map(([id, name]) => [name, id])
);
