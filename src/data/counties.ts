/**
 * Florida counties with average millage rate (mills, where 1 mill = $1 per $1,000 of taxable value).
 * Rates are blended county + school + special districts averages from FY2024 DOR data.
 *
 * IMPORTANT: These are placeholder averages. Pull authoritative current-year rates from:
 *   https://floridarevenue.com/property/Pages/DataPortal_RequestAssessmentRollGISData.aspx
 *   or each county's property appraiser site.
 */

export type County = {
  slug: string;
  name: string;
  seat: string;
  millage: number;       // average total millage rate
  homestead: number;     // standard homestead exemption ($25k + $25k for non-school)
};

export const FL_COUNTIES: County[] = [
  { slug: "alachua", name: "Alachua", seat: "Gainesville", millage: 21.7, homestead: 50000 },
  { slug: "baker", name: "Baker", seat: "Macclenny", millage: 19.2, homestead: 50000 },
  { slug: "bay", name: "Bay", seat: "Panama City", millage: 16.4, homestead: 50000 },
  { slug: "bradford", name: "Bradford", seat: "Starke", millage: 19.8, homestead: 50000 },
  { slug: "brevard", name: "Brevard", seat: "Titusville", millage: 17.3, homestead: 50000 },
  { slug: "broward", name: "Broward", seat: "Fort Lauderdale", millage: 19.6, homestead: 50000 },
  { slug: "calhoun", name: "Calhoun", seat: "Blountstown", millage: 18.9, homestead: 50000 },
  { slug: "charlotte", name: "Charlotte", seat: "Punta Gorda", millage: 16.1, homestead: 50000 },
  { slug: "citrus", name: "Citrus", seat: "Inverness", millage: 15.8, homestead: 50000 },
  { slug: "clay", name: "Clay", seat: "Green Cove Springs", millage: 17.4, homestead: 50000 },
  { slug: "collier", name: "Collier", seat: "Naples", millage: 11.9, homestead: 50000 },
  { slug: "columbia", name: "Columbia", seat: "Lake City", millage: 18.6, homestead: 50000 },
  { slug: "desoto", name: "DeSoto", seat: "Arcadia", millage: 19.3, homestead: 50000 },
  { slug: "dixie", name: "Dixie", seat: "Cross City", millage: 17.7, homestead: 50000 },
  { slug: "duval", name: "Duval", seat: "Jacksonville", millage: 18.5, homestead: 50000 },
  { slug: "escambia", name: "Escambia", seat: "Pensacola", millage: 18.3, homestead: 50000 },
  { slug: "flagler", name: "Flagler", seat: "Bunnell", millage: 17.8, homestead: 50000 },
  { slug: "franklin", name: "Franklin", seat: "Apalachicola", millage: 14.9, homestead: 50000 },
  { slug: "gadsden", name: "Gadsden", seat: "Quincy", millage: 19.5, homestead: 50000 },
  { slug: "gilchrist", name: "Gilchrist", seat: "Trenton", millage: 18.8, homestead: 50000 },
  { slug: "glades", name: "Glades", seat: "Moore Haven", millage: 17.1, homestead: 50000 },
  { slug: "gulf", name: "Gulf", seat: "Port St. Joe", millage: 15.6, homestead: 50000 },
  { slug: "hamilton", name: "Hamilton", seat: "Jasper", millage: 19.0, homestead: 50000 },
  { slug: "hardee", name: "Hardee", seat: "Wauchula", millage: 18.4, homestead: 50000 },
  { slug: "hendry", name: "Hendry", seat: "LaBelle", millage: 19.7, homestead: 50000 },
  { slug: "hernando", name: "Hernando", seat: "Brooksville", millage: 16.5, homestead: 50000 },
  { slug: "highlands", name: "Highlands", seat: "Sebring", millage: 17.6, homestead: 50000 },
  { slug: "hillsborough", name: "Hillsborough", seat: "Tampa", millage: 19.3, homestead: 50000 },
  { slug: "holmes", name: "Holmes", seat: "Bonifay", millage: 17.9, homestead: 50000 },
  { slug: "indian-river", name: "Indian River", seat: "Vero Beach", millage: 15.3, homestead: 50000 },
  { slug: "jackson", name: "Jackson", seat: "Marianna", millage: 17.5, homestead: 50000 },
  { slug: "jefferson", name: "Jefferson", seat: "Monticello", millage: 19.2, homestead: 50000 },
  { slug: "lafayette", name: "Lafayette", seat: "Mayo", millage: 17.8, homestead: 50000 },
  { slug: "lake", name: "Lake", seat: "Tavares", millage: 17.0, homestead: 50000 },
  { slug: "lee", name: "Lee", seat: "Fort Myers", millage: 14.8, homestead: 50000 },
  { slug: "leon", name: "Leon", seat: "Tallahassee", millage: 21.1, homestead: 50000 },
  { slug: "levy", name: "Levy", seat: "Bronson", millage: 18.5, homestead: 50000 },
  { slug: "liberty", name: "Liberty", seat: "Bristol", millage: 17.4, homestead: 50000 },
  { slug: "madison", name: "Madison", seat: "Madison", millage: 19.1, homestead: 50000 },
  { slug: "manatee", name: "Manatee", seat: "Bradenton", millage: 15.4, homestead: 50000 },
  { slug: "marion", name: "Marion", seat: "Ocala", millage: 17.6, homestead: 50000 },
  { slug: "martin", name: "Martin", seat: "Stuart", millage: 14.6, homestead: 50000 },
  { slug: "miami-dade", name: "Miami-Dade", seat: "Miami", millage: 19.9, homestead: 50000 },
  { slug: "monroe", name: "Monroe", seat: "Key West", millage: 12.7, homestead: 50000 },
  { slug: "nassau", name: "Nassau", seat: "Fernandina Beach", millage: 16.8, homestead: 50000 },
  { slug: "okaloosa", name: "Okaloosa", seat: "Crestview", millage: 14.7, homestead: 50000 },
  { slug: "okeechobee", name: "Okeechobee", seat: "Okeechobee", millage: 18.3, homestead: 50000 },
  { slug: "orange", name: "Orange", seat: "Orlando", millage: 17.5, homestead: 50000 },
  { slug: "osceola", name: "Osceola", seat: "Kissimmee", millage: 18.8, homestead: 50000 },
  { slug: "palm-beach", name: "Palm Beach", seat: "West Palm Beach", millage: 18.9, homestead: 50000 },
  { slug: "pasco", name: "Pasco", seat: "Dade City", millage: 17.7, homestead: 50000 },
  { slug: "pinellas", name: "Pinellas", seat: "Clearwater", millage: 18.2, homestead: 50000 },
  { slug: "polk", name: "Polk", seat: "Bartow", millage: 17.4, homestead: 50000 },
  { slug: "putnam", name: "Putnam", seat: "Palatka", millage: 19.6, homestead: 50000 },
  { slug: "santa-rosa", name: "Santa Rosa", seat: "Milton", millage: 15.9, homestead: 50000 },
  { slug: "sarasota", name: "Sarasota", seat: "Sarasota", millage: 14.5, homestead: 50000 },
  { slug: "seminole", name: "Seminole", seat: "Sanford", millage: 17.9, homestead: 50000 },
  { slug: "st-johns", name: "St. Johns", seat: "St. Augustine", millage: 13.8, homestead: 50000 },
  { slug: "st-lucie", name: "St. Lucie", seat: "Fort Pierce", millage: 19.4, homestead: 50000 },
  { slug: "sumter", name: "Sumter", seat: "Bushnell", millage: 14.3, homestead: 50000 },
  { slug: "suwannee", name: "Suwannee", seat: "Live Oak", millage: 18.9, homestead: 50000 },
  { slug: "taylor", name: "Taylor", seat: "Perry", millage: 18.1, homestead: 50000 },
  { slug: "union", name: "Union", seat: "Lake Butler", millage: 19.3, homestead: 50000 },
  { slug: "volusia", name: "Volusia", seat: "DeLand", millage: 17.8, homestead: 50000 },
  { slug: "wakulla", name: "Wakulla", seat: "Crawfordville", millage: 18.4, homestead: 50000 },
  { slug: "walton", name: "Walton", seat: "DeFuniak Springs", millage: 12.4, homestead: 50000 },
  { slug: "washington", name: "Washington", seat: "Chipley", millage: 17.6, homestead: 50000 },
];

export const getCounty = (slug: string) =>
  FL_COUNTIES.find((c) => c.slug === slug);
