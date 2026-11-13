async function test() {
  const start = Date.now();
  const res = await fetch("http://localhost:3005");
  const ttfb = Date.now() - start;
  const html = await res.text();
  console.log("Status:", res.status);
  console.log("TTFB:", ttfb, "ms");
  console.log("HTML size:", (html.length / 1024).toFixed(2), "KB");
  console.log("Contains <main>?:", html.includes("<main"));
  console.log("Contains PlotTwist / brand terms?:", html.includes("Plotwist") || html.includes("PLOTTWIST"));
  console.log("Contains Hero section?:", html.includes("cheesecake") || html.includes("today's batch"));
  console.log("Contains Story section?:", html.includes("ABOUT OUR BAKERY") || html.includes("PLOTTWIST24X7"));
  console.log("Contains Bakes section?:", html.includes("Bakes") || html.includes("Cheesecakes"));
  console.log("Contains Reviews section?:", html.includes("reviews") || html.includes("What people say"));
  console.log("Contains external fonts.googleapis.com?:", html.includes("fonts.googleapis.com"));
  console.log("Contains self-hosted /_next/static/media/ fonts?:", html.includes("/_next/static/media/"));

  // Check if there is any global loading gate blocking content in the HTML
  const hasGlobalLoadingScreen = html.includes("Loading PlotTwist Bakery...") && !html.includes("<main");
  console.log("Has blocking global loading gate?:", hasGlobalLoadingScreen);
}

test().catch(console.error);
