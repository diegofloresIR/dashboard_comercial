async function doFetch() {
    try {
        const res = await fetch("http://localhost:3000/api/crm/closers?locationId=A61Qh32aInzQ31Bf1pWj");
        const text = await res.text();
        console.log("CLOSERS TEXT RESPONSE:", text);

        // Also opportunities
        const oppRes = await fetch("http://localhost:3000/api/crm/opportunities?locationId=A61Qh32aInzQ31Bf1pWj");
        const oppOpps = await oppRes.json();
        console.log(`TOTAL OPPS: ${oppOpps.length}`);
        if (oppOpps.length > 0) {
            for (let i = 0; i < Math.min(3, oppOpps.length); i++) {
                console.log(`Opp ${i} custom fields:`, oppOpps[i].custom_fields || oppOpps[i].raw?.customFields);
            }
        }
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}
doFetch();
