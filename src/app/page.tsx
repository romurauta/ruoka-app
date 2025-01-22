import FoodBox from "./food-box/page";


export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-extrabold text-secondary mb-6 mt-1 drop-shadow-lg">
        Ruoka 🍴
      </h1>
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-lg p-6 border border-main">
        <FoodBox />
      </div>
    </div>
  );
}