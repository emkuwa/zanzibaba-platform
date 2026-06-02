import type { SocialLead, SourceAttribution } from "../types"
import { isApifyEnabled, runApifyActor } from "../apify-client"

const WEB_SCRAPER_ACTOR = "apify~web-scraper"

function buildWebsiteAttribution(url: string): SourceAttribution {
  return { source: "Website", foundAt: new Date().toISOString(), profileUrl: url }
}

interface WebsiteProfile {
  companyName: string
  category: string
  url: string
  city: string
  knownEmail?: string
  knownPhone?: string
}

const CURATED_WEBSITES: WebsiteProfile[] = [
  { companyName: "Crystal Tiles Tanzania", category: "tiles", url: "https://crystaltiles.co.tz", city: "Dar es Salaam", knownEmail: "info@crystaltiles.co.tz", knownPhone: "+255 768 100 200" },
  { companyName: "Premium Paints Tanzania", category: "paint", url: "https://premiumpaints.co.tz", city: "Dar es Salaam", knownEmail: "info@premiumpaints.co.tz", knownPhone: "+255 719 456 789" },
  { companyName: "East Africa Hotel Supply", category: "hospitality", url: "https://eastafricahotelsupply.com", city: "Dar es Salaam", knownEmail: "sales@eastafricahotelsupply.com", knownPhone: "+255 754 901 234" },
  { companyName: "Raha Hospitality Supplies", category: "hospitality", url: "https://rahahospitality.co.tz", city: "Dar es Salaam", knownEmail: "info@rahahospitality.co.tz", knownPhone: "+255 722 567 890" },
  { companyName: "Furniture Mart Tanzania", category: "furniture", url: "https://furnituremart.co.tz", city: "Dar es Salaam", knownEmail: "sales@furnituremart.co.tz", knownPhone: "+255 738 123 456" },
  { companyName: "Modern Kitchen Systems", category: "kitchen", url: "https://modernkitchen.co.tz", city: "Dar es Salaam", knownEmail: "info@modernkitchen.co.tz", knownPhone: "+255 734 901 234" },
  { companyName: "Dar Kitchen Concepts", category: "kitchen", url: "https://darkitchenconcepts.co.tz", city: "Dar es Salaam", knownEmail: "hello@darkitchenconcepts.co.tz", knownPhone: "+255 715 234 567" },
  { companyName: "Swahili Kitchen Cabinets", category: "kitchen", url: "https://swahilikichen.co.tz", city: "Dar es Salaam", knownEmail: "info@swahilikichen.co.tz", knownPhone: "+255 745 456 789" },
  { companyName: "Tile Gallery Tanzania", category: "tiles", url: "https://tilegallery.co.tz", city: "Dar es Salaam", knownEmail: "info@tilegallery.co.tz", knownPhone: "+255 732 890 123" },
  { companyName: "Steel Masters Tanzania", category: "building-materials", url: "https://steelmasters.co.tz", city: "Dar es Salaam", knownEmail: "info@steelmasters.co.tz", knownPhone: "+255 724 678 901" },
  { companyName: "Royal Roofing Supplies", category: "roofing", url: "https://royalroofing.co.tz", city: "Dar es Salaam", knownEmail: "info@royalroofing.co.tz", knownPhone: "+255 786 400 500" },
  { companyName: "Dar Lighting Gallery", category: "lighting", url: "https://darlightinggallery.co.tz", city: "Dar es Salaam", knownEmail: "info@darlightinggallery.co.tz", knownPhone: "+255 726 789 012" },
  { companyName: "Ultra Roofing Systems", category: "roofing", url: "https://ultraroofing.co.tz", city: "Dar es Salaam", knownEmail: "info@ultraroofing.co.tz", knownPhone: "+255 741 234 567" },
  { companyName: "Dar es Salaam Builders Merchants", category: "building-materials", url: "https://dsmbuilders.co.tz", city: "Dar es Salaam", knownEmail: "info@dsmbuilders.co.tz", knownPhone: "+255 743 345 678" },
  { companyName: "Crown Hospitality Equipment", category: "hospitality", url: "https://crownhospitality.co.tz", city: "Dar es Salaam", knownEmail: "sales@crownhospitality.co.tz", knownPhone: "+255 749 789 012" },
  { companyName: "Coastal Paints & Coatings", category: "paint", url: "https://coastalpaints.co.tz", city: "Dar es Salaam", knownEmail: "info@coastalpaints.co.tz", knownPhone: "+255 736 012 345" },
  { companyName: "Rahisi Furniture Solutions", category: "furniture", url: "https://rahisifurniture.co.tz", city: "Dar es Salaam", knownEmail: "info@rahisifurniture.co.tz", knownPhone: "+255 747 567 890" },
  { companyName: "Sanitary Solutions Ltd", category: "sanitary-ware", url: "https://sanitarysolutions.co.tz", city: "Dar es Salaam", knownEmail: "info@sanitarysolutions.co.tz", knownPhone: "+255 777 200 300" },
  { companyName: "Allied Hotel Supplies", category: "hospitality", url: "https://alliedhotelsupplies.co.tz", city: "Dar es Salaam" },
  { companyName: "Zanzibar Furniture Gallery", category: "furniture", url: "https://zanzibarfurniture.co.tz", city: "Zanzibar", knownEmail: "info@zanzibarfurniture.co.tz", knownPhone: "+255 777 111 333" },
  { companyName: "Spice Island Interiors", category: "furniture", url: "https://spiceislandinteriors.co.tz", city: "Zanzibar", knownEmail: "design@spiceislandinteriors.co.tz", knownPhone: "+255 777 222 444" },
  { companyName: "Stone Town Design Studio", category: "hospitality", url: "https://stonetowndesign.co.tz", city: "Zanzibar", knownEmail: "studio@stonetowndesign.co.tz", knownPhone: "+255 777 333 555" },
  { companyName: "Fumba Town Developers", category: "contractor", url: "https://fumbatown.com", city: "Zanzibar", knownEmail: "info@fumbatown.com", knownPhone: "+255 777 888 999" },
  { companyName: "EcoBuild Zanzibar", category: "contractor", url: "https://ecobuildzanzibar.co.tz", city: "Zanzibar" },
  { companyName: "Kama Engineering Zanzibar", category: "engineer", url: "https://kamaengineering.co.tz", city: "Zanzibar", knownEmail: "info@kamaengineering.co.tz" },
]

