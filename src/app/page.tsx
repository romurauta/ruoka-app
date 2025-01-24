import FoodBox from "./food-box/page";
import DownloadButton from "./download-button/page";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <div style={{display: "flex", marginBottom: "5px"}}>

      <h1 className="text-4xl font-extrabold text-secondary mb-2 mt-1 drop-shadow-lg mr-6">
        Ruokakone 🍴
      </h1>
      <DownloadButton />
      </div>
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-lg p-6 border border-main">
        <FoodBox />
      </div>
    </div>
  );
}
