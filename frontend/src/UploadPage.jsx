import React, { useId, useState, useEffect, useActionState } from "react"
import { Link, Navigate, useNavigate} from "react-router"
import { MainLayout } from "./MainLayout.jsx";

//fetch include: { headers: {'Authorization': `Bearer ${token}`} }
export function UploadPage({ token }) {
    const ID = useId()
    const [imagePreview, setImagePreview] = useState(null)

    function readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });
    }

    async function handleUpload(e) {
        console.log("got to handleUpload")
        const file = e.target.files[0];
        if (!file) { setImagePreview(null) }

        try {
            const imgURL = await readAsDataURL(file);
            setImagePreview(imgURL);
        } catch (err) {
            console.error("Failed to read file", err);
            setImagePreview(null);
        }
    };

    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            const image = formData.get("image");
            const name = formData.get("name");

            if (!image || !name) {
                setImagePreview(null);
                return "Missing image or file name.";
            }


            let response=null

            try {
                response = await fetch("/api/images", {
                  method: "POST",
                  headers: { 'Authorization': `Bearer ${token}` },
                  body: formData
                });

                console.log("got a response from fetch api post")
                console.log(response)

                if (!response.ok) {
                    console.log("response not ok")
                    throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
                }
                console.log("response ok")

                setImagePreview(null);

                const data = await response.json();
                const imageId = data.id;
                return <Navigate to={`/images/${imageId}`} replace />

          } catch (error) {
              setImagePreview(null);
              if (response.status == 400) {
                return("Image is invalid.")
              }
              if (response.status == 413) {
                return("Title is too long.")
              }

              return error.message;
          }

          return null
        },
        null
    );

    return (
        <div>
            <h2>Upload</h2>
            {result}

            <form action={submitAction}>
                <div>
                    <label htmlFor={ID}>Choose image to upload: </label>
                    <input
                        id={ID}
                        name="image"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        required
                        onChange={handleUpload}
                        disabled={isPending}
                    />
                </div>
                <div>
                    <label>
                        <span>Image title: </span>
                        <input name="name" required disabled={isPending}/>
                    </label>
                </div>

                <div> {/* Preview img element */}
                    <img style={{width: "20em", maxWidth: "100%"}} src={imagePreview} alt="" />
                </div>

                <input type="submit" value="Confirm upload" disabled={isPending} />
            </form>
        </div>
    );
}
