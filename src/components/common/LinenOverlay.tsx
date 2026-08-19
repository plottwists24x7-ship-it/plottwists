"use client";

import { useEffect, useState } from "react";

export default function LinenOverlay() {
  const [noiseUrl, setNoiseUrl] = useState<string>("");

  useEffect(() => {
    // Generate a 128x128px tile of organic linen noise dynamically
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Generate random grayscale noise values
        const noise = Math.floor(Math.random() * 40) + 180; // warm off-white distribution
        data[i] = noise; // R
        data[i + 1] = noise - 4; // G (slightly warm yellow tilt)
        data[i + 2] = noise - 12; // B (muted blue, sienna warmth)
        data[i + 3] = Math.floor(Math.random() * 25) + 15; // Alpha (subtle variations)
      }

      ctx.putImageData(imgData, 0, 0);

      // Add horizontal/vertical linen thread patterns
      ctx.fillStyle = "rgba(34, 34, 33, 0.02)";
      for (let x = 0; x < canvas.width; x += 4) {
        if (Math.random() > 0.4) {
          ctx.fillRect(x, 0, 1 + Math.random(), canvas.height);
        }
      }
      for (let y = 0; y < canvas.height; y += 4) {
        if (Math.random() > 0.4) {
          ctx.fillRect(0, y, canvas.width, 1 + Math.random());
        }
      }

      setNoiseUrl(canvas.toDataURL("image/png"));
    }
  }, []);

  if (!noiseUrl) return null;

  return (
    <div
      className="linen-grain-overlay"
      style={
        {
          "--noise-url": `url(${noiseUrl})`,
        } as React.CSSProperties
      }
    />
  );
}
