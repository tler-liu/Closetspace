import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import UploadCard from "../UploadCard";
import Upload from "../../pages/Upload";
import { Image } from "cloudinary-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firestore";

const Dropzone = ({ className, getClothingItems }) => {
    const [files, setFiles] = useState([]);
    const [rejected, setRejected] = useState([]);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (acceptedFiles?.length) {
            setFiles((previousFiles) => [
                ...previousFiles,
                ...acceptedFiles.map((file) =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                ),
            ]);
        }

        if (rejectedFiles?.length) {
            setRejected((previousFiles) => [
                ...previousFiles,
                ...rejectedFiles,
            ]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/*": [],
        },
        // maxSize: 1024 * 1000,
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
        setRejected([]);
    };

    const updateFileMetadata = (fileName, newData) => {
        setFiles((prevFiles) => {
            const updateFiles = prevFiles.map((file) =>
                file.name === fileName ? Object.assign(file, newData) : file
            );
            console.log(updateFiles)
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

            const { secure_url } = data;
            const docRef = await addDoc(collection(db, "clothing_items"), {
                name: file.display_name || "",
                secure_url: secure_url,
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
        console.log(results);

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
            <button className="upload-btn" onClick={handleSubmit}>{`Upload ${
                files.length
            } item${files.length == 1 ? "" : "s"}`}</button>
        </div>
    );
};

export default Dropzone;
