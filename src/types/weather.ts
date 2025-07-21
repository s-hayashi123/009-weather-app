// src/types/weather.ts

// ヒント: OpenWeatherMapのAPIドキュメントや、実際に返ってくるJSONを参考に型を定義してみましょう。
// https://openweathermap.org/current#current_JSON_response

// TODO: WeatherData 型を定義する
// 最低限、以下のプロパティを含めてみましょう。
// - name: string (都市名)
// - main: { temp: number; humidity: number; }
// - weather: { icon: string; description: string; }[]
// - wind: { speed: number; }

export type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
};
