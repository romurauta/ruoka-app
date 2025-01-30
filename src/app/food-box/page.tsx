"use client";
import { openDB } from "idb";
import { useEffect, useState } from "react";
import { foods } from "./foodList";

export default function FoodBox() {
  const [generatedFoods, setGeneratedFoods] = useState<{ name: string; categories: string[]; prepTime: number; }[]>([]);
  const [foodCount, setFoodCount] = useState(3);
  const [savedFoods, setSavedFoods] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{ [key: string]: boolean | null }>({
    "🍝": null,
    "🥔": null,
    "🍚": null,
    "🥩": null,
    "🐟": null,
    "🐓": null,
  });
  const [selectedPrepTime, setSelectedPrepTime] = useState<number | "over60">(0);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [hasGeneratedFoods, setHasGeneratedFoods] = useState(false);

  const dbName = "FoodDatabase";
  const storeName = "foods";
  const categories = ["🍝", "🥔", "🍚", "🥩", "🐟", "🐓"];
  const prepTimeOptions = [15, 30, 45, 60, "over60"];

  const initDB = async () => {
    return openDB(dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        }
      },
    });
  };


  const saveFoodsToDB = async (foodsToSave: { name: string; categories: string[]; prepTime: number; }[]) => {
    const db = await initDB();
    const tx = db.transaction(storeName, "readwrite");
    await tx.store.clear(); 
    for (const food of foodsToSave) {
      await tx.store.add(food);
    }
    await tx.done;
    fetchSavedFoods(); 
  };

  const fetchSavedFoods = async () => {
    const db = await initDB();
    const tx = db.transaction(storeName, "readonly");
    const allFoods = await tx.store.getAll();
    setSavedFoods(allFoods.map((entry) => entry.name));
  };

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories((prev) => {
      const newState = { ...prev };
      newState[category] = !newState[category];  
      return newState;
    });
  };




  const generateFoods = () => {
    let filteredFoods = foods;

    filteredFoods = filteredFoods.filter((food) => {
      return Object.entries(selectedCategories).every(([category, isSelected]) => {
        if (isSelected) return food.categories.includes(category);
        return true;
      });
    });

    if (selectedPrepTime !== 0) {
      filteredFoods = filteredFoods.filter((food) =>
        selectedPrepTime === "over60" ? food.prepTime > 60 : food.prepTime === selectedPrepTime
      );
    }

    const shuffledFoods = [...filteredFoods].sort(() => Math.random() - 0.5);
    setGeneratedFoods(shuffledFoods.slice(0, foodCount));

    setHasGeneratedFoods(true); 
    setShowErrorMessage(shuffledFoods.length === 0); 
  };

  const regenerateFood = (index: number) => {
    let filteredFoods = foods;
  
    filteredFoods = filteredFoods.filter((food) => {
      return Object.entries(selectedCategories).every(([category, isSelected]) => {
        if (isSelected) return food.categories.includes(category);
        return true;
      });
    });
  
    if (selectedPrepTime !== 0) {
      filteredFoods = filteredFoods.filter((food) =>
        selectedPrepTime === "over60" ? food.prepTime > 60 : food.prepTime === selectedPrepTime
      );
    }
  
    const shuffledFoods = [...filteredFoods].sort(() => Math.random() - 0.5);
    const newFood = shuffledFoods[0];
    
    setGeneratedFoods((prevFoods) => {
      const newFoods = [...prevFoods];
      newFoods[index] = newFood;
      return newFoods;
    });
  };



  useEffect(() => {
    fetchSavedFoods();
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-3 border border-gray-200">
        {/* Numeroiden ja ajan valinta rinnakkain */}
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <label htmlFor="food-count" className="block text-lg font-medium text-foreground mb-2">
              🔢❓
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
  
          <div className="flex-1">
            <label htmlFor="prep-time" className="block text-lg font-medium text-foreground mb-2">
              ⏳
            </label>
            <select
              id="prep-time"
              value={selectedPrepTime}
              onChange={(e) => setSelectedPrepTime(e.target.value === "over60" ? "over60" : Number(e.target.value))}
              className="w-full bg-accent text-foreground px-4 py-2 rounded-lg font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-main"
            >
              <option value={0}>Kaikki ajat</option>
              {prepTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time === "over60" ? "Yli 60 min" : `${time} min`}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {/* Kategoriat ja niiden valintaruudut */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-foreground mb-2">
            Valitse kategoria(t)
          </label>
          <div className="grid grid-cols-6 gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={category}
                  checked={selectedCategories[category] ?? false}
                  onChange={() => toggleCategoryFilter(category)}
                  className="mr-2"
                />
                <label htmlFor={category}>{category}</label>
              </div>
            ))}
          </div>
        </div>
  
        {/* Painikkeet rinnakkain */}
        <div className="mb-4 flex space-x-4">
          <button
            onClick={generateFoods}
            className="w-full bg-secondary hover:bg-secondary-hover text-background font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
          >
            Luo
          </button>
  
          {generatedFoods.length > 0 && (
            <button
              onClick={() => saveFoodsToDB(generatedFoods)}
              className="w-full bg-main hover:bg-main-light text-background font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
            >
              Tallenna
            </button>
          )}
        </div>
  
        {hasGeneratedFoods && showErrorMessage && generatedFoods.length === 0 && (
          <div className="mt-6 text-lg text-red-500">
            Ei ruokia näillä valinnoilla.
          </div>
        )}

        {generatedFoods.length > 0 && (
          <ul className="mt-6 space-y-2">
            {generatedFoods.map((food, index) => (
              <li key={index} className="text-lg font-medium text-accent flex items-center">
                <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-2 py-1 rounded-md mr-2">
                  ⏳ {food.prepTime} min
                </span>
                {food.name}
                <span
                  onClick={() => regenerateFood(index)}
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
