import { AllImages } from "./images/AllImages.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { BrowserRouter, Routes, Route, useParams} from "react-router";
import MainLayout from "./MainLayout"
import { VALID_ROUTES } from "./shared/ValidRoutes.js";

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />} >
                  <Route path={VALID_ROUTES.HOME} element={<AllImages />} />
                  <Route path={VALID_ROUTES.UPLOAD} element={<UploadPage />} />
                  <Route path={VALID_ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={VALID_ROUTES.IMAGE} element={<ImageDetails />} />
            </ Route>
        </Routes>
    );
}

export default App;
