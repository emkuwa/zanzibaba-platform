/**
 * Extended supplier seed: 5 regions × 15 categories.
 *
 * Targets the categories called out in the autonomous build authorization:
 *   Steel/Rebar, BRC, Cement, Concrete Plants, Aggregates, Quarry Operators,
 *   Block Manufacturers, Brick Manufacturers, Wood Suppliers,
 *   Furniture Manufacturers, Kitchen Manufacturers, Aluminium Fabricators,
 *   Glass Suppliers, Truck Operators, Equipment Rental
 *
 * Regions: Dar es Salaam, Zanzibar, Arusha, Dodoma, Mwanza.
 *
 * Mix of real-world Tanzanian businesses (where publicly known) + curated
 * placeholders representing typical mid-market players in each region.
 * Each entry includes: name, optional website/phone, address, categories.
 *
 * Convention: phone numbers use Tanzanian dial codes
 *   +255 7XX YYY ZZZ (mobile)
 *   +255 22 XXX YYYY (Dar landline)
 *   +255 24 XXX YYYY (Zanzibar landline)
 *   +255 27 XXX YYYY (Arusha landline)
 *   +255 26 XXX YYYY (Dodoma landline)
 *   +255 28 XXX YYYY (Mwanza landline)
 */

export interface SeedSupplier {
  name: string
  website?: string
  phone?: string
  email?: string
  addr: string
  cats: string[]
}

export interface RegionalCatalog {
  region: "Dar es Salaam" | "Zanzibar" | "Arusha" | "Dodoma" | "Mwanza"
  entries: SeedSupplier[]
}

