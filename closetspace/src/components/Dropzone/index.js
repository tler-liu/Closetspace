import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import UploadCard from "../UploadCard";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firestore";
import Button from "../Button";

const Dropzone = ({ className, getClothingItems }) => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length) {
            setFiles((previousFiles) => [
                ...previousFiles,
                ...acceptedFiles.map((file) =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                ),
            ]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/*": [],
        },
        onDrop,
    });

    useEffect(() => {
        // Revoke the data uris to avoid memory leaks
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    const removeFile = (name) => {
        setFiles((files) => files.filter((file) => file.name !== name));
    };

    const removeAll = () => {
        setFiles([]);
    };

    const updateFileMetadata = (fileName, newData) => {
        setFiles((prevFiles) => {
            const updateFiles = prevFiles.map((file) =>
                file.name === fileName ? Object.assign(file, newData) : file
            );
            console.log(updateFiles);
            return updateFiles;
        });
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "closetspace");
        const URL = process.env.REACT_APP_CLOUDINARY_URL;
        try {
            const data = await fetch(URL, {
                method: "POST",
                body: formData,
            }).then((res) => res.json());

            const { secure_url, public_id } = data;
            const docRef = await addDoc(collection(db, process.env.REACT_APP_COLLECTION_NAME), {
                name: file.display_name || "",
                secure_url: secure_url,
                public_id: public_id,
                brand: file.brand || "",
            });

            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!files?.length) return;

        const uploadPromises = files.map((file) => uploadFile(file));
        const results = await Promise.all(uploadPromises);

        getClothingItems();
        removeAll();
    };

    return (
        <div className="dropzone-page-wrapper">
            <div
                {...getRootProps({
                    className: className,
                })}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4">
                    {isDragActive ? (
                        <p>Drop the photos here ...</p>
                    ) : (
                        <p>
                            Drag & drop photos here, or click to select photos
                        </p>
                    )}
                </div>
            </div>
            <h3>Added Items</h3>
            <div className="accepted-container">
                {files.map((file) => {
                    return (
                        <UploadCard
                            key={file.name}
                            file={file}
                            removeFn={removeFile}
                            updateFileMetadata={updateFileMetadata}
                        />
                    );
                })}
            </div>
            <Button
                label={`Upload ${files.length} item${
                    files.length == 1 ? "" : "s"
                }`}
                size="medium"
                variant="create"
                onClickFn={handleSubmit}
            />
        </div>
    );
};

export default Dropzone;
