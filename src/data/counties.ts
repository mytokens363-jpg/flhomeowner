// Millage rates: FL DOR Property Tax Oversight, Florida Ad Valorem
// Valuation and Tax Data Book, FY2025 (extracted November 2025).
// Source field: "Sub Total (County-Wide Millage)" = County Government
// + School Board + Water Management District + countywide independent
// districts. Excludes MSTU and municipal millage — actual bills will
// be 1-4 mills higher in incorporated cities.
//
// Special case: Duval (Jacksonville) uses Total Millage Rate (17.9)
// because the consolidated city-county structure means there is no
// separate municipal millage; the Sub Total field understates the
// real homeowner burden.
//
// Last verified: 2026-06-04. FY2026 data publishes ~August 2026.

export type County = {
  slug: string;
  name: string;
  seat: string;
  millage: number;       // county-wide millage (mills): county + school + WMD + countywide independent districts
  homestead: number;     // standard homestead exemption ($25k + $25k for non-school)
};

export const FL_COUNTIES: County[] = [
  { slug: "alachua", name: "Alachua", seat: "Gainesville", millage: 15.2, homestead: 50000 },
  { slug: "baker", name: "Baker", seat: "Macclenny", millage: 13.5, homestead: 50000 },
  { slug: "bay", name: "Bay", seat: "Panama City", millage: 10.8, homestead: 50000 },
  { slug: "bradford", name: "Bradford", seat: "Starke", millage: 15.4, homestead: 50000 },
  { slug: "brevard", name: "Brevard", seat: "Titusville", millage: 8.9, homestead: 50000 },
  { slug: "broward", name: "Broward", seat: "Fort Lauderdale", millage: 12.9, homestead: 50000 },
  { slug: "calhoun", name: "Calhoun", seat: "Blountstown", millage: 15.1, homestead: 50000 },
  { slug: "charlotte", name: "Charlotte", seat: "Punta Gorda", millage: 12.8, homestead: 50000 },
  { slug: "citrus", name: "Citrus", seat: "Inverness", millage: 14.3, homestead: 50000 },
  { slug: "clay", name: "Clay", seat: "Green Cove Springs", millage: 12.0, homestead: 50000 },
  { slug: "collier", name: "Collier", seat: "Naples", millage: 7.7, homestead: 50000 },
  { slug: "columbia", name: "Columbia", seat: "Lake City", millage: 13.4, homestead: 50000 },
  { slug: "desoto", name: "DeSoto", seat: "Arcadia", millage: 12.3, homestead: 50000 },
  { slug: "dixie", name: "Dixie", seat: "Cross City", millage: 15.7, homestead: 50000 },
  { slug: "duval", name: "Duval", seat: "Jacksonville", millage: 17.9, homestead: 50000 }, // consolidated city-county — Total Millage Rate; see header
  { slug: "escambia", name: "Escambia", seat: "Pensacola", millage: 12.4, homestead: 50000 },
  { slug: "flagler", name: "Flagler", seat: "Bunnell", millage: 13.7, homestead: 50000 },
  { slug: "franklin", name: "Franklin", seat: "Apalachicola", millage: 9.3, homestead: 50000 },
  { slug: "gadsden", name: "Gadsden", seat: "Quincy", millage: 14.3, homestead: 50000 },
  { slug: "gilchrist", name: "Gilchrist", seat: "Trenton", millage: 15.1, homestead: 50000 },
  { slug: "glades", name: "Glades", seat: "Moore Haven", millage: 14.6, homestead: 50000 },
  { slug: "gulf", name: "Gulf", seat: "Port St. Joe", millage: 10.9, homestead: 50000 },
  { slug: "hamilton", name: "Hamilton", seat: "Jasper", millage: 14.4, homestead: 50000 },
  { slug: "hardee", name: "Hardee", seat: "Wauchula", millage: 13.4, homestead: 50000 },
  { slug: "hendry", name: "Hendry", seat: "LaBelle", millage: 15.8, homestead: 50000 },
  { slug: "hernando", name: "Hernando", seat: "Brooksville", millage: 13.3, homestead: 50000 },
  { slug: "highlands", name: "Highlands", seat: "Sebring", millage: 13.0, homestead: 50000 },
  { slug: "hillsborough", name: "Hillsborough", seat: "Tampa", millage: 12.6, homestead: 50000 },
  { slug: "holmes", name: "Holmes", seat: "Bonifay", millage: 14.6, homestead: 50000 },
  { slug: "indian-river", name: "Indian River", seat: "Vero Beach", millage: 9.4, homestead: 50000 },
  { slug: "jackson", name: "Jackson", seat: "Marianna", millage: 13.3, homestead: 50000 },
  { slug: "jefferson", name: "Jefferson", seat: "Monticello", millage: 12.8, homestead: 50000 },
  { slug: "lafayette", name: "Lafayette", seat: "Mayo", millage: 15.7, homestead: 50000 },
  { slug: "lake", name: "Lake", seat: "Tavares", millage: 11.4, homestead: 50000 },
  { slug: "lee", name: "Lee", seat: "Fort Myers", millage: 9.4, homestead: 50000 },
  { slug: "leon", name: "Leon", seat: "Tallahassee", millage: 14.0, homestead: 50000 },
  { slug: "levy", name: "Levy", seat: "Bronson", millage: 14.1, homestead: 50000 },
  { slug: "liberty", name: "Liberty", seat: "Bristol", millage: 14.6, homestead: 50000 },
  { slug: "madison", name: "Madison", seat: "Madison", millage: 14.3, homestead: 50000 },
  { slug: "manatee", name: "Manatee", seat: "Bradenton", millage: 12.7, homestead: 50000 },
  { slug: "marion", name: "Marion", seat: "Ocala", millage: 10.3, homestead: 50000 },
  { slug: "martin", name: "Martin", seat: "Stuart", millage: 12.4, homestead: 50000 },
  { slug: "miami-dade", name: "Miami-Dade", seat: "Miami", millage: 12.3, homestead: 50000 },
  { slug: "monroe", name: "Monroe", seat: "Key West", millage: 6.0, homestead: 50000 },
  { slug: "nassau", name: "Nassau", seat: "Fernandina Beach", millage: 13.1, homestead: 50000 },
  { slug: "okaloosa", name: "Okaloosa", seat: "Crestview", millage: 9.2, homestead: 50000 },
  { slug: "okeechobee", name: "Okeechobee", seat: "Okeechobee", millage: 13.5, homestead: 50000 },
  { slug: "orange", name: "Orange", seat: "Orlando", millage: 10.9, homestead: 50000 },
  { slug: "osceola", name: "Osceola", seat: "Kissimmee", millage: 12.6, homestead: 50000 },
  { slug: "palm-beach", name: "Palm Beach", seat: "West Palm Beach", millage: 12.3, homestead: 50000 },
  { slug: "pasco", name: "Pasco", seat: "Dade City", millage: 14.1, homestead: 50000 },
  { slug: "pinellas", name: "Pinellas", seat: "Clearwater", millage: 11.9, homestead: 50000 },
  { slug: "polk", name: "Polk", seat: "Bartow", millage: 11.9, homestead: 50000 },
  { slug: "putnam", name: "Putnam", seat: "Palatka", millage: 15.6, homestead: 50000 },
  { slug: "santa-rosa", name: "Santa Rosa", seat: "Milton", millage: 11.4, homestead: 50000 },
  { slug: "sarasota", name: "Sarasota", seat: "Sarasota", millage: 10.7, homestead: 50000 },
  { slug: "seminole", name: "Seminole", seat: "Sanford", millage: 10.8, homestead: 50000 },
  { slug: "st-johns", name: "St. Johns", seat: "St. Augustine", millage: 11.8, homestead: 50000 },
  { slug: "st-lucie", name: "St. Lucie", seat: "Fort Pierce", millage: 16.9, homestead: 50000 },
  { slug: "sumter", name: "Sumter", seat: "Bushnell", millage: 9.8, homestead: 50000 },
  { slug: "suwannee", name: "Suwannee", seat: "Live Oak", millage: 14.5, homestead: 50000 },
  { slug: "taylor", name: "Taylor", seat: "Perry", millage: 13.2, homestead: 50000 },
  { slug: "union", name: "Union", seat: "Lake Butler", millage: 16.2, homestead: 50000 },
  { slug: "volusia", name: "Volusia", seat: "DeLand", millage: 11.1, homestead: 50000 },
  { slug: "wakulla", name: "Wakulla", seat: "Crawfordville", millage: 13.3, homestead: 50000 },
  { slug: "walton", name: "Walton", seat: "DeFuniak Springs", millage: 7.8, homestead: 50000 },
  { slug: "washington", name: "Washington", seat: "Chipley", millage: 13.9, homestead: 50000 },
];

export const getCounty = (slug: string) =>
  FL_COUNTIES.find((c) => c.slug === slug);