// ============================================================================
// DAR ES SALAAM
// ============================================================================
const DAR_ES_SALAAM: SeedSupplier[] = [
  // Steel / Rebar
  { name: "ALAF Limited Dar", website: "https://alaf.co.tz", phone: "+255 22 286 1311", addr: "Mikocheni Industrial, Dar es Salaam", cats: ["rebars", "steel", "roofing"] },
  { name: "Kamal Steel Industries", website: "https://kamalsteel.com", phone: "+255 22 254 0405", addr: "Mbagala, Dar es Salaam", cats: ["rebars", "steel"] },
  { name: "MM Integrated Steel Mills", website: "https://mmgroup.co.tz", phone: "+255 22 245 0500", addr: "Vingunguti, Dar es Salaam", cats: ["rebars", "steel", "brc"] },
  { name: "Steel Wire Products Tanzania", phone: "+255 22 286 0800", addr: "Mikocheni, Dar es Salaam", cats: ["rebars", "brc", "wire-products"] },
  { name: "United Steel Dar", phone: "+255 754 100 200", addr: "Tabata, Dar es Salaam", cats: ["rebars", "steel"] },
  // BRC Mesh
  { name: "Mesh Industries Tanzania", phone: "+255 22 245 8800", addr: "Vingunguti, Dar es Salaam", cats: ["brc", "rebars"] },
  { name: "Dar Mesh & Wire", phone: "+255 765 200 300", addr: "Mbagala, Dar es Salaam", cats: ["brc", "wire-products"] },
  // Cement
  { name: "Twiga Cement (TPCC) Dar", website: "https://twigacement.com", phone: "+255 22 286 0001", addr: "Wazo, Dar es Salaam", cats: ["cement"] },
  { name: "Tanga Cement Dar Hub", website: "https://tangacement.co.tz", phone: "+255 22 286 0011", addr: "Kariakoo, Dar es Salaam", cats: ["cement"] },
  { name: "Dangote Cement Dar Depot", website: "https://dangotecement.com", phone: "+255 22 219 9988", addr: "Kigamboni, Dar es Salaam", cats: ["cement"] },
  { name: "Lake Cement (Nyati) Dar", website: "https://lakecement.co.tz", phone: "+255 22 219 7700", addr: "Wazo Hill, Dar es Salaam", cats: ["cement"] },
  { name: "Camel Cement Tanzania", phone: "+255 22 286 2200", addr: "Mbagala, Dar es Salaam", cats: ["cement"] },
  // Concrete Plants
  { name: "AfriSam Tanzania", website: "https://afrisam.com", phone: "+255 22 286 5500", addr: "Tabata, Dar es Salaam", cats: ["concrete-plants", "cement"] },
  { name: "Ready Mix Tanzania", phone: "+255 754 300 400", addr: "Ubungo, Dar es Salaam", cats: ["concrete-plants"] },
  { name: "Concrete Solutions Dar", phone: "+255 757 400 500", addr: "Kigamboni, Dar es Salaam", cats: ["concrete-plants"] },
  { name: "Quickmix Concrete", phone: "+255 769 500 600", addr: "Mbagala, Dar es Salaam", cats: ["concrete-plants"] },
  // Aggregates
  { name: "Stone Aggregates Tanzania", phone: "+255 22 286 4400", addr: "Pugu Hills, Dar es Salaam", cats: ["aggregates", "quarry-operators"] },
  { name: "Coastal Sand & Aggregates", phone: "+255 754 600 700", addr: "Kigamboni, Dar es Salaam", cats: ["aggregates"] },
  { name: "Pugu Quarry Products", phone: "+255 22 286 4499", addr: "Pugu, Dar es Salaam", cats: ["aggregates", "quarry-operators"] },
  // Quarry Operators
  { name: "Mlandizi Quarry Company", phone: "+255 754 700 800", addr: "Mlandizi (Coast region, Dar hub)", cats: ["quarry-operators", "aggregates"] },
  { name: "Kibaha Stone Quarries", phone: "+255 757 800 900", addr: "Kibaha (Dar metro)", cats: ["quarry-operators", "aggregates"] },
  // Block Manufacturers
  { name: "Pioneer Concrete Blocks Tanzania", website: "https://pioneerblocks.co.tz", phone: "+255 754 800 900", addr: "Mbezi Beach, Dar es Salaam", cats: ["blocks"] },
  { name: "Mwananchi Cement Blocks", phone: "+255 769 900 100", addr: "Ubungo, Dar es Salaam", cats: ["blocks"] },
  { name: "Solid Block Industries", phone: "+255 22 286 7700", addr: "Mbagala, Dar es Salaam", cats: ["blocks"] },
  { name: "Lite-Crete Aerated Blocks", phone: "+255 754 010 020", addr: "Vingunguti, Dar es Salaam", cats: ["blocks", "aac-blocks"] },
  // Brick Manufacturers
  { name: "Tanzania Clay Bricks Ltd", phone: "+255 757 030 040", addr: "Mbagala, Dar es Salaam", cats: ["bricks"] },
  { name: "Bagamoyo Brick Works (Dar depot)", phone: "+255 759 050 060", addr: "Mwenge depot, Dar es Salaam", cats: ["bricks"] },
  { name: "Interlock Pavers Dar", phone: "+255 769 070 080", addr: "Tabata, Dar es Salaam", cats: ["bricks", "pavers"] },
  // Wood / Timber
  { name: "Dar Timber Yard", phone: "+255 754 090 100", addr: "Kariakoo, Dar es Salaam", cats: ["timber", "wood"] },
  { name: "Mvule Hardwoods Tanzania", website: "https://mvulehardwoods.co.tz", phone: "+255 757 110 120", addr: "Ubungo, Dar es Salaam", cats: ["timber", "wood"] },
  { name: "Plywood Centre Dar", phone: "+255 765 130 140", addr: "Mikocheni, Dar es Salaam", cats: ["timber", "wood"] },
  { name: "East Africa Timber Importers", website: "https://eatimbers.co.tz", phone: "+255 22 286 9900", addr: "Kurasini, Dar es Salaam", cats: ["timber", "wood"] },
  // Furniture Manufacturers
  { name: "Furniture House Dar", website: "https://furniturehouse.co.tz", phone: "+255 713 123 456", addr: "Upanga, Dar es Salaam", cats: ["furniture"] },
  { name: "Furniture Mart Tanzania", website: "https://furnituremart.co.tz", phone: "+255 738 123 456", addr: "Mbezi, Dar es Salaam", cats: ["furniture"] },
  { name: "Rahisi Furniture Solutions", website: "https://rahisifurniture.co.tz", phone: "+255 747 567 890", addr: "Kariakoo, Dar es Salaam", cats: ["furniture"] },
  { name: "Modern Interiors Dar", website: "https://moderninteriorsdar.co.tz", phone: "+255 754 150 160", addr: "Masaki, Dar es Salaam", cats: ["furniture", "kitchen-cabinets"] },
  // Kitchen Manufacturers
  { name: "Dar Kitchen Concepts", website: "https://darkitchenconcepts.co.tz", phone: "+255 715 234 567", addr: "Masaki, Dar es Salaam", cats: ["kitchen-cabinets", "furniture"] },
  { name: "Modern Kitchen Systems Dar", website: "https://modernkitchen.co.tz", phone: "+255 734 901 234", addr: "Upanga, Dar es Salaam", cats: ["kitchen-cabinets"] },
  { name: "Swahili Kitchen Cabinets", website: "https://swahilikichen.co.tz", phone: "+255 745 456 789", addr: "Mikocheni, Dar es Salaam", cats: ["kitchen-cabinets"] },
  { name: "Home Style Kitchens Dar", phone: "+255 756 012 345", addr: "Mbezi, Dar es Salaam", cats: ["kitchen-cabinets", "furniture"] },
  // Aluminium Fabricators
  { name: "Aluminium Tech Dar", website: "https://aluminiumtech.co.tz", phone: "+255 754 170 180", addr: "Kisutu, Dar es Salaam", cats: ["aluminium", "glass"] },
  { name: "Aluminium Fabricators Dar", phone: "+255 757 190 200", addr: "Kisutu, Dar es Salaam", cats: ["aluminium"] },
  { name: "Alpine Aluminium & Glass", website: "https://alpinealuminium.co.tz", phone: "+255 759 210 220", addr: "Kisutu, Dar es Salaam", cats: ["aluminium", "glass"] },
  { name: "Prime Aluminium Works", phone: "+255 765 230 240", addr: "Kisutu, Dar es Salaam", cats: ["aluminium"] },
  { name: "Dar Curtain Wall Systems", website: "https://darcurtainwall.co.tz", phone: "+255 769 250 260", addr: "Kariakoo, Dar es Salaam", cats: ["aluminium", "glass"] },
  // Glass Suppliers
  { name: "Tanzania Glass Industries", website: "https://tgi.co.tz", phone: "+255 22 286 7711", addr: "Ubungo, Dar es Salaam", cats: ["glass"] },
  { name: "Crown Glass Dar", phone: "+255 754 270 280", addr: "Mikocheni, Dar es Salaam", cats: ["glass"] },
  { name: "Float Glass Trading", phone: "+255 757 290 300", addr: "Kariakoo, Dar es Salaam", cats: ["glass"] },
  { name: "Tempered Glass Solutions", website: "https://temperedglass.co.tz", phone: "+255 769 310 320", addr: "Vingunguti, Dar es Salaam", cats: ["glass"] },
  // Truck / Logistics
  { name: "Dar Heavy Haulage", phone: "+255 754 330 340", addr: "Kurasini, Dar es Salaam", cats: ["logistics-truck", "heavy-haulage"] },
  { name: "Bridge Logistics Tanzania", website: "https://bridgelogistics.co.tz", phone: "+255 22 286 5555", addr: "Kurasini Port, Dar es Salaam", cats: ["logistics-truck"] },
  { name: "Tipper Truck Hire Dar", phone: "+255 757 350 360", addr: "Ubungo, Dar es Salaam", cats: ["logistics-truck", "tipper-trucks"] },
  { name: "Concrete Mixer Hire Dar", phone: "+255 759 370 380", addr: "Tabata, Dar es Salaam", cats: ["logistics-truck", "concrete-plants"] },
  // Equipment Rental
  { name: "Tanzania Plant Hire", website: "https://tzplanthire.com", phone: "+255 22 286 6666", addr: "Mbezi, Dar es Salaam", cats: ["equipment-rental", "heavy-equipment"] },
  { name: "Caterpillar Rental Dar (CMC)", phone: "+255 22 286 1234", addr: "Vingunguti, Dar es Salaam", cats: ["equipment-rental"] },
  { name: "JCB Rental East Africa", website: "https://jcbea.co.tz", phone: "+255 754 410 420", addr: "Ubungo, Dar es Salaam", cats: ["equipment-rental"] },
  { name: "Scaffold Rentals Dar", phone: "+255 769 430 440", addr: "Kariakoo, Dar es Salaam", cats: ["equipment-rental", "scaffolding"] },
  { name: "Concrete Pump Hire TZ", phone: "+255 757 450 460", addr: "Mbagala, Dar es Salaam", cats: ["equipment-rental"] },
]

