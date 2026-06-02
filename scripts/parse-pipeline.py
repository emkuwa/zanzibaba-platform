import json, sys

data = json.load(sys.stdin)

if "error" in data:
    print("PIPELINE ERROR:", data["error"])
    print("DETAILS:", data.get("details", ""))
    sys.exit(1)

ds = data["stages"]["discovery"]
en = data["stages"]["enrichment"]
pb = data["stages"]["profileBuilder"]
pr = data["stages"]["productBuilder"]
rv = data["stages"]["review"]
ot = data["stages"]["outreach"]

print("=== PIPELINE RESULTS ===")
print(f"Status: {data['status']}")
print(f"Duration: {data['duration']}s")
print()
print(f"1. Discovery: {ds.get('found',0)} total")
print(f"   Dar: {ds.get('darSuppliers',0)} | Zbar Ctr: {ds.get('zanzibarContractors',0)} | Zbar Pro: {ds.get('zanzibarProfessionals',0)} | Intl: {ds.get('internationalPartners',0)}")
print(f"2. Enriched: {en.get('enriched',0)}")
print(f"3. Profiles built: {pb.get('profilesBuilt',0)} | Claim-ready: {pb.get('claimReady',0)}")
print(f"4. Products extracted: {pr.get('productsExtracted',0)}")
print(f"5. Approved: {rv.get('approved',0)} | Flagged: {rv.get('inReview',0)} | Rejected: {rv.get('rejected',0)}")
print(f"6. Outreach messages: {ot.get('messagesGenerated',0)}")
print()
for stage, info in data["stages"].items():
    if info.get("errors"):
        print(f"   {stage} ERROR: {info['errors']}")
