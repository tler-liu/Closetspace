import json
import sys
import os
import torch
import torch.nn as nn
import torchvision.models as models
from PIL import Image
from torchvision import transforms
from torch.utils.data import DataLoader, Dataset
import numpy as np
from tqdm import tqdm
from annoy import AnnoyIndex
from sklearn.model_selection import train_test_split
from torchsummary import summary
from sentence_transformers import SentenceTransformer
import json
import csv
import requests
from io import BytesIO

class ImageDataset(Dataset):
    def __init__(self, image_paths, transform):
        self.image_paths = image_paths
        self.transform = transform
    def __len__(self):
        return len(self.image_paths)
    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        image = Image.open(img_path)
        return self.transform(image), img_path # return (image, path)

class ImageDatasetOnline(Dataset):
    def __init__(self, image_paths, transform):
        self.image_paths = image_paths
        self.transform = transform
    def __len__(self):
        return len(self.image_paths)
    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        response = requests.get(img_path)
        image = Image.open(BytesIO(response.content))
        return self.transform(image), img_path # return (image, path)

class Encoder(nn.Module):
    def __init__(self):
        super(Encoder, self).__init__()
        resnet50 = models.resnet50(pretrained=True)
        self.encoder = nn.Sequential(*(list(resnet50.children())[:-1])) # remove fc layer used for classification

        # freeze layers up to 3 to retain information learned from pretrained weights
        for name, layer in self.encoder.named_children():
            if name in['0', '1', '2', '3']:
                for param in layer.parameters():
                    param.requires_grad = False
            
    def forward(self, x):
        latent = self.encoder(x).view(x.size(0), -1)
        return latent

class Decoder(nn.Module):
    def __init__(self, latent_dim=2048):
        super(Decoder, self).__init__()
        self.decoder = nn.Sequential(
            # Fully connected layer to expand the latent vector
            nn.Linear(latent_dim, 8 * 8 * 256),  # 8x8 spatial dimension and 256 channels
            nn.ReLU(inplace=True),
            nn.BatchNorm1d(8 * 8 * 256),
            
            # Reshape to (B, 256, 8, 8) via view
            nn.Unflatten(1, (256, 8, 8)),
            
            # Upsampling layers (transpose convolutions)
            nn.ConvTranspose2d(256, 128, kernel_size=4, stride=2, padding=2),    # 8x8 -> 14x14
            nn.ReLU(inplace=True),
            
            nn.ConvTranspose2d(128, 64, kernel_size=4, stride=2, padding=1),     # 14x14 -> 28x28
            nn.ReLU(inplace=True),
            
            nn.ConvTranspose2d(64, 32, kernel_size=4, stride=2, padding=1),      # 28x28 -> 56x56
            nn.ReLU(inplace=True),
            
            nn.ConvTranspose2d(32, 16, kernel_size=4, stride=2, padding=1),      # 56x56 -> 112x112
            nn.ReLU(inplace=True),
            
            nn.ConvTranspose2d(16, 3, kernel_size=4, stride=2, padding=1),       # 112x112 -> 224x224
            nn.Sigmoid()  # Scaling the output to [0, 1] for RGB images
        )
    
    def forward(self, x):
        return self.decoder(x)

class Autoencoder(nn.Module):
    def __init__(self):
        super(Autoencoder, self).__init__()
        self.encoder = Encoder()
        self.decoder = Decoder(latent_dim=2048)

    def forward(self, x):
        latent = self.encoder(x)
        reconstructed = self.decoder(latent)
        return latent, reconstructed


def convert_to_rgb(image):
    # Convert RGBA or grayscale to RGB
    if image.mode != "RGB":
        image = image.convert("RGB")
    return image

