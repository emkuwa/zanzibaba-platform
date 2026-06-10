# Supplier Data Integrity — Migration Plan

## Classification

| Label | Meaning | Criteria |
|---|---|---|
| `STRATEGIC_VERIFIED` | Real company, vetted | Has website + HIGH trust score |
| `DISCOVERED_VERIFIED` | Real company, limited data | Has website or MEDIUM/HIGH trust |
| `CLAIMED` | Owner-claimed | activationStatus = CLAIMED/VERIFIED/FEATURED |
| `TEST` | Test data | companyName contains "test" or "demo" |
| `SYNTHETIC` | Auto-generated placeholder | No website, LOW trust, no other signal |

## Phase 1: Soft-Hide (DONE)

Filters added to all public queries: `dataClassification: { notIn: ["TEST", "SYNTHETIC"] }`

- [x] Homepage supplier + country count
- [x] Supplier directory (`/suppliers`)
- [x] Search API (`/api/search`)
- [x] Featured suppliers API (`/api/featured-suppliers`)
- [x] Directory pages: partners, services, travel, developers, contractors, professionals, hospitality

## Phase 2: Archive Unused Records

Steps:
1. Run dependency audit script to verify no TEST/SYNTHETIC records have related data (products, orders, quotes, reviews, subscriptions)
2. If safe, set `deletedAt` timestamp on all TEST and SYNTHETIC records (soft delete)
3. Remove from admin acquisition queries and reports

### Dependency Audit

Run before archiving:

```sql
-- DiscoveredLead dependencies
SELECT dl.id, dl."companyName", 
  COUNT(wm.id) as whatsapp_messages,
  COUNT(fs.id) as founding_entries
FROM "DiscoveredLead" dl
LEFT JOIN "WhatsAppMessage" wm ON wm."leadId" = dl.id
LEFT JOIN "FoundingSupplier" fs ON fs."leadId" = dl.id
WHERE dl."dataClassification" IN ('TEST', 'SYNTHETIC')
GROUP BY dl.id;

-- SupplierProfile dependencies
SELECT sp.id, sp."companyName",
  COUNT(p.id) as products,
  COUNT(q.id) as quotes,
  COUNT(o.id) as orders
FROM "SupplierProfile" sp
LEFT JOIN "Product" p ON p."supplierId" = sp.id
LEFT JOIN "Quote" q ON q."supplierId" = sp.id
LEFT JOIN "Order" o ON o."supplierId" = sp.id
WHERE sp."dataClassification" IN ('TEST', 'SYNTHETIC')
GROUP BY sp.id;
```

## Phase 3: Delete After Dependency Audit

Only after verifying zero dependencies:
1. Export any needed data for record-keeping
2. Delete TEST and SYNTHETIC records from all tables
3. Re-index search
4. Verify homepage metrics reflect accurate counts

## Audit Report (Current)

| Table | Total | Real | Hidden (TEST+SYNTHETIC) |
|---|---|---|---|
| DiscoveredLead | 532 | 343 (132 SV + 210 DV + 1 C) | 189 |
| DirectoryEntity | 64 | 64 | 0 |
| SupplierProfile | 7 | 0 | 7 |