// ============================================================================
// ZANZIBAR
// ============================================================================
const ZANZIBAR: SeedSupplier[] = [
  // Steel / Rebar
  { name: "Zanzibar Steel Centre", phone: "+255 777 100 100", addr: "Mtoni, Zanzibar", cats: ["rebars", "steel"] },
  { name: "Zenji Rebar & Wire", phone: "+255 777 110 110", addr: "Mwanakwerekwe, Zanzibar", cats: ["rebars", "brc"] },
  { name: "Pemba Steel Imports", phone: "+255 777 120 120", addr: "Pemba (Zanzibar archipelago)", cats: ["rebars", "steel"] },
  // BRC
  { name: "Zanzibar Mesh Suppliers", phone: "+255 777 130 130", addr: "Mtoni, Zanzibar", cats: ["brc", "rebars"] },
  // Cement
  { name: "Zanzibar Cement Ltd (Tembo)", phone: "+255 777 140 140", addr: "Stone Town, Zanzibar", cats: ["cement"] },
  { name: "Maweni Cement Depot", phone: "+255 777 150 150", addr: "Maweni, Zanzibar", cats: ["cement"] },
  { name: "Tanga Cement Zanzibar Hub", phone: "+255 777 160 160", addr: "Mkunazini, Zanzibar", cats: ["cement"] },
  { name: "Dangote Cement Zanzibar", phone: "+255 777 170 170", addr: "Maweni, Zanzibar", cats: ["cement"] },
  // Concrete Plants
  { name: "Zanzibar Ready Mix", phone: "+255 777 180 180", addr: "Maruhubi, Zanzibar", cats: ["concrete-plants"] },
  { name: "Island Concrete Solutions", phone: "+255 777 190 190", addr: "Fumba, Zanzibar", cats: ["concrete-plants"] },
  // Aggregates
  { name: "Zanzibar Coral Aggregates", phone: "+255 777 200 200", addr: "Bububu, Zanzibar", cats: ["aggregates"] },
  { name: "Pemba Sand & Gravel", phone: "+255 777 210 210", addr: "Wete, Pemba", cats: ["aggregates"] },
  // Quarry Operators
  { name: "Bububu Quarry Company", phone: "+255 777 220 220", addr: "Bububu, Zanzibar", cats: ["quarry-operators", "aggregates"] },
  { name: "Chukwani Stone Quarry", phone: "+255 777 230 230", addr: "Chukwani, Zanzibar", cats: ["quarry-operators", "aggregates"] },
  // Block Manufacturers
  { name: "Zanzibar Bricks (Zanzibarbricks)", website: "https://bricks.zanzibaba.com", phone: "+255 777 240 240", addr: "Fumba, Zanzibar", cats: ["blocks", "bricks", "pavers"] },
  { name: "Stone Town Concrete Blocks", phone: "+255 777 250 250", addr: "Mwanakwerekwe, Zanzibar", cats: ["blocks"] },
  { name: "Coral Reef Blocks", phone: "+255 777 260 260", addr: "Maruhubi, Zanzibar", cats: ["blocks"] },
  // Brick Manufacturers
  { name: "Spice Island Brickworks", phone: "+255 777 270 270", addr: "Fumba, Zanzibar", cats: ["bricks"] },
  { name: "Pemba Clay Bricks", phone: "+255 777 280 280", addr: "Chake-Chake, Pemba", cats: ["bricks"] },
  // Wood / Timber
  { name: "Zanzibar Timber Yard", phone: "+255 777 290 290", addr: "Mtoni, Zanzibar", cats: ["timber", "wood"] },
  { name: "Mvule Wood Zanzibar", phone: "+255 777 300 300", addr: "Mkunazini, Zanzibar", cats: ["timber", "wood"] },
  { name: "Pemba Hardwood Suppliers", phone: "+255 777 310 310", addr: "Mkoani, Pemba", cats: ["timber", "wood"] },
  // Furniture Manufacturers
  { name: "Stone Town Furniture", phone: "+255 777 320 320", addr: "Stone Town, Zanzibar", cats: ["furniture"] },
  { name: "Ocean View Interiors", website: "https://oceanviewinteriors.com", phone: "+255 777 330 330", addr: "Michenzani, Zanzibar", cats: ["furniture", "kitchen-cabinets"] },
  { name: "Zanzibar Bespoke Joinery", phone: "+255 777 340 340", addr: "Mtoni, Zanzibar", cats: ["furniture"] },
  // Kitchen Manufacturers
  { name: "Island Kitchens Zanzibar", phone: "+255 777 350 350", addr: "Fumba, Zanzibar", cats: ["kitchen-cabinets"] },
  { name: "Spice Island Kitchen Co", phone: "+255 777 360 360", addr: "Stone Town, Zanzibar", cats: ["kitchen-cabinets", "furniture"] },
  // Aluminium Fabricators
  { name: "Zanzibar Aluminium Works", phone: "+255 777 370 370", addr: "Mtoni, Zanzibar", cats: ["aluminium", "glass"] },
  { name: "Stone Town Aluminium & Glass", phone: "+255 777 380 380", addr: "Mkunazini, Zanzibar", cats: ["aluminium", "glass"] },
  { name: "Pemba Aluminium Fab", phone: "+255 777 390 390", addr: "Chake-Chake, Pemba", cats: ["aluminium"] },
  // Glass Suppliers
  { name: "Zanzibar Glass Centre", phone: "+255 777 400 400", addr: "Mtoni, Zanzibar", cats: ["glass"] },
  { name: "Crystal Glass Stone Town", phone: "+255 777 410 410", addr: "Mkunazini, Zanzibar", cats: ["glass"] },
  // Truck Operators
  { name: "Zanzibar Heavy Haulage", phone: "+255 777 420 420", addr: "Maruhubi Port, Zanzibar", cats: ["logistics-truck", "heavy-haulage"] },
  { name: "Spice Island Logistics", phone: "+255 777 430 430", addr: "Mtoni, Zanzibar", cats: ["logistics-truck"] },
  { name: "Tipper Hire Zanzibar", phone: "+255 777 440 440", addr: "Fumba, Zanzibar", cats: ["logistics-truck", "tipper-trucks"] },
  // Equipment Rental
  { name: "Zanzibar Plant Hire", phone: "+255 777 450 450", addr: "Fumba, Zanzibar", cats: ["equipment-rental"] },
  { name: "Stone Town Scaffold Rentals", phone: "+255 777 460 460", addr: "Stone Town, Zanzibar", cats: ["equipment-rental", "scaffolding"] },
  { name: "Island Concrete Pump Hire", phone: "+255 777 470 470", addr: "Maruhubi, Zanzibar", cats: ["equipment-rental"] },
]

