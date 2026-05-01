const themeSelect = document.getElementById("theme");
const darkToggle = document.getElementById("darkToggle");
const imageArea = document.getElementById("imageArea");
const imageStatus = document.getElementById("imageStatus");
const generateBtn = document.getElementById("generateBtn");
const apiKeyInput = document.getElementById("apikey");

const previewBox = document.getElementById("profilePreview");
const previewImage = document.getElementById("previewImage");
const profileSection = document.getElementById("profileSection");

const creditText = document.getElementById("creditText");
const creditSection = document.getElementById("creditSection");

const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const editorControls = document.getElementById("editorControls");
const resizeHandle = document.getElementById("resizeHandle");
const historyGallery = document.getElementById("historyGallery");

const filters = document.querySelectorAll('.filter-group input');
const brightSlider = document.getElementById('bright');
const contrastSlider = document.getElementById('contrast');
const sepiaSlider = document.getElementById('sepia');
const pImage = document.getElementById('previewImage');

let scale = 1;
const MIN_SCALE = 1;
const MAX_SCALE = 3;

let isDragging = false;
let startX, startY;
let currentX = 0;
let currentY = 0;

let velocityX = 0;
let velocityY = 0;
let lastTime = 0;

let lastTouchDist = null;
// ===== CREDIT SYSTEM =====

let credits = parseInt(localStorage.getItem("pfp_credits")) || 5;

function updateCreditsUI() {
    //Sync the text
    creditText.textContent = `${credits} free generations remaining`;
    localStorage.setItem("pfp_credits", credits);

    //control the generate button
    if (credits > 0) {
        generateBtn.disabled = false;
        generateBtn.style.opacity = "1";
        generateBtn.style.cursor = "pointer";

        //remove paybtn if existing 
        const existingPay = document.getElementById("payBtn");
        if (existingPay) existingPay.remove();
    } else {
        generateBtn.disabled = true;
        generateBtn.style.opacity = "0.5";
        generateBtn.style.cursor = "not-allowed";

        //show paybtn if its missing
        if (!document.getElementById("payBtn")) {
            showPayButton();
        }
    }
}

function showPayButton() {
    const payBtn = document.createElement("button");
    payBtn.id = "payBtn";
    payBtn.textContent = "pay dolla dolla?";

    payBtn.onclick = () => {
        payBtn.textContent = "processing...";
        payBtn.disabled = true;

        setTimeout(() => {
            payBtn.textContent = "thank u";

            //confetti
            if (typeof confetti === 'function') {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
            //Wait enough time to see the thank u then disappear
            setTimeout(() => {
                credits = 5;
                updateCreditsUI();
                //force remove payBtn
                if (payBtn) payBtn.remove();
            }, 1000);

        }, 800);
    };

    creditSection.appendChild(payBtn);
}

updateCreditsUI();


// ===== THEME GRADIENT MORPH =====

const layerA = document.getElementById("gradientA");
const layerB = document.getElementById("gradientB");

let activeLayer = "A";

function morphGradient(c1, c2) {
    const target =
        activeLayer === "A" ? layerB : layerA;
    const visible =
        activeLayer === "A" ? layerA : layerB;

    target.style.background =
        `linear-gradient(135deg, ${c1}, ${c2})`;

    if (c1 === "#1e1e1e") {
        generateBtn.style.background = "#676eea";
        generateBtn.style.color = "white";
    } else {
        //Light mode
        generateBtn.style.background = c1;
    }

    generateBtn.style.transition = "background 0.8s ease";

    target.style.opacity = 1;
    visible.style.opacity = 0;
    activeLayer =
        activeLayer === "A" ? "B" : "A";
}

themeSelect.addEventListener("change", () => {
    const isDark = document.body.classList.contains("dark");
    const theme = themeSelect.value;

    if (isDark) {
        console.log("Theme changed in background, but keeping Dark Mode visible");
        return;
    }
    if (theme === "meowl")
        morphGradient("#ff9a9e", "#fad0c4");
    if (theme === "trash")
        morphGradient("#a8edea", "#fed6e3");
    if (theme === "fish")
        morphGradient("#89f7fe", "#66a6ff");
});




// ===== DARK MODE =====

darkToggle.onclick = () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        darkToggle.textContent = "Light Mode";
        morphGradient("#1e1e1e", "#2c2c2c");
    } else {
        darkToggle.textContent = "Dark Mode";
        if (themeSelect.value === "") {
            morphGradient("#67eea", "#764ba2");
        } else {
            themeSelect.dispatchEvent(new Event("change"));
        }
    }
};


