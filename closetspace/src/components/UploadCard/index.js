import Button from "../Button";
import Input from "../Input";

const UploadCard = ({ file, removeFn, updateFileMetadata }) => {
    return (
        <div className="upload-card-wrapper">
            <div className="image-box">
                <img src={file.preview} />
                {/* <button
                    className="remove-btn"
                    onClick={() => {
                        removeFn(file.name);
                    }}
                >
                    Remove
                </button> */}
            </div>

            <div className="fields-container">
                <div>
                    <label className="input-label">Name</label>
                    <input
                        className="text-input"
                        placeholder="Name..."
                        onInput={(e) => {
                            let newMetadata = {
                                display_name: e.target.value,
                            };
                            updateFileMetadata(file.name, newMetadata);
                        }}
                    />
                </div>
                <div>
                    <label className="input-label">Brand</label>
                    <input
                        className="text-input"
                        placeholder="Brand..."
                        onInput={(e) => {
                            let newMetadata = {
                                brand: e.target.value,
                            };
                            updateFileMetadata(file.name, newMetadata);
                        }}
                    />
                </div>
                <Button
                    label="Remove"
                    variant="destroy"
                    size="medium"
                    onClickFn={() => {
                        removeFn(file.name);
                    }}
                    style={{ "align-self": "flex-end" }}
                />
            </div>
        </div>
    );
};

export default UploadCard;