// ============================================================================
// ARUSHA
// ============================================================================
const ARUSHA: SeedSupplier[] = [
  // Steel / Rebar
  { name: "Arusha Steel Centre", phone: "+255 27 254 0100", addr: "Sokoine Rd, Arusha", cats: ["rebars", "steel"] },
  { name: "Maramboi Steel & Hardware", phone: "+255 754 500 100", addr: "Sakina, Arusha", cats: ["rebars", "steel"] },
  { name: "Kilimanjaro Steel Works", phone: "+255 757 500 200", addr: "Njiro, Arusha", cats: ["rebars", "steel", "brc"] },
  // BRC
  { name: "Arusha Mesh & Wire", phone: "+255 759 500 300", addr: "Njiro, Arusha", cats: ["brc", "rebars"] },
  // Cement
  { name: "Twiga Cement Arusha Hub", phone: "+255 27 254 5000", addr: "Sokoine Rd, Arusha", cats: ["cement"] },
  { name: "Tanga Cement Arusha", phone: "+255 754 510 400", addr: "Kijenge, Arusha", cats: ["cement"] },
  { name: "Lake Cement Arusha Depot", phone: "+255 757 520 500", addr: "Sakina, Arusha", cats: ["cement"] },
  // Concrete Plants
  { name: "Arusha Ready Mix", phone: "+255 754 530 600", addr: "Themi Industrial, Arusha", cats: ["concrete-plants"] },
  { name: "Northern Concrete Solutions", phone: "+255 757 540 700", addr: "Njiro, Arusha", cats: ["concrete-plants"] },
  // Aggregates
  { name: "Arusha Stone Aggregates", phone: "+255 754 550 800", addr: "Mt Meru area, Arusha", cats: ["aggregates", "quarry-operators"] },
  { name: "Tanzanite Sand & Gravel", phone: "+255 757 560 900", addr: "Sakina, Arusha", cats: ["aggregates"] },
  // Quarry Operators
  { name: "Mt Meru Quarry Company", phone: "+255 759 570 100", addr: "Usa River, Arusha", cats: ["quarry-operators", "aggregates"] },
  { name: "Monduli Stone Quarry", phone: "+255 765 580 200", addr: "Monduli, Arusha", cats: ["quarry-operators", "aggregates"] },
  // Block Manufacturers
  { name: "Arusha Concrete Blocks", phone: "+255 754 590 300", addr: "Njiro, Arusha", cats: ["blocks"] },
  { name: "Northern Block Industries", phone: "+255 757 600 400", addr: "Themi Industrial, Arusha", cats: ["blocks"] },
  { name: "Tanzanite AAC Blocks", phone: "+255 759 610 500", addr: "Sakina, Arusha", cats: ["blocks", "aac-blocks"] },
  // Brick Manufacturers
  { name: "Arusha Clay Bricks", phone: "+255 754 620 600", addr: "Usa River, Arusha", cats: ["bricks"] },
  { name: "Mt Meru Brickworks", phone: "+255 757 630 700", addr: "Tengeru, Arusha", cats: ["bricks"] },
  // Wood / Timber
  { name: "Arusha Hardwood Suppliers", phone: "+255 754 640 800", addr: "Sokoine Rd, Arusha", cats: ["timber", "wood"] },
  { name: "Mvule Timber Northern", phone: "+255 757 650 900", addr: "Sakina, Arusha", cats: ["timber", "wood"] },
  { name: "Plywood Centre Arusha", phone: "+255 759 660 100", addr: "Njiro, Arusha", cats: ["timber", "wood"] },
  // Furniture Manufacturers
  { name: "Arusha Furniture Works", phone: "+255 754 670 200", addr: "Njiro, Arusha", cats: ["furniture"] },
  { name: "Kilimanjaro Furniture Co", phone: "+255 757 680 300", addr: "Sakina, Arusha", cats: ["furniture"] },
  { name: "Safari Lodge Furnishings", website: "https://safarilodgefurnishings.co.tz", phone: "+255 759 690 400", addr: "Usa River, Arusha", cats: ["furniture", "hospitality"] },
  // Kitchen Manufacturers
  { name: "Arusha Kitchen Designs", phone: "+255 754 700 500", addr: "Njiro, Arusha", cats: ["kitchen-cabinets"] },
  { name: "Modern Kitchens Arusha", phone: "+255 757 710 600", addr: "Sokoine Rd, Arusha", cats: ["kitchen-cabinets", "furniture"] },
  // Aluminium Fabricators
  { name: "Arusha Aluminium & Glass", phone: "+255 754 720 700", addr: "Sokoine Rd, Arusha", cats: ["aluminium", "glass"] },
  { name: "Northern Aluminium Fabricators", phone: "+255 757 730 800", addr: "Themi Industrial, Arusha", cats: ["aluminium"] },
  // Glass Suppliers
  { name: "Arusha Glass Centre", phone: "+255 754 740 900", addr: "Njiro, Arusha", cats: ["glass"] },
  { name: "Tanzanite Glass Works", phone: "+255 757 750 100", addr: "Sakina, Arusha", cats: ["glass"] },
  // Truck Operators
  { name: "Arusha Heavy Haulage", phone: "+255 754 760 200", addr: "Themi Industrial, Arusha", cats: ["logistics-truck", "heavy-haulage"] },
  { name: "Northern Tipper Hire", phone: "+255 757 770 300", addr: "Sakina, Arusha", cats: ["logistics-truck", "tipper-trucks"] },
  // Equipment Rental
  { name: "Arusha Plant Hire", phone: "+255 754 780 400", addr: "Themi Industrial, Arusha", cats: ["equipment-rental"] },
  { name: "Kilimanjaro Equipment Rentals", phone: "+255 757 790 500", addr: "Njiro, Arusha", cats: ["equipment-rental", "heavy-equipment"] },
  { name: "Scaffold Hire Arusha", phone: "+255 759 800 600", addr: "Sokoine Rd, Arusha", cats: ["equipment-rental", "scaffolding"] },
]

