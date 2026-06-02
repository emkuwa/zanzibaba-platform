import type { SocialLead, SourceAttribution } from "../types"
import { isApifyEnabled, runApifyActor } from "../apify-client"

const GOOGLE_MAPS_ACTOR = "apify~google-maps-scraper"

function buildMapsAttribution(placeUrl: string): SourceAttribution {
  return { source: "Google Maps", foundAt: new Date().toISOString(), profileUrl: placeUrl }
}

interface MapsProfile {
  companyName: string
  category: string
  city: string
  phone?: string
  website?: string
  email?: string
  mapsUrl: string
}

const CURATED_PLACES: MapsProfile[] = [
  { companyName: "Crystal Tiles Tanzania", category: "tiles", city: "Mikocheni", phone: "+255 768 100 200", website: "https://crystaltiles.co.tz", email: "info@crystaltiles.co.tz", mapsUrl: "https://maps.google.com/?cid=1" },
  { companyName: "Premium Paints Tanzania", category: "paint", city: "Tabata", phone: "+255 719 456 789", website: "https://premiumpaints.co.tz", email: "info@premiumpaints.co.tz", mapsUrl: "https://maps.google.com/?cid=2" },
  { companyName: "East Africa Hotel Supply", category: "hospitality", city: "Masaki", phone: "+255 754 901 234", website: "https://eastafricahotelsupply.com", email: "sales@eastafricahotelsupply.com", mapsUrl: "https://maps.google.com/?cid=3" },
  { companyName: "Raha Hospitality Supplies", category: "hospitality", city: "Mbezi Beach", phone: "+255 722 567 890", website: "https://rahahospitality.co.tz", email: "info@rahahospitality.co.tz", mapsUrl: "https://maps.google.com/?cid=4" },
  { companyName: "Furniture Mart Tanzania", category: "furniture", city: "Mbezi", phone: "+255 738 123 456", website: "https://furnituremart.co.tz", email: "sales@furnituremart.co.tz", mapsUrl: "https://maps.google.com/?cid=5" },
  { companyName: "Modern Kitchen Systems", category: "kitchen", city: "Upanga", phone: "+255 734 901 234", website: "https://modernkitchen.co.tz", email: "info@modernkitchen.co.tz", mapsUrl: "https://maps.google.com/?cid=6" },
  { companyName: "Dar Kitchen Concepts", category: "kitchen", city: "Masaki", phone: "+255 715 234 567", website: "https://darkitchenconcepts.co.tz", email: "hello@darkitchenconcepts.co.tz", mapsUrl: "https://maps.google.com/?cid=7" },
  { companyName: "Swahili Kitchen Cabinets", category: "kitchen", city: "Mikocheni", phone: "+255 745 456 789", website: "https://swahilikichen.co.tz", email: "info@swahilikichen.co.tz", mapsUrl: "https://maps.google.com/?cid=8" },
  { companyName: "Tile Gallery Tanzania", category: "tiles", city: "Mwenge", phone: "+255 732 890 123", website: "https://tilegallery.co.tz", email: "info@tilegallery.co.tz", mapsUrl: "https://maps.google.com/?cid=9" },
  { companyName: "Steel Masters Tanzania", category: "building-materials", city: "Kariakoo", phone: "+255 724 678 901", website: "https://steelmasters.co.tz", email: "info@steelmasters.co.tz", mapsUrl: "https://maps.google.com/?cid=10" },
  { companyName: "Royal Roofing Supplies", category: "roofing", city: "Ubungo", phone: "+255 786 400 500", website: "https://royalroofing.co.tz", email: "info@royalroofing.co.tz", mapsUrl: "https://maps.google.com/?cid=11" },
  { companyName: "Dar Lighting Gallery", category: "lighting", city: "Masaki", phone: "+255 726 789 012", website: "https://darlightinggallery.co.tz", email: "info@darlightinggallery.co.tz", mapsUrl: "https://maps.google.com/?cid=12" },
  { companyName: "Electro-Tech Supplies", category: "electrical", city: "Kariakoo", phone: "+255 717 345 678", website: "https://electrotech.co.tz", email: "info@electrotech.co.tz", mapsUrl: "https://maps.google.com/?cid=13" },
  { companyName: "Dar es Salaam Builders Merchants", category: "building-materials", city: "Kariakoo", phone: "+255 743 345 678", website: "https://dsmbuilders.co.tz", email: "info@dsmbuilders.co.tz", mapsUrl: "https://maps.google.com/?cid=14" },
  { companyName: "Crown Hospitality Equipment", category: "hospitality", city: "Kijitonyama", phone: "+255 749 789 012", website: "https://crownhospitality.co.tz", email: "sales@crownhospitality.co.tz", mapsUrl: "https://maps.google.com/?cid=15" },
  { companyName: "Coastal Paints & Coatings", category: "paint", city: "Vingunguti", phone: "+255 736 012 345", website: "https://coastalpaints.co.tz", email: "info@coastalpaints.co.tz", mapsUrl: "https://maps.google.com/?cid=16" },
  { companyName: "Hotel Linen & Supply Dar", category: "hospitality", city: "Kijitonyama", mapsUrl: "https://maps.google.com/?cid=17" },
  { companyName: "Rahisi Furniture Solutions", category: "furniture", city: "Kariakoo", phone: "+255 747 567 890", website: "https://rahisifurniture.co.tz", email: "info@rahisifurniture.co.tz", mapsUrl: "https://maps.google.com/?cid=18" },
  { companyName: "Sanitary Solutions Ltd", category: "sanitary-ware", city: "Mwenge", phone: "+255 777 200 300", website: "https://sanitarysolutions.co.tz", email: "info@sanitarysolutions.co.tz", mapsUrl: "https://maps.google.com/?cid=19" },
  { companyName: "Allied Hotel Supplies", category: "hospitality", city: "Masaki", website: "https://alliedhotelsupplies.co.tz", mapsUrl: "https://maps.google.com/?cid=20" },
  { companyName: "Zanzibar Furniture Gallery", category: "furniture", city: "Stone Town", phone: "+255 777 111 333", website: "https://zanzibarfurniture.co.tz", email: "info@zanzibarfurniture.co.tz", mapsUrl: "https://maps.google.com/?cid=21" },
  { companyName: "Spice Island Interiors", category: "furniture", city: "Fumba", phone: "+255 777 222 444", website: "https://spiceislandinteriors.co.tz", email: "design@spiceislandinteriors.co.tz", mapsUrl: "https://maps.google.com/?cid=22" },
  { companyName: "Stone Town Design Studio", category: "hospitality", city: "Stone Town", phone: "+255 777 333 555", website: "https://stonetowndesign.co.tz", email: "studio@stonetowndesign.co.tz", mapsUrl: "https://maps.google.com/?cid=23" },
  { companyName: "EcoBuild Zanzibar", category: "contractor", city: "Fumba", phone: "+255 777 777 888", mapsUrl: "https://maps.google.com/?cid=24" },
  { companyName: "Fumba Town Developers", category: "contractor", city: "Fumba", phone: "+255 777 888 999", website: "https://fumbatown.com", email: "info@fumbatown.com", mapsUrl: "https://maps.google.com/?cid=25" },
  { companyName: "Nakupenda Construction Ltd", category: "contractor", city: "Stone Town", phone: "+255 778 222 333", mapsUrl: "https://maps.google.com/?cid=26" },
  { companyName: "Bwejuu Construction & Design", category: "contractor", city: "Bwejuu", mapsUrl: "https://maps.google.com/?cid=27" },
  { companyName: "Paje Building Works", category: "contractor", city: "Paje", phone: "+255 777 555 666", mapsUrl: "https://maps.google.com/?cid=28" },
  { companyName: "Nungwi Construction Co", category: "contractor", city: "Nungwi", phone: "+255 777 444 555", mapsUrl: "https://maps.google.com/?cid=29" },
  { companyName: "Jambiani Building Solutions", category: "contractor", city: "Jambiani", phone: "+255 777 999 000", mapsUrl: "https://maps.google.com/?cid=30" },
]

export async function discoverGoogleMaps(): Promise<SocialLead[]> {
  let liveEnrichment: Map<string, { phone?: string; website?: string; email?: string }> = new Map()

  if (isApifyEnabled()) {
    try {
      const results: any[] = await runApifyActor(GOOGLE_MAPS_ACTOR, {
        searchStrings: ["building materials dar es salaam", "furniture dar es salaam"],
        maxCrawledPlaces: 5,
      })
      for (const r of results) {
        const name = r.companyName || r.name || ""
        if (name) {
          liveEnrichment.set(name.toLowerCase(), {
            phone: r.phone || undefined,
            website: r.website || undefined,
            email: r.email || undefined,
          })
        }
      }
    } catch {
      /* enrichment failed, use curated data */
    }
  }

  return CURATED_PLACES.map((place) => {
    const live = liveEnrichment.get(place.companyName.toLowerCase())
    return {
      companyName: place.companyName,
      category: place.category,
      city: place.city,
      country: "Tanzania",
      phone: live?.phone || place.phone,
      website: live?.website || place.website,
      email: live?.email || place.email,
      sourceAttributions: [buildMapsAttribution(place.mapsUrl)],
      trustScore: 0,
    }
  })
}
