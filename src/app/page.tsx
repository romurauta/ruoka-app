import FoodBox from "./food-box/page";
import DownloadButton from "./download-button/page";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground relative">
      <div className="mb-2 flex justify-center w-full max-w-2xl">
        {/* Otsikko keskellä */}
        <h1 className="text-4xl font-extrabold text-secondary mb-2 mt-1 drop-shadow-lg">
          Ruokakone 🍴
        </h1>
      </div>

      {/* DownloadButton oikeassa yläkulmassa */}
      <div className="absolute top-0 right-0 mt-1 mr-4">
        <DownloadButton />
      </div>

      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-lg p-2 border border-main">
        <FoodBox />
      </div>
    </div>
  );
}