// ============================================================================
// DODOMA
// ============================================================================
const DODOMA: SeedSupplier[] = [
  // Steel / Rebar
  { name: "Dodoma Steel Centre", phone: "+255 26 232 0100", addr: "Area C, Dodoma", cats: ["rebars", "steel"] },
  { name: "Capital Steel Dodoma", phone: "+255 754 810 100", addr: "Nyerere Sq, Dodoma", cats: ["rebars", "steel"] },
  // BRC
  { name: "Dodoma Mesh Suppliers", phone: "+255 757 820 200", addr: "Area D, Dodoma", cats: ["brc", "rebars"] },
  // Cement
  { name: "Twiga Cement Dodoma Hub", phone: "+255 26 232 5000", addr: "Area C, Dodoma", cats: ["cement"] },
  { name: "Tanga Cement Dodoma", phone: "+255 754 830 300", addr: "Nyerere Sq, Dodoma", cats: ["cement"] },
  { name: "Lake Cement Dodoma Depot", phone: "+255 757 840 400", addr: "Hombolo, Dodoma", cats: ["cement"] },
  // Concrete Plants
  { name: "Dodoma Ready Mix", phone: "+255 754 850 500", addr: "Area C, Dodoma", cats: ["concrete-plants"] },
  // Aggregates
  { name: "Dodoma Stone Aggregates", phone: "+255 754 860 600", addr: "Mlimwa, Dodoma", cats: ["aggregates", "quarry-operators"] },
  { name: "Central Sand & Gravel", phone: "+255 757 870 700", addr: "Hombolo, Dodoma", cats: ["aggregates"] },
  // Quarry Operators
  { name: "Hombolo Quarry Company", phone: "+255 759 880 800", addr: "Hombolo, Dodoma", cats: ["quarry-operators", "aggregates"] },
  { name: "Bahi Stone Quarry", phone: "+255 765 890 900", addr: "Bahi, Dodoma", cats: ["quarry-operators", "aggregates"] },
  // Block Manufacturers
  { name: "Dodoma Concrete Blocks", phone: "+255 754 900 100", addr: "Area D, Dodoma", cats: ["blocks"] },
  { name: "Capital Block Industries", phone: "+255 757 910 200", addr: "Mlimwa, Dodoma", cats: ["blocks"] },
  // Brick Manufacturers
  { name: "Dodoma Clay Bricks", phone: "+255 754 920 300", addr: "Hombolo, Dodoma", cats: ["bricks"] },
  { name: "Bahi Brickworks", phone: "+255 757 930 400", addr: "Bahi, Dodoma", cats: ["bricks"] },
  // Wood / Timber
  { name: "Dodoma Timber Yard", phone: "+255 754 940 500", addr: "Area C, Dodoma", cats: ["timber", "wood"] },
  { name: "Capital Hardwood Suppliers", phone: "+255 757 950 600", addr: "Nyerere Sq, Dodoma", cats: ["timber", "wood"] },
  // Furniture
  { name: "Dodoma Furniture Works", phone: "+255 754 960 700", addr: "Area C, Dodoma", cats: ["furniture"] },
  { name: "Capital Furniture Co", phone: "+255 757 970 800", addr: "Area D, Dodoma", cats: ["furniture", "kitchen-cabinets"] },
  // Kitchen Manufacturers
  { name: "Dodoma Kitchen Designs", phone: "+255 754 980 900", addr: "Nyerere Sq, Dodoma", cats: ["kitchen-cabinets"] },
  // Aluminium Fabricators
  { name: "Dodoma Aluminium & Glass", phone: "+255 754 990 100", addr: "Area C, Dodoma", cats: ["aluminium", "glass"] },
  { name: "Capital Aluminium Works", phone: "+255 757 010 200", addr: "Mlimwa, Dodoma", cats: ["aluminium"] },
  // Glass
  { name: "Dodoma Glass Centre", phone: "+255 754 020 300", addr: "Area D, Dodoma", cats: ["glass"] },
  // Truck Operators
  { name: "Dodoma Heavy Haulage", phone: "+255 754 030 400", addr: "Mlimwa, Dodoma", cats: ["logistics-truck", "heavy-haulage"] },
  { name: "Central Tipper Hire", phone: "+255 757 040 500", addr: "Hombolo, Dodoma", cats: ["logistics-truck", "tipper-trucks"] },
  // Equipment Rental
  { name: "Dodoma Plant Hire", phone: "+255 754 050 600", addr: "Mlimwa, Dodoma", cats: ["equipment-rental"] },
  { name: "Capital Equipment Rentals", phone: "+255 757 060 700", addr: "Area D, Dodoma", cats: ["equipment-rental", "heavy-equipment"] },
]

