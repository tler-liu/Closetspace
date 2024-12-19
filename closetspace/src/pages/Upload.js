import Dropzone from "../components/Dropzone";

const Upload = ({ getClothingItems }) => {
    return (
        <div className="upload-page">
            <Dropzone
                className="dropzone-container"
                getClothingItems={getClothingItems}
            />
        </div>
    );
};

export default Upload;