transform = transforms.Compose([
    transforms.Lambda(convert_to_rgb),
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
batch_size=32
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

model = Autoencoder().to(device)
model.load_state_dict(torch.load("./recommender_files/resnet50_autoencoder.pth", weights_only=True))

def embed_image_dataset(dataloader, model, device, save_to_file=False, filename=""):
    latent_representations = {}
    model.to(device)
    model.eval()
    with torch.no_grad():
        for images, paths in dataloader:
            images = images.to(device) # Output: [batch_size, 3, 224, 224]
            features = model(images)[0] # Output: [batch_size, 2048]
            if features.size(0) > 1:
                features = features.squeeze()
            for path, feature in zip(paths, features.cpu()):
                latent_representations[path] = feature.numpy()
    if save_to_file:
        np.save(filename, latent_representations)

    return latent_representations


model_md = SentenceTransformer("all-MiniLM-L6-v2")

def get_recommendations(wardrobe_documents):
    # grab images from online into a modified ImageDataset
    formatted_wardrobe = {}
    for itm in wardrobe_documents:
        src = itm['secure_url']
        formatted_wardrobe[src] = itm
    
    wardrobe_paths = [val['secure_url'] for val in wardrobe_documents]
    wardrobe_dataset = ImageDatasetOnline(wardrobe_paths, transform)
    wardrobe_dataloader = DataLoader(wardrobe_dataset, batch_size=batch_size, shuffle=False)
    wardrobe_lat_rep = embed_image_dataset(wardrobe_dataloader, model, device)
    
    # create metadata latent reps for wardrobe
    wardrobe_metadata_rep = {}
    for path in wardrobe_paths:
        product = formatted_wardrobe[path]
        metadata = [product['brand'], product['name']]
        wardrobe_metadata_rep[path] = np.array(model_md.encode(metadata)).flatten()
    
    # create concat latent reps for wardrobe
    inventory_concat_embedding = np.load("./recommender_files/inventory_concat_embed_v2.npy", allow_pickle=True).item()
    wardrobe_concat_embedding = {}

    for path in wardrobe_paths:
        wardrobe_concat_embedding[path] = np.concatenate((wardrobe_lat_rep[path], wardrobe_metadata_rep[path]))
    
    inventory_img_paths = list(inventory_concat_embedding.keys())
    inventory_features = np.array(list(inventory_concat_embedding.values()))

    # OPTIONAL
    # add some random noise to inventory_features to make recommendations nondeterministic
    noise = np.random.normal(loc=0.0, scale=0.1, size=inventory_features.shape)
    inventory_features = inventory_features + noise

    # create list of wardrobe embeddings and paths
    wardrobe_paths = list(wardrobe_concat_embedding.keys())
    wardrobe_features = np.array(list(wardrobe_concat_embedding.values()))

    # grab the mean embedding
    mean_embedding = np.mean(wardrobe_features, axis=0)

    # perform annoy
    embedding_dim = 2816  # Original dimensionality
    annoy_index = AnnoyIndex(embedding_dim, metric='euclidean')

    # Add all items to Annoy index
    for i, embedding in enumerate(inventory_features):
        annoy_index.add_item(i, embedding)

    # Build the index
    n_trees = 50
    annoy_index.build(n_trees)  # Number of trees

    # Query the index
    n_neighbors = 50
    indices = annoy_index.get_nns_by_vector(mean_embedding, n_neighbors, include_distances=True)

    formatted_products_nordstrom = {}
    with open('./recommender_files/nordstrom_data.json', 'r') as f:
        formatted_products_nordstrom = json.load(f)
    
    return [formatted_products_nordstrom[os.path.basename(inventory_img_paths[idx])] for idx in indices[0]]


def main():
    input_data = sys.stdin.read()
    wardrobe_documents = json.loads(input_data)

    recommendations = get_recommendations(wardrobe_documents)

    print(json.dumps(recommendations))

    # for testing
    # fake_data = [{'name': 'Le Labo Another 13', 'brand': 'Le Labo', 'secure_url': 'https://res.cloudinary.com/dzflf1m83/image/upload/v1734665678/fhroniivvfnhe228t7hf.jpg'}]

    # recommendations = get_recommendations(fake_data)
    # print(recommendations)

if __name__ == "__main__":
    main()