// ===== IMAGE GENERATION =====

generateBtn.onclick = async () => {
    const themeValue = document.getElementById("theme").value;
    const promptValue = document.getElementById("prompt").value.trim();
    const apiKey = document.getElementById("apikey").value.trim();

    //fixes alerts
    if (!themeValue) {
        alert("Please select a theme before generating!");
        return;
    }

    if (!promptValue) {
        alert("Please enter a prompt before generating!");
        return;
    }

    if (credits <= 0) return;

    //Start Loading UI
    imageArea.innerHTML = "<div class='spinner'></div>";
    imageStatus.textContent = "Generating...";
    profileSection.style.display = "block";
    editorControls.style.display = "flex";
    previewBox.classList.add("scanning");

    let finalImageUrl = "";

    // -------- THE AI LOGIC --------
    if (apiKey) {
        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({ prompt: promptValue, n: 1, size: "1024x1024" })
            });
            const data = await response.json();

            if (data.error) {
                alert("AI Error: " + data.error.message);
                // Fallback to a FIXED placeholder if AI fails
                finalImageUrl = `https://robohash.org/${Math.random()}?set=set1`;
            } else {
                finalImageUrl = data.data[0].url;
            }
        } catch (e) {
            finalImageUrl = `https://picsum.photos/400?random=${Math.random()}`;
        }
    } else {
        //PLACEHOLDER LOGIC (Fixed Seed)
        const seed = Math.floor(Math.random() * 10000);
        if (theme === "fish") {
            finalImageUrl = `https://loremflickr.com/400/400/fish?lock=${seed}`;
        } else {
            let roboSet = (themeValue === "meowl") ? "set4" : (themeValue === "trash" ? "set2" : "set1");
            finalImageUrl = `https://robohash.org/${seed}?set=${roboSet}`;
        }
    }

    //the renderer
    if (finalImageUrl) {
        // Update Status
        imageStatus.textContent = apiKey ? "AI Generation Complete!" : "Placeholder Ready";

        // Pre-load the image so we don't swap until it's ready
        const tempImg = new Image();
        tempImg.crossOrigin = "anonymous";

        tempImg.onload = () => {
            // Clear spinner
            imageArea.innerHTML = "";

            // Set Main Image
            const mainImg = document.createElement("img");
            mainImg.src = finalImageUrl;
            mainImg.style.width = "100%";
            mainImg.style.borderRadius = "12px";
            imageArea.appendChild(mainImg);

            const pImg = document.getElementById("previewImage");
            if (pImg) {
                pImg.src = finalImageUrl;
                pImg.style.opacity = "1";
                pImg.style.filter = "none";
            }
            // Stop Scanning
            previewBox.classList.remove("scanning");

            // Add to History (Using the SAME URL)
            document.getElementById("historySection").style.display = "block";
            const historyImg = document.createElement("img");
            historyImg.src = finalImageUrl;
            historyImg.title = `Prompt: ${promptValue}`;
            historyImg.onclick = () => {
                if (pImg) pImg.src = finalImageUrl;
                imageArea.innerHTML = "";
                imageArea.appendChild(mainImg.cloneNode());
            };
            historyGallery.prepend(historyImg);

            //reset filter sliders
            if (document.getElementById('bright')) document.getElementById('bright').value = 100;
            if (document.getElementById('contrast')) document.getElementById('contrast').value = 100;
            if (document.getElementById('sepia')) document.getElementById('sepia').value = 0;
        };

        tempImg.src = finalImageUrl;
    };

    credits--;
    updateCreditsUI();
}

