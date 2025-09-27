import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

export async function scrapeTrashSchedule(address) {
  
  const browser = await puppeteer.launch({
    headless: "true",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });
  const page = await browser.newPage();

  let scheduleJson = null;
  await page.setRequestInterception(true);

  page.on("request", (req) => req.continue());
  page.on("response", async (resp) => {
    const url = resp.url();
    if (url.includes("Address%20Trash%20Services")) {
      try {
        const text = await resp.text();
        const obj = JSON.parse(text);
        if (obj.Features) {
          scheduleJson = obj;
        }
      } catch {
        // ignore parse errors
      }
    }
  });

  // Load page
  await page.goto(
    "https://www.okc.gov/Services/Water-Trash-Recycling/Trash-Services/My-Trash-Day",
    { waitUntil: "domcontentloaded", timeout: 60000 }
  );

  // Let scripts initialize
  await new Promise((r) => setTimeout(r, 5000));

  // Debug snippet
  const html = await page.content();
//   console.log("🔎 Page HTML snippet:\n", html.slice(0, 500));

  // Input address
  try {
    await page.waitForSelector("#MapAddressInput", { timeout: 10000 });
    // console.log("✅ Found #MapAddressInput in main frame");
    await page.type("#MapAddressInput", address);
    await page.click("img#MapAddressButton");
  } catch {
    // console.log("⚠️ #MapAddressInput not in main frame, checking iframes…");
    const frames = page.frames();
    let handled = false;

    for (const f of frames) {
      try {
        await f.waitForSelector("#MapAddressInput", { timeout: 5000 });
        // console.log("✅ Found #MapAddressInput inside iframe:", f.url());

        await f.type("#MapAddressInput", address);
        await new Promise((r) => setTimeout(r, 500));
        await f.click("img#MapAddressButton");

        handled = true;
        break;
      } catch {
        // not this frame
      }
    }

    if (!handled) {
      throw new Error("Could not find #MapAddressInput in any frame");
    }
  }

  // Wait for requests to fire
  await new Promise((r) => setTimeout(r, 5000));

  await browser.close();

  if (!scheduleJson) {
    throw new Error("Could not capture schedule data for this address");
  }

  // ✅ Address matching logic
  const addrNorm = address.trim().toUpperCase();
  let match = scheduleJson.Features.find((f) => {
    const title = (f.InfoTitle || "").toUpperCase();
    const attr0 = (f.Attributes?.[0] || "").toUpperCase();
    return title.includes(addrNorm) || attr0.includes(addrNorm);
  });

  if (!match) {
    // console.log("⚠️ No exact address match, falling back to first feature");
    match = scheduleJson.Features[0];
  }

  if (!match) throw new Error("No Features found in schedule data");

  const attrs = match.Attributes || [];
  return {
    address: attrs[0] || match.InfoTitle,
    trashDay: attrs[2] || null,
    nextRecycle: [attrs[3], attrs[4], attrs[5]].filter(Boolean),
    nextBulky: [attrs[6], attrs[7], attrs[8]].filter(Boolean),
  };
}


// API endpoint
router.get("/", async (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(400).json({ error: "Missing address query param" });
  }

  try {
    const result = await scrapeTrashSchedule(address);
    res.json(result);
  } catch (err) {
    // console.error("Pickup API error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;