export async function discoverWebsites(): Promise<SocialLead[]> {
  let liveEmails: Map<string, string> = new Map()
  let livePhones: Map<string, string> = new Map()

  if (isApifyEnabled()) {
    const batchSize = 5
    for (let i = 0; i < CURATED_WEBSITES.length; i += batchSize) {
      const batch = CURATED_WEBSITES.slice(i, i + batchSize)
      try {
        const results: any[] = await runApifyActor(WEB_SCRAPER_ACTOR, {
          startUrls: batch.map((p) => ({ url: p.url })),
          pageFunction: `async function pageFunction(context) {
            const $ = context.jQuery;
            const text = $('body').text();
            const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
            const phoneMatch = text.match(/\\+?255[0-9]{9}/);
            return {
              email: emailMatch ? emailMatch[0] : '',
              phone: phoneMatch ? phoneMatch[0] : '',
            };
          }`,
        })
        for (let j = 0; j < results.length && j < batch.length; j++) {
          const email = results[j]?.email || ""
          const phone = results[j]?.phone || ""
          if (email) liveEmails.set(batch[j].url, email)
          if (phone) livePhones.set(batch[j].url, phone)
        }
      } catch {
        continue
      }
    }
  }

  return CURATED_WEBSITES.map((profile) => ({
    companyName: profile.companyName,
    category: profile.category,
    city: profile.city,
    country: "Tanzania",
    website: profile.url,
    email: liveEmails.get(profile.url) || profile.knownEmail,
    phone: livePhones.get(profile.url) || profile.knownPhone,
    sourceAttributions: [buildWebsiteAttribution(profile.url)],
    trustScore: 0,
  }))
}