previewBox.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;

    previewBox.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;

    const maxOffset = (previewBox.offsetWidth * scale - previewBox.offsetWidth) / 2;
    currentX = Math.min(maxOffset, Math.max(-maxOffset, currentX));
    currentY = Math.min(maxOffset, Math.max(-maxOffset, currentY));

    previewImage.style.transform =
        `translate(${currentX}px, ${currentY}px) scale(${scale})`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    previewBox.style.cursor = "grab";
});
previewBox.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = previewBox.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const zoomFactor = 0.0015;
    const oldScale = scale;
    scale -= e.deltaY * zoomFactor;
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
    //Adjust position so zoom centers on cursor
    currentX -= (mouseX - rect.width / 2) * (scale - oldScale) / oldScale;
    currentY -= (mouseY - rect.height / 2) * (scale - oldScale) / oldScale;

    previewImage.style.transform =
        `translate(${currentX}px, ${currentY}px) scale(${scale})`;
});
zoomInBtn.onclick = () => {
    scale += 0.1;
    if (scale > MAX_SCALE) scale = MAX_SCALE;
    previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
};
zoomOutBtn.onclick = () => {
    scale -= 0.1;
    if (scale < MIN_SCALE) scale = MIN_SCALE;
    previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
};

// --- DOWNLOAD LOGIC ---
const downloadBtn = document.getElementById("downloadBtn");
if (downloadBtn) {
    downloadBtn.onclick = () => {
        const img = document.getElementById("previewImage");

        if (!img || img.src.includes("dicebear")) {
            alert("Please generate an image first!");
            return;
        }

        try {
            // 1. Setup Canvas
            const canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext("2d");

            // 2. Apply Filters & Draw
            ctx.filter = getComputedStyle(img).filter;
            ctx.drawImage(img, 0, 0, 1024, 1024);

            // 3. Attempt Download
            const link = document.createElement("a");
            link.download = "my-ai-art.png";
            link.href = canvas.toDataURL("image/png"); // This is what CORS blocks!
            link.click();

        } catch (err) {
            console.warn("Canvas was tainted by a placeholder image. Using fallback download.", err);

            // FALLBACK: Open the raw image in a new tab so the user can Right-Click -> Save
            window.open(img.src, '_blank');
        }
    };
}


let resizing = false;

if (resizeHandle) {
    resizeHandle.addEventListener("mousedown", (e) => {
        e.stopPropagation(); //prevent drag from triggering
        resizing = true;
    });
}


document.addEventListener("mousemove", (e) => {
    if (!resizing) return;
    const newSize = Math.max(150, Math.min(350, previewBox.offsetWidth + e.movementX));
    previewBox.style.width = newSize + "px";
    previewBox.style.height = newSize + "px";
});
document.addEventListener("mouseup", () => {
    resizing = false;
});

function animateMomentum() {
    requestAnimationFrame(animateMomentum);
    if (!isDragging) {
        velocityX *= 0.92;
        velocityY *= 0.92;
        currentX += velocityX;
        currentY += velocityY;

        previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    }
}
animateMomentum();

const promptInput = document.getElementById("prompt");
const charCounter = document.getElementById("charCounter");

if (promptInput && charCounter) {
    promptInput.addEventListener("input", () => {
        charCounter.textContent = `${promptInput.value.length} / 100`;
        charCounter.style.color = length >= 100 ? "red" : "inherit";
    });
}

setInterval(() => {
    const pInput = document.getElementById("prompt");
    const pCount = document.getElementById("charCounter");

    if (pInput && pCount) {
        //force number to update
        const len = pInput.value.length;
        pCount.textContent = len + " / 100";

        //handle color
        if (len >= 100) {
            pCount.style.color = "red";
        } else {
            pCount.style.color = "inherit";
        }
    }
}, 100); //checks 10 times every second

setInterval(() => {
    if (credits > 0 && generateBtn.disabled === true) {
        generateBtn.disabled = false;
        console.log("Emergency: Reactivating Generate Button");
    }
}, 1000);

const shuffleBtn = document.getElementById("shuffleBtn");
const pInput = document.getElementById("prompt");
const cCount = document.getElementById("charCounter");

const ideas = ["Cyberpunk Cat", "Space Fish", "Trash Robot", "Neon Owl"];

if (shuffleBtn && pInput) {
    shuffleBtn.onclick = (e) => {
        e.preventDefault();
        const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
        pInput.value = randomIdea;
        if (cCount) cCount.textContent = randomIdea.length + " / 100";
    };
}

if (pInput && cCount) {
    pInput.addEventListener("input", () => {
        cCount.textContent = pInput.value.length + " / 100";
    });
}

