function fetchFromWeatherServiceA() {
  return { temp_f: 72, wind_mph: 5, humidity: 40, source: "ServiceA" };
}

function fetchFromWeatherServiceB() {
  return { temperature_celsius: 18, wind_kmh: 12, humidity_pct: 55, provider: "ServiceB" };
}

function renderDashboard() {
  const a = fetchFromWeatherServiceA();
  const tempA = ((a.temp_f - 32) * 5) / 9;
  const windA = a.wind_mph * 1.60934;
  console.log(`[${a.source}] ${tempA.toFixed(1)}°C, wind ${windA.toFixed(1)} km/h, humidity ${a.humidity}%`);

  const b = fetchFromWeatherServiceB();
  const tempB = b.temperature_celsius;
  const windB = b.wind_kmh;
  console.log(`[${b.provider}] ${tempB.toFixed(1)}°C, wind ${windB.toFixed(1)} km/h, humidity ${b.humidity_pct}%`);

  const avgTemp = (tempA + tempB) / 2;
  const avgWind = (windA + windB) / 2;
  console.log(`[Average] ${avgTemp.toFixed(1)}°C, wind ${avgWind.toFixed(1)} km/h`);
}

// --- run ---
renderDashboard();
