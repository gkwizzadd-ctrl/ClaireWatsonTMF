/* Africa & Middle East Map Data — Global Radar (Claire Watson / TM Forum)
   Country list + region split (topojson IDs match world-atlas 50m data, same dataset as
   world-topo.js), sourced from the Alvatross project's dataviz-validated Africa/Middle East
   classification and colors, plus a name-normalization table so Sheet values like "UAE",
   "DRC" or "Türkiye" — however Claire or her team actually types them — still match the
   map's canonical country names.
*/
window.REGION_COUNTRIES = {
  '012': { name: 'Algeria', region: 'africa' },
  '024': { name: 'Angola', region: 'africa' },
  '048': { name: 'Bahrain', region: 'middleeast' },
  '204': { name: 'Benin', region: 'africa' },
  '072': { name: 'Botswana', region: 'africa' },
  '086': { name: 'Br. Indian Ocean Ter.', region: 'africa' },
  '854': { name: 'Burkina Faso', region: 'africa' },
  '108': { name: 'Burundi', region: 'africa' },
  '132': { name: 'Cabo Verde', region: 'africa' },
  '120': { name: 'Cameroon', region: 'africa' },
  '140': { name: 'Central African Rep.', region: 'africa' },
  '148': { name: 'Chad', region: 'africa' },
  '174': { name: 'Comoros', region: 'africa' },
  '178': { name: 'Congo', region: 'africa' },
  '384': { name: "Côte d'Ivoire", region: 'africa' },
  '180': { name: 'Dem. Rep. Congo', region: 'africa' },
  '262': { name: 'Djibouti', region: 'africa' },
  '818': { name: 'Egypt', region: 'africa' },
  '226': { name: 'Eq. Guinea', region: 'africa' },
  '232': { name: 'Eritrea', region: 'africa' },
  '748': { name: 'eSwatini', region: 'africa' },
  '231': { name: 'Ethiopia', region: 'africa' },
  '266': { name: 'Gabon', region: 'africa' },
  '270': { name: 'Gambia', region: 'africa' },
  '288': { name: 'Ghana', region: 'africa' },
  '324': { name: 'Guinea', region: 'africa' },
  '624': { name: 'Guinea-Bissau', region: 'africa' },
  '364': { name: 'Iran', region: 'middleeast' },
  '368': { name: 'Iraq', region: 'middleeast' },
  '376': { name: 'Israel', region: 'middleeast' },
  '400': { name: 'Jordan', region: 'middleeast' },
  '404': { name: 'Kenya', region: 'africa' },
  '414': { name: 'Kuwait', region: 'middleeast' },
  '422': { name: 'Lebanon', region: 'middleeast' },
  '426': { name: 'Lesotho', region: 'africa' },
  '430': { name: 'Liberia', region: 'africa' },
  '434': { name: 'Libya', region: 'africa' },
  '450': { name: 'Madagascar', region: 'africa' },
  '454': { name: 'Malawi', region: 'africa' },
  '466': { name: 'Mali', region: 'africa' },
  '478': { name: 'Mauritania', region: 'africa' },
  '480': { name: 'Mauritius', region: 'africa' },
  '504': { name: 'Morocco', region: 'africa' },
  '508': { name: 'Mozambique', region: 'africa' },
  '516': { name: 'Namibia', region: 'africa' },
  '562': { name: 'Niger', region: 'africa' },
  '566': { name: 'Nigeria', region: 'africa' },
  '512': { name: 'Oman', region: 'middleeast' },
  '275': { name: 'Palestine', region: 'middleeast' },
  '634': { name: 'Qatar', region: 'middleeast' },
  '646': { name: 'Rwanda', region: 'africa' },
  '728': { name: 'S. Sudan', region: 'africa' },
  '654': { name: 'Saint Helena', region: 'africa' },
  '678': { name: 'São Tomé and Principe', region: 'africa' },
  '682': { name: 'Saudi Arabia', region: 'middleeast' },
  '686': { name: 'Senegal', region: 'africa' },
  '690': { name: 'Seychelles', region: 'africa' },
  '694': { name: 'Sierra Leone', region: 'africa' },
  '706': { name: 'Somalia', region: 'africa' },
  '710': { name: 'South Africa', region: 'africa' },
  '729': { name: 'Sudan', region: 'africa' },
  '760': { name: 'Syria', region: 'middleeast' },
  '834': { name: 'Tanzania', region: 'africa' },
  '768': { name: 'Togo', region: 'africa' },
  '788': { name: 'Tunisia', region: 'africa' },
  '792': { name: 'Turkey', region: 'middleeast' },
  '800': { name: 'Uganda', region: 'africa' },
  '784': { name: 'United Arab Emirates', region: 'middleeast' },
  '732': { name: 'W. Sahara', region: 'africa' },
  '887': { name: 'Yemen', region: 'middleeast' },
  '894': { name: 'Zambia', region: 'africa' },
  '716': { name: 'Zimbabwe', region: 'africa' }
};

window.REGION_COLORS = { africa: '#c98500', middleeast: '#d55181' };
window.REGION_LABELS = { africa: 'Africa', middleeast: 'Middle East' };

/* Small island/city states render as near-invisible slivers even zoomed to Africa+ME scale —
   plotted as marker pins on top of the choropleth so they're always reliably clickable.
   Coordinates reused from the Alvatross project's Global Radar (same underlying topojson). */
