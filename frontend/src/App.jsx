// <<<<<<< HEAD
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";
// import { SHARED_TEST } from "./shared/example.js";
// import "./App.css";
//
// function App() {
//   const [count, setCount] = useState(0);
//
//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//       <p>Shared test var: {SHARED_TEST}</p>
//     </>
//   );
// }
//
// export default App
// =======
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";

function App() {
    const POSSIBLE_PAGES = [
        <AllImages />,
        <ImageDetails imageId={"0"} />,
        <UploadPage />,
        <LoginPage />
    ];

    return POSSIBLE_PAGES[0];
}

export default App;
// >>>>>>> origin/image-gallery
