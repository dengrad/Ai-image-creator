const apiKey = "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";
const maxImages = 4;

function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}

function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: input }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to generate image");
        }

        const result = await response.json();
        
        if (!result || !result.length) {
            throw new Error("No images were returned.");
        }

        result.forEach((imageData, i) => {
            const img = document.createElement("img");
            img.src = imageData.url;  // Assuming API returns an array of image URLs
            img.alt = `Generated Image ${i + 1}`;
            img.onclick = () => downloadImage(imageData.url, i);
            document.getElementById("image-grid").appendChild(img);
        });

    } catch (error) {
        alert("Error generating image: " + error.message);
        console.error("Error:", error);
    }

    loading.style.display = "none";
    enableGenerateButton();
}

document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    if (!input) {
        alert("Please enter a prompt to generate an image.");
        return;
    }
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
