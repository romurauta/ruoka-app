"use client";
import { openDB } from "idb";
import { useEffect, useState } from "react";

export default function FoodBox() {
  const [generatedFoods, setGeneratedFoods] = useState<string[]>([]);
  const [foodCount, setFoodCount] = useState<number>(3);
  const [savedFoods, setSavedFoods] = useState<string[]>([]);

  const dbName = "FoodDatabase";
  const storeName = "foods";

  const foods = [
    "Makaronilaatikko", "Katkarapupasta", "Pasta carbonara", "Lihapullapasta",
    "Jauheliha ja makaroni", "Tonnikalapasta", "Lohipasta", "Lasagne/pikalasagne",
    "Kanapasta", "Lihapullat ja perunamuusi", "Pinaattiletut ja perunamuusi",
    "Uunilohi + potut", "Mureke ja perunat", "Karjalanpaisti", "Pihvi ja peruna",
    "Kalaa pannulla ja potut", "Kana ja ranskikset", "Lohikeitto", "Savulohikeitto",
    "Lihakeitto", "Kasvissosekeitto", "Jauhelihakastike ja potut", "Naudansuikaleet ja riisi",
    "Jauheliha ja riisi", "Kana ja riisi", "Tortillat (jauheliha/kana/halloum)", 
    "Kanasalaatti", "Riisipuuro ja soppa", "Mannapuuro", "Possu ja riisi",
    "Nachopelti", "Lämpimät leivät", "Halloum pasta", "Pestopasta", "Pinaattikeitto",
    "Crispy chicken", "Ristikkoperunat ja lihapullat", "Pitsaa", "Lohkoperunat ja kanaa tai pihviä",
    "Quesedillat", "Kylmäsavulohipasta", "Kana tikkamasala ja riisi", "Kaalilaatikko",
    "Wingsit", "Hampurilaiset", "Pitat", "Uunikana ja riisi", "Pyttipannu", "Chorizo pasta",
    "Kinkkupiirakka", "Wok", "Kinkkukiusaus", "Pasta bolognese", "Tortilla pitsa",
    "Pasta salaatti", "Uunifetapasta", "Kvinoa-feta-salaatti", "Wrapit (tonnikala/kana)",
    "Kanakeitto", "Täytetyt paprikat/kesäkurpitsat", "Hodarit", "Nuudelit (keitto)",
    "Uuniperunat", "Kalapuikot, perunamuusi ja kermaviilikastike", "Fried rice",
    "Nakkikeitto", "Kaalipekonisalaatti", "Turkkilainen pasta",
  ];

  const initDB = async () => {
    return openDB(dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        }
      },
    });
  };

  // Tallenna kaikki generoidut ruoat tietokantaan
  const saveFoodsToDB = async (foodsToSave: string[]) => {
    const db = await initDB();
    const tx = db.transaction(storeName, "readwrite");
    await tx.store.clear(); // Poistaa aiemmat ruoat ennen tallennusta
    for (const food of foodsToSave) {
      await tx.store.add({ food });
    }
    await tx.done;
    fetchSavedFoods(); // Päivitä tallennetut ruoat
  };

  // Hae kaikki tallennetut ruoat
  const fetchSavedFoods = async () => {
    const db = await initDB();
    const tx = db.transaction(storeName, "readonly");
    const allFoods = await tx.store.getAll();
    setSavedFoods(allFoods.map((entry) => entry.food));
  };

  // Generoi ruoat
  const generateFoods = () => {
    const shuffledFoods = [...foods].sort(() => Math.random() - 0.5);
    setGeneratedFoods(shuffledFoods.slice(0, foodCount));
  };

  // Generoi ruoka uudelleen (vain valittu ruoka)
  const regenerateFood = (index: number) => {
    const shuffledFoods = [...foods].sort(() => Math.random() - 0.5);
    const newFood = shuffledFoods[0]; // Valitse uusi satunnainen ruoka
    setGeneratedFoods((prevFoods) => {
      const newFoods = [...prevFoods];
      newFoods[index] = newFood; // Korvataan vanha ruoka uudella
      return newFoods;
    });
  };

  // Alusta tietokanta ja hae tallennetut ruoat, kun komponentti ladataan
  useEffect(() => {
    fetchSavedFoods();
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-2xl font-bold text-main mb-4">Valitse ja generoi ruokaa!</h2>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
        {/* Numeroiden valinta */}
        <div className="mb-4">
          <label
            htmlFor="food-count"
            className="block text-lg font-medium text-foreground mb-2"
          >
            Kuinka monta ruokaa haluat?
          </label>
          <select
            id="food-count"
            value={foodCount}
            onChange={(e) => setFoodCount(Number(e.target.value))}
            className="w-full bg-accent text-foreground px-4 py-2 rounded-lg font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-main"
          >
            {[...Array(7)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Generointipainike */}
        <button
          onClick={generateFoods}
          className="w-full bg-secondary hover:bg-secondary-hover text-background font-bold py-3 px-6 rounded-lg shadow-lg transition-colors mb-4"
        >
          Generoi ruoat
        </button>

        {/* Tallennuspainike */}
        {generatedFoods.length > 0 && (
          <button
            onClick={() => saveFoodsToDB(generatedFoods)} // Tallentaa kaikki generoidut ruoat
            className="w-full bg-main hover:bg-main-light text-background font-bold py-3 px-6 rounded-lg shadow-lg transition-colors mb-4"
          >
            Tallenna ruoat
          </button>
        )}

        {/* Generoidut ruoat */}
        {generatedFoods.length > 0 && (
          <ul className="mt-6 space-y-2">
            {generatedFoods.map((food, index) => (
              <li key={index} className="text-lg font-medium text-accent">
               {food} 
                <span
                 onClick={() => regenerateFood(index)} // Generoi valitun ruoan uudelleen
                 className="ml-4 text-sm text-primary cursor-pointer"
                >
                 🔄
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Tallennetut ruoat */}
        {savedFoods.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-secondary mb-2">Tallennetut ruoat:</h3>
            <ul className="space-y-2">
              {savedFoods.map((food, index) => (
                <li key={index} className="text-md text-foreground">
                  🍴 {food}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