const enhanceBtn = document.getElementById("enhanceBtn");
if (enhanceBtn) {
    enhanceBtn.onclick = (e) => {
        e.preventDefault();
        const pInput = document.getElementById("prompt");

        if (!pInput.value.trim() === "") {
            alert("Type something first, then I'll make it cooler");
            return;
        }

        const magicStyle = ", cinematic lighting, 8k resolution, highly detailed, masterpiece, professional digital art";
        pInput.value = pInput.value + magicStyle;

        //charCounter update
        pInput.dispatchEvent(new Event('input'));
    };
}

const copyBtn = document.getElementById("copyBtn");
if (copyBtn) {
    copyBtn.onclick = async () => {
        const pImg = document.getElementById("previewImage");
        //don't copy placeholder
        if (pImg.src.includes("dicebear")) {
            alert("Generate an image first!");
            return;
        }
        try {
            const response = await fetch(pImg.src);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
            ]);
            alert("Copied to clipboard!");
        } catch (err) {
            console.error(err);
            alert("Your browser blocked the copy. Try Right-Click > Copy instead!");
        }
    };
}

function applyAllFilters() {
    const b = document.getElementById('bright').value;
    const c = document.getElementById('contrast').value;
    const s = document.getElementById('sepia').value;

    //apply them to image
    const targetImg = document.getElementById('previewImage');
    if (targetImg) {
        targetImg.style.filter = `brightness(${b} %) contrast(${c} %) sepia(${s} %)`;
    }
}
if (document.getElementById('bright')) {
    document.getElementById('bright').addEventListener('input', applyAllFilters);
    document.getElementById('contrast').addEventListener('input', applyAllFilters);
    document.getElementById('sepia').addEventListener('input', applyAllFilters);
}

console.log("Script reached the end successfully");

// --- BULLETPROOF FILTER ENGINE ---
document.addEventListener("DOMContentLoaded", () => {

    function updateAllFilters() {
        const b = document.getElementById('bright').value;
        const c = document.getElementById('contrast').value;
        const s = document.getElementById('sepia').value;

        const filterString = `brightness(${b}%) contrast(${c}%) sepia(${s}%)`;

        // 1. Check Console: Are the sliders actually talking?
        console.log("Applying filter:", filterString);

        // 2. Apply to Preview Circle
        const pImg = document.getElementById('previewImage');
        if (pImg) {
            pImg.style.filter = filterString;
        } else {
            console.error("ERROR: Cannot find previewImage ID");
        }

        // 3. Apply to Main Image
        const mainImg = document.querySelector('#imageArea img');
        if (mainImg) {
            mainImg.style.filter = filterString;
        } else {
            console.error("ERROR: Cannot find Main Image");
        }
    }

    // Attach listeners
    const bright = document.getElementById('bright');
    const contrast = document.getElementById('contrast');
    const sepia = document.getElementById('sepia');

    if (bright && contrast && sepia) {
        bright.addEventListener('input', updateAllFilters);
        contrast.addEventListener('input', updateAllFilters);
        sepia.addEventListener('input', updateAllFilters);
        console.log("Slider listeners attached successfully!");
    } else {
        console.error("ERROR: Could not find the HTML IDs for the sliders.");
    }
});

['bright', 'contrast', 'sepia'].forEach(id => {
    const slider = document.getElementById(id);
    if (slider) {
        slider.addEventListener('input', updateAllFilters);
    }
});

//attach listeners to the slides
document.getElementById('bright').addEventListener('input', updateAllFilters);
document.getElementById('contrast').addEventListener('input', updateAllFilters);
document.getElementById('sepia').addEventListener('input', updateAllFilters);

document.addEventListener('DOMContentLoaded', () => {
    const sBtn = document.getElementById("shuffleBtn");

    if (sBtn) {
        sBtn.onclick = (e) => {
            e.preventDefault(); //no reloading
            console.log("Shuffle button clicked!"); //check console

            const ideas = [
                "Cyberpunk cat",
                "Space fish",
                "Neon owl",
                "Black cat",
            ];

            const pInput = document.getElementById("prompt");
            const cCount = document.getElementById("charCouner");

            if (pInput) {
                const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
                pInput.value = randomIdea;

                //update counter manually
                if (cCount) {
                    cCount.textContent = randomIdea.length + " / 100";
                }
            }
        };
    } else {
        console.error("Could not find the button with Id 'shuffleBtn'");
    }
});
