import Button from "../Button";
import Input from "../Input";

const UploadCard = ({ file, removeFn, updateFileMetadata }) => {
    return (
        <div className="upload-card-wrapper">
            <div className="image-box">
                <img src={file.preview} />
            </div>
            <div className="fields-container">
                <div>
                    <label className="input-label">Name</label>
                    <Input
                        placeholder="Name..."
                        onInputFn={(e) => {
                            let newMetadata = {
                                display_name: e.target.value,
                            };
                            updateFileMetadata(file.name, newMetadata);
                        }}
                        autoFocus={false}
                    />
                </div>
                <div>
                    <label className="input-label">Brand</label>
                    <Input
                        placeholder="Brand..."
                        onInputFn={(e) => {
                            let newMetadata = {
                                brand: e.target.value,
                            };
                            updateFileMetadata(file.name, newMetadata);
                        }}
                        autoFocus={false}
                    />
                </div>
                <Button
                    label="Remove"
                    variant="destroy"
                    size="medium"
                    onClickFn={() => {
                        removeFn(file.name);
                    }}
                    style={{ alignSelf: "flex-end", marginTop: "auto" }}
                />
            </div>
        </div>
    );
};

export default UploadCard;