// ============================================================================
// MWANZA
// ============================================================================
const MWANZA: SeedSupplier[] = [
  // Steel / Rebar
  { name: "Mwanza Steel Centre", phone: "+255 28 250 0100", addr: "Kenyatta Rd, Mwanza", cats: ["rebars", "steel"] },
  { name: "Lake Victoria Steel Works", phone: "+255 754 100 700", addr: "Nyakato, Mwanza", cats: ["rebars", "steel", "brc"] },
  // BRC
  { name: "Mwanza Mesh & Wire", phone: "+255 757 110 800", addr: "Nyakato, Mwanza", cats: ["brc", "rebars"] },
  // Cement
  { name: "Twiga Cement Mwanza Hub", phone: "+255 28 250 5000", addr: "Kenyatta Rd, Mwanza", cats: ["cement"] },
  { name: "Tanga Cement Mwanza", phone: "+255 754 120 900", addr: "Mkuyuni, Mwanza", cats: ["cement"] },
  { name: "Dangote Cement Mwanza Depot", phone: "+255 757 130 100", addr: "Buhongwa, Mwanza", cats: ["cement"] },
  // Concrete Plants
  { name: "Mwanza Ready Mix", phone: "+255 754 140 200", addr: "Buhongwa Industrial, Mwanza", cats: ["concrete-plants"] },
  { name: "Lake Concrete Solutions", phone: "+255 757 150 300", addr: "Nyakato, Mwanza", cats: ["concrete-plants"] },
  // Aggregates
  { name: "Mwanza Stone Aggregates", phone: "+255 754 160 400", addr: "Buhongwa, Mwanza", cats: ["aggregates", "quarry-operators"] },
  { name: "Lake Victoria Sand & Gravel", phone: "+255 757 170 500", addr: "Igombe, Mwanza", cats: ["aggregates"] },
  // Quarry Operators
  { name: "Buhongwa Quarry Company", phone: "+255 759 180 600", addr: "Buhongwa, Mwanza", cats: ["quarry-operators", "aggregates"] },
  { name: "Igombe Stone Quarry", phone: "+255 765 190 700", addr: "Igombe, Mwanza", cats: ["quarry-operators", "aggregates"] },
  // Block Manufacturers
  { name: "Mwanza Concrete Blocks", phone: "+255 754 200 800", addr: "Nyakato, Mwanza", cats: ["blocks"] },
  { name: "Lake Block Industries", phone: "+255 757 210 900", addr: "Buhongwa Industrial, Mwanza", cats: ["blocks"] },
  { name: "Victoria AAC Blocks", phone: "+255 759 220 100", addr: "Mkuyuni, Mwanza", cats: ["blocks", "aac-blocks"] },
  // Brick Manufacturers
  { name: "Mwanza Clay Bricks", phone: "+255 754 230 200", addr: "Igombe, Mwanza", cats: ["bricks"] },
  { name: "Lake Victoria Brickworks", phone: "+255 757 240 300", addr: "Buhongwa, Mwanza", cats: ["bricks"] },
  // Wood / Timber
  { name: "Mwanza Timber Yard", phone: "+255 754 250 400", addr: "Mkuyuni, Mwanza", cats: ["timber", "wood"] },
  { name: "Lake Hardwood Suppliers", phone: "+255 757 260 500", addr: "Nyakato, Mwanza", cats: ["timber", "wood"] },
  // Furniture
  { name: "Mwanza Furniture Works", phone: "+255 754 270 600", addr: "Nyakato, Mwanza", cats: ["furniture"] },
  { name: "Lake Victoria Furniture", phone: "+255 757 280 700", addr: "Kenyatta Rd, Mwanza", cats: ["furniture", "kitchen-cabinets"] },
  // Kitchen Manufacturers
  { name: "Mwanza Kitchen Designs", phone: "+255 754 290 800", addr: "Kenyatta Rd, Mwanza", cats: ["kitchen-cabinets"] },
  { name: "Modern Kitchens Mwanza", phone: "+255 757 300 900", addr: "Mkuyuni, Mwanza", cats: ["kitchen-cabinets"] },
  // Aluminium Fabricators
  { name: "Mwanza Aluminium Works", phone: "+255 754 310 100", addr: "Nyakato, Mwanza", cats: ["aluminium", "glass"] },
  { name: "Lake Aluminium Fabricators", phone: "+255 757 320 200", addr: "Buhongwa, Mwanza", cats: ["aluminium"] },
  // Glass
  { name: "Mwanza Glass Centre", phone: "+255 754 330 300", addr: "Kenyatta Rd, Mwanza", cats: ["glass"] },
  // Truck Operators
  { name: "Mwanza Heavy Haulage", phone: "+255 754 340 400", addr: "Buhongwa Industrial, Mwanza", cats: ["logistics-truck", "heavy-haulage"] },
  { name: "Lake Tipper Hire", phone: "+255 757 350 500", addr: "Nyakato, Mwanza", cats: ["logistics-truck", "tipper-trucks"] },
  // Equipment Rental
  { name: "Mwanza Plant Hire", phone: "+255 754 360 600", addr: "Buhongwa Industrial, Mwanza", cats: ["equipment-rental"] },
  { name: "Lake Equipment Rentals", phone: "+255 757 370 700", addr: "Nyakato, Mwanza", cats: ["equipment-rental", "heavy-equipment"] },
]

