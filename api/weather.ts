export default async function handler(req, res) {
  const { city } = req.query;
  const apikey = process.env.VITE_OPENWEATHER_API_KEY;
  const apiUrl = `https//api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric&lang=ja`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  res.status(response.status).json(data);
}
