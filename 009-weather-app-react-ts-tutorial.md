# 【React & TypeScript】天気APIで作る！天気予報アプリ開発チュートリアル (009)

## 🎯 1. はじめに (The "Why")

### このチュートリアルで作るもの

このチュートリアルでは、ReactとTypeScriptを使用し、外部の天気情報API（OpenWeatherMap）と連携して、世界の好きな都市の天気を表示する「天気予報アプリ」を開発します。

### なぜこの技術が重要なのか？

現代のWebアプリケーションは、単体で完結することは稀です。多くの場合、外部のサービスやデータベースとAPIを通じて通信し、動的な情報を取得・表示します。このプロセスを「API連携」と呼びます。

- **動的なコンテンツ:** ニュース、株価、SNSの投稿など、リアルタイムで変化する情報を扱えるようになる。
- **機能の拡張:** 決済、地図、認証など、専門的な機能を自前で開発せずともアプリに組み込める。
- **データ駆動なUI:** 取得したデータに基づいて、ユーザーに最適化された情報を表示できる。

このチュートリアルを通して、**API連携の基本的な流れ、非同期処理の状態管理（ローディング、エラー）、そしてAPIキーのような機密情報の安全な取り扱い方**という、Web開発者にとって必須のスキルを習得します。

---

## APIキーの準備

このアプリケーションは、[OpenWeatherMap](https://openweathermap.org/)という天気情報サービスを利用します。APIを利用するために、まずは**無料のAPIキー**を取得しましょう。

1.  **アカウント登録:** [OpenWeatherMapのサインアップページ](https://home.openweathermap.org/users/sign_up)にアクセスし、アカウントを作成します。
2.  **APIキーの確認:** ログイン後、[API keysタブ](https://home.openweathermap.org/api_keys)に移動すると、デフォルトのAPIキーが生成されています。このキーをコピーしてください。（キーが有効になるまで数分〜数時間かかる場合があります）

---

## 🛠️ 2. 環境構築 (公式ドキュメント準拠)

`shadcn/ui` の公式ドキュメントに基づき、Vite、Tailwind CSS、shadcn/ui を使ったモダンな開発環境を構築します。

### Step 1: Viteプロジェクトの作成

```bash
pnpm create vite@latest my-weather-app --template react-ts
cd my-weather-app
```

### Step 2: 必要なライブラリのインストール

API通信を行うための `axios` と、それを効率的に管理する `TanStack Query (React Query)` をインストールします。

```bash
pnpm install axios @tanstack/react-query
```

### Step 3: Tailwind CSSとshadcn/uiのセットアップ

公式の手順に従い、Tailwind CSS と shadcn/ui をセットアップします。

```bash
# Tailwind CSS のインストール
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui のセットアップ
pnpm install -D @types/node
pnpm dlx shadcn-ui@latest init
```

`tailwind.config.js` と `tsconfig.json` の設定、`vite.config.ts` の更新は、前のチュートリアルと同様に行ってください。

### Step 4: 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` というファイルを作成します。このファイルに、先ほど取得したAPIキーを設定します。

**重要:** このファイルは `.gitignore` に自動で含まれるため、APIキーがGitHubなどに公開されることはありません。

```
# .env.local

VITE_OPENWEATHER_API_KEY="ここにあなたのAPIキーを貼り付け"
```

Viteでは、`VITE_` というプレフィックスを付けた環境変数が、コード内で `import.meta.env.VITE_...` として参照できます。

---

## 🧠 3. 思考を促す開発ステップ

### Step 1: React Query の設定

まず、アプリケーション全体でReact Queryが使えるように、`src/main.tsx` を編集します。

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// TODO: QueryClientのインスタンスを作成する

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* TODO: AppコンポーネントをQueryClientProviderでラップする */}
    <App />
  </React.StrictMode>,
)
```

### Step 2: APIレスポンスの型定義

APIから返ってくるデータの構造に合わせて、TypeScriptの型を定義します。これにより、データの型安全性が保証されます。

`src/types/weather.ts` を作成します。

```typescript
// src/types/weather.ts

// ヒント: OpenWeatherMapのAPIドキュメントや、実際に返ってくるJSONを参考に型を定義してみましょう。
// https://openweathermap.org/current#current_JSON_response

// TODO: WeatherData 型を定義する
// 最低限、以下のプロパティを含めてみましょう。
// - name: string (都市名)
// - main: { temp: number; humidity: number; }
// - weather: { icon: string; description: string; }[]
// - wind: { speed: number; }
```

> #### 💡 実装ヒント
> APIのJSONレスポンスは複雑なことが多いです。[QuickType](https://quicktype.io/) のようなツールにJSONを貼り付けると、対応する型定義を自動で生成してくれて非常に便利です。

### Step 3: UIコンポーネントの作成

ユーザーが都市名を入力するフォームと、結果を表示するカードを作成します。

`src/App.tsx` を以下のように編集します。

```tsx
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ... React Queryや型定義のimport ...

function App() {
  const [city, setCity] = useState('');

  // TODO: Step 4でここにReact Queryのロジックを実装

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Step 4で検索実行のロジックを実装
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

      {/* TODO: Step 5でローディング、エラー、結果の表示を実装 */}
    </div>
  );
}

