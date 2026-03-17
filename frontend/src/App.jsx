import { AllImages } from "./images/AllImages.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { BrowserRouter, Routes, Route, useParams } from "react-router";
import { useState } from "react"
import MainLayout from "./MainLayout";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";
import { ProtectedRoute } from "./ProtectedRoute.jsx";


function App() {
    const [authToken, setAuthToken] = useState(null);
    console.log(authToken)

    return (
        <Routes>
            <Route element={<MainLayout />} >
                  <Route path={VALID_ROUTES.HOME} element={<ProtectedRoute authToken={authToken} >  <AllImages token={authToken} /> </ProtectedRoute>} />
                  <Route path={VALID_ROUTES.UPLOAD} element={<ProtectedRoute authToken={authToken} >  <UploadPage token={authToken} /> </ProtectedRoute>} />
                  <Route path={VALID_ROUTES.LOGIN} element={<LoginPage needToReg= {false} setToken={setAuthToken} />} />
                  <Route path={VALID_ROUTES.REGISTER} element={<LoginPage needToReg= {true} setToken={setAuthToken} />} />
                  <Route path={VALID_ROUTES.IMAGE} element={<ProtectedRoute authToken={authToken} >  <ImageDetails token={authToken} /> </ProtectedRoute>} />
            </ Route>
        </Routes>
    );
}

export default App;
