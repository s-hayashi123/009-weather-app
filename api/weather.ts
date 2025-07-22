export default async function handler(req, res) {
  const { city } = req.query;
  const apikey = process.env.OPENWEATHER_API_KEY;

  if (!apikey) {
    res.status(500).json({ error: "APIキーが設定されていません" });
    return;
  }
  if (!city) {
    res.status(400).json({ error: "cityパラメータが必要です" });
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric&lang=ja`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch {
    res.status(500).json({ error: "外部APIリクエストに失敗しました" });
  }
}