export default App;
```

### Step 4: データ取得ロジックの実装 (`useQuery`)

React Queryの `useQuery` フックを使って、APIから天気データを取得するロジックを実装します。

`src/App.tsx` に追記します。

```tsx
// ... Appコンポーネント内 ...
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// APIを叩く非同期関数
const fetchWeather = async (city: string) => {
  // TODO: axiosを使い、OpenWeatherMapのAPIエンドポイントにリクエストを送信する
  // URL: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`
  // 成功したら、レスポンスの `data` を返す
};

function App() {
  const [city, setCity] = useState('tokyo'); // 初期値を設定
  const [searchTerm, setSearchTerm] = useState('tokyo');

  // TODO: useQuery を使って天気データを取得する
  // - queryKey: ['weather', searchTerm] (都市名が変わったら再取得)
  // - queryFn: () => fetchWeather(searchTerm)
  // - enabled: !!searchTerm (searchTermが存在する場合のみ実行)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(city);
  };

  // ...
}
```

> #### 💡 深掘りコラム: `enabled` オプションとは？
> `useQuery` はデフォルトでコンポーネント描画時に即座に実行されます。しかし、今回はフォームで都市名が入力・送信されてから実行したいです。`enabled: false` のように設定すると、クエリの自動実行を抑制できます。今回は `enabled: !!searchTerm` とすることで、「`searchTerm` に値がある場合のみクエリを有効化する」という制御を実現しています。

### Step 5: 条件付きレンダリング

`useQuery` が返す `isLoading`, `isError`, `data` の状態に応じて、UIを動的に切り替えます。

`src/App.tsx` の `return` 文の中を完成させます。

```tsx
// ... Appコンポーネントのreturn文の中 ...

{isLoading && <p>読み込み中...</p>}

{isError && <p className="text-red-500">エラーが発生しました。都市名を確認してください。</p>}

{data && (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>{data.name}の天気</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="text-5xl font-bold">{Math.round(data.main.temp)}°C</div>
        <img 
          src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt={data.weather[0].description}
          className="w-20 h-20"
        />
      </div>
      <p className="text-lg capitalize mt-2">{data.weather[0].description}</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <p>湿度: {data.main.humidity}%</p>
        <p>風速: {data.wind.speed} m/s</p>
      </div>
    </CardContent>
  </Card>
)}
```

---

## 🔥 4. 挑戦課題 (Challenges)

- **Easy:** 気温を整数で表示するように、`Math.round()` を使って丸めてみましょう。（実装済み）
- **Medium:** 5日間（3時間ごと）の天気予報API (`/forecast`) を利用して、翌日の天気予報を表示する機能を追加してみましょう。
- **Hard:** 検索した都市名を `localStorage` に保存し、次回アクセス時にもそのリストが表示されるようにしてみましょう。

---

## ✅ 5. まとめ

お疲れ様でした！このチュートリアルでは、API連携という非常に実践的なスキルを学びました。

- 外部APIの仕様を読み解き、リクエストを送信する方法
- `axios` を使った具体的なAPI通信の実装
- `React Query` による、宣言的で効率的なデータ取得と状態管理
- `.env` ファイルを使った、APIキーの安全な管理方法
- `isLoading`, `isError`, `data` に基づく、堅牢な条件付きレンダリング

これらのスキルは、あなたが今後より複雑でリッチなWebアプリケーションを開発していく上で、強力な武器となるはずです。