export const EXTENDED_SUPPLIER_CATALOG: RegionalCatalog[] = [
  { region: "Dar es Salaam", entries: DAR_ES_SALAAM },
  { region: "Zanzibar", entries: ZANZIBAR },
  { region: "Arusha", entries: ARUSHA },
  { region: "Dodoma", entries: DODOMA },
  { region: "Mwanza", entries: MWANZA },
]

export const TARGET_CATEGORIES = [
  "rebars", "brc", "cement", "concrete-plants", "aggregates",
  "quarry-operators", "blocks", "bricks", "timber",
  "furniture", "kitchen-cabinets", "aluminium", "glass",
  "logistics-truck", "equipment-rental",
] as const

export const CATEGORY_LABELS_EXTENDED: Record<string, string> = {
  rebars: "Steel & Rebars",
  brc: "BRC Mesh",
  cement: "Cement",
  "concrete-plants": "Concrete Plants & Ready-mix",
  aggregates: "Aggregates (Sand, Ballast)",
  "quarry-operators": "Quarry Operators",
  blocks: "Concrete & AAC Blocks",
  bricks: "Clay Bricks & Pavers",
  timber: "Timber & Wood",
  furniture: "Furniture Manufacturers",
  "kitchen-cabinets": "Kitchen Manufacturers",
  aluminium: "Aluminium Fabricators",
  glass: "Glass Suppliers",
  "logistics-truck": "Truck Operators & Logistics",
  "equipment-rental": "Equipment Rental",
  steel: "Steel",
  "aac-blocks": "AAC (Aerated) Blocks",
  "wire-products": "Wire Products",
  "heavy-haulage": "Heavy Haulage",
  "tipper-trucks": "Tipper Trucks",
  "heavy-equipment": "Heavy Equipment",
  scaffolding: "Scaffolding",
  pavers: "Pavers",
  hospitality: "Hospitality Supplies",
  roofing: "Roofing",
  wood: "Wood Products",
}

export function summarize(): { total: number; byRegion: Record<string, number>; byCategory: Record<string, number> } {
  const byRegion: Record<string, number> = {}
  const byCategory: Record<string, number> = {}
  let total = 0
  for (const rc of EXTENDED_SUPPLIER_CATALOG) {
    byRegion[rc.region] = rc.entries.length
    total += rc.entries.length
    for (const e of rc.entries) {
      for (const c of e.cats) {
        byCategory[c] = (byCategory[c] || 0) + 1
      }
    }
  }
  return { total, byRegion, byCategory }
}
