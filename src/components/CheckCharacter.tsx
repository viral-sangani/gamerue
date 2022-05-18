import React from "react";

const CheckCharacter = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/assets/gamerue/background.png')",
        height: "100vh",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: "100vw",
      }}
    >
      <div
        style={{
          margin: "auto",
          width: "50%",
          height: "50%",
          border: "3px solid green",
          padding: "10px",
        }}
      >
        <div className="p-2 bg-white rounded-lg">Viral</div>
      </div>
    </div>
  );
};

export default CheckCharacter;