window.REGION_MICRO_MARKERS = [
  { name: 'Bahrain', region: 'middleeast', coord: [50.54, 26.04] },
  { name: 'Cabo Verde', region: 'africa', coord: [-23.96, 15.96] },
  { name: 'Comoros', region: 'africa', coord: [43.68, -11.88] },
  { name: 'Mauritius', region: 'africa', coord: [57.57, -20.28] },
  { name: 'Palestine', region: 'middleeast', coord: [35.2, 31.92] },
  { name: 'São Tomé and Principe', region: 'africa', coord: [6.72, 0.44] },
  { name: 'Seychelles', region: 'africa', coord: [55.48, -4.66] }
];

/* Normalizes free-text country values (typed by hand, or auto-parsed from an "HQ" field) to the
   map's canonical name. Case-insensitive, trims whitespace. Falls back to the trimmed input
   unchanged if no alias matches — so an exact canonical name still works even if not listed here. */
window.COUNTRY_ALIASES = {
  'algeria': 'Algeria',
  'angola': 'Angola',
  'bahrain': 'Bahrain',
  'benin': 'Benin',
  'botswana': 'Botswana',
  'burkina faso': 'Burkina Faso',
  'burundi': 'Burundi',
  'cabo verde': 'Cabo Verde', 'cape verde': 'Cabo Verde',
  'cameroon': 'Cameroon',
  'central african republic': 'Central African Rep.', 'car': 'Central African Rep.',
  'chad': 'Chad',
  'comoros': 'Comoros',
  'congo': 'Congo', 'republic of the congo': 'Congo', 'congo-brazzaville': 'Congo',
  "cote d'ivoire": "Côte d'Ivoire", 'ivory coast': "Côte d'Ivoire",
  'drc': 'Dem. Rep. Congo', 'democratic republic of the congo': 'Dem. Rep. Congo', 'congo-kinshasa': 'Dem. Rep. Congo',
  'djibouti': 'Djibouti',
  'egypt': 'Egypt', 'arab republic of egypt': 'Egypt',
  'equatorial guinea': 'Eq. Guinea',
  'eritrea': 'Eritrea',
  'eswatini': 'eSwatini', 'swaziland': 'eSwatini',
  'ethiopia': 'Ethiopia',
  'gabon': 'Gabon',
  'gambia': 'Gambia', 'the gambia': 'Gambia',
  'ghana': 'Ghana',
  'guinea': 'Guinea',
  'guinea-bissau': 'Guinea-Bissau',
  'iran': 'Iran', 'islamic republic of iran': 'Iran',
  'iraq': 'Iraq',
  'israel': 'Israel',
  'jordan': 'Jordan',
  'kenya': 'Kenya',
  'kuwait': 'Kuwait',
  'lebanon': 'Lebanon',
  'lesotho': 'Lesotho',
  'liberia': 'Liberia',
  'libya': 'Libya',
  'madagascar': 'Madagascar',
  'malawi': 'Malawi',
  'mali': 'Mali',
  'mauritania': 'Mauritania',
  'mauritius': 'Mauritius',
  'morocco': 'Morocco',
  'mozambique': 'Mozambique',
  'namibia': 'Namibia',
  'niger': 'Niger',
  'nigeria': 'Nigeria',
  'oman': 'Oman',
  'palestine': 'Palestine', 'palestinian territories': 'Palestine', 'west bank and gaza': 'Palestine', 'state of palestine': 'Palestine',
  'qatar': 'Qatar',
  'rwanda': 'Rwanda',
  'south sudan': 'S. Sudan',
  'sao tome and principe': 'São Tomé and Principe', 'são tomé and príncipe': 'São Tomé and Principe',
  'saudi arabia': 'Saudi Arabia', 'ksa': 'Saudi Arabia', 'saudi': 'Saudi Arabia', 'kingdom of saudi arabia': 'Saudi Arabia',
  'senegal': 'Senegal',
  'seychelles': 'Seychelles',
  'sierra leone': 'Sierra Leone',
  'somalia': 'Somalia',
  'south africa': 'South Africa',
  'sudan': 'Sudan',
  'syria': 'Syria', 'syrian arab republic': 'Syria',
  'tanzania': 'Tanzania',
  'togo': 'Togo',
  'tunisia': 'Tunisia',
  'turkey': 'Turkey', 'türkiye': 'Turkey', 'turkiye': 'Turkey',
  'uganda': 'Uganda',
  'united arab emirates': 'United Arab Emirates', 'uae': 'United Arab Emirates', 'u.a.e.': 'United Arab Emirates', 'u.a.e': 'United Arab Emirates',
  'western sahara': 'W. Sahara',
  'yemen': 'Yemen',
  'zambia': 'Zambia',
  'zimbabwe': 'Zimbabwe'
};

function normalizeCountryName(raw) {
  if (!raw) return '';
  const key = String(raw).trim().toLowerCase();
  return window.COUNTRY_ALIASES[key] || String(raw).trim();
}

/* name -> topojson id, derived from REGION_COUNTRIES (for looking up a country's id when a Sheet
   row only has the country name). */
window.REGION_NAME_TO_ID = Object.fromEntries(
  Object.entries(window.REGION_COUNTRIES).map(([id, v]) => [v.name, id])
);
