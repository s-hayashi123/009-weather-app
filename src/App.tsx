import { useState } from "react";
import "./App.css";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useQuery } from "@tanstack/react-query";

// ... React Queryや型定義のimport ...
import type { WeatherData } from "./types/weather";

function App() {
  const [city, setCity] = useState("tokyo");
  const [searchTerm, setSearchTerm] = useState("tokyo");

  // TODO: Step 4でここにReact Queryのロジックを実装
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  // APIを叩く非同期関数
  const fetchWeather = async (city: string): Promise<WeatherData> => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`
    );
    if (!res.ok) throw new Error("取得にエラーが発生しました");
    return await res.json();
  };

  // TODO: useQuery を使って天気データを取得する
  // - queryKey: ['weather', searchTerm] (都市名が変わったら再取得)
  // - queryFn: () => fetchWeather(searchTerm)
  // - enabled: !!searchTerm (searchTermが存在する場合のみ実行)

  const { data, isLoading, isError } = useQuery<WeatherData>({
    queryKey: ["weather", searchTerm],
    queryFn: () => fetchWeather(city),
    enabled: !!searchTerm,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Step 4で検索実行のロジックを実装
    setSearchTerm(city);
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">天気予報アプリ</h1>
      <form onSubmit={handleSearch} className="w-full max-w-sm flex gap-2 mb-8">
        <Input
          type="text"
          placeholder="都市名を入力 (例: Tokyo)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button type="submit">検索</Button>
      </form>

      {isLoading && <p>読み込み中...</p>}

      {isError && (
        <p className="text-red-500">
          エラーが発生しました。都市名を確認してください。
        </p>
      )}

      {data && (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{data.name}の天気</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-5xl font-bold">
                {Math.round(data.main.temp)}°C
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                alt={data.weather[0].description}
                className="w-20 h-20"
              />
            </div>
            <p className="text-lg capitalize mt-2">
              {data.weather[0].description}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <p>湿度：{data.main.humidity}%</p>
              <p>風速：{data.wind.speed} m/s</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
export default App;
