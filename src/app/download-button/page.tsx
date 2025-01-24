"use client";

import { useState } from "react";


export default function DownloadButton() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");

  const handleShowPopup = () => {
    // const userAgent = navigator.userAgent || navigator.vendor 

      setPopupText("Tallenna ihmeessä puhelimen työpöydälle niin ei tarvitse aina aukasta linkin kautta");
   
    setShowPopup(true);
  };

  return (
    <div className="p-4">
      <div
        onClick={handleShowPopup}
        className="cursor-pointer inline-block text-blue-500 hover:text-blue-700"
      >
        ❔
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="font-bold text-lg mb-4">Ohjeet</h3>
            <p className="mb-4">{popupText}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
            >
              Sulje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
