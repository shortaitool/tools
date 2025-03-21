const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const lockAspect = document.getElementById('lockAspect');
const controls = document.getElementById('controls');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const processedImage = document.getElementById('processedImage');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

let aspectRatioLocked = false;
let originalWidth, originalHeight;

// File Upload Handling
function handleFile(file) {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        controls.classList.remove('hidden');
        previewSection.classList.remove('hidden');
        
        originalImage.onload = () => {
            originalWidth = originalImage.naturalWidth;
            originalHeight = originalImage.naturalHeight;
            widthInput.value = originalWidth;
            heightInput.value = originalHeight;
            updateProcessedImage();
        };
    };
    reader.readAsDataURL(file);
}

// Drag & Drop Handling
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#646cff';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ccc';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ccc';
    handleFile(e.dataTransfer.files[0]);
});

// File Input Handling
fileInput.addEventListener('change', () => {
    handleFile(fileInput.files[0]);
});

// Aspect Ratio Lock
lockAspect.addEventListener('click', () => {
    aspectRatioLocked = !aspectRatioLocked;
    lockAspect.textContent = aspectRatioLocked ? '🔓' : '🔒';
});

// Dimension Inputs
[widthInput, heightInput].forEach(input => {
    input.addEventListener('input', () => {
        if (aspectRatioLocked) {
            if (input === widthInput) {
                heightInput.value = Math.round(widthInput.value * (originalHeight / originalWidth));
            } else {
                widthInput.value = Math.round(heightInput.value * (originalWidth / originalHeight));
            }
        }
        updateProcessedImage();
    });
});

// Image Processing
function updateProcessedImage() {
    const canvas = processedImage;
    const ctx = canvas.getContext('2d');
    
    canvas.width = widthInput.value;
    canvas.height = heightInput.value;
    
    // Apply filters
    const brightness = document.getElementById('brightness').value;
    const contrast = document.getElementById('contrast').value;
    const saturation = document.getElementById('saturation').value;
    
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    ctx.drawImage(
        originalImage,
        0, 0, originalWidth, originalHeight,
        0, 0, canvas.width, canvas.height
    );
}

// Enhancement Controls
document.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('input', updateProcessedImage);
});

// Download Handling
downloadBtn.addEventListener('click', () => {
    const format = document.getElementById('format').value;
    const quality = document.getElementById('quality').value / 100;
    
    const dataUrl = processedImage.toDataURL(`image/${format}`, quality);
    const link = document.createElement('a');
    link.download = `processed-image.${format}`;
    link.href = dataUrl;
    link.click();
});

// Reset Functionality
resetBtn.addEventListener('click', () => {
    originalImage.src = '';
    processedImage.width = 0;
    processedImage.height = 0;
    controls.classList.add('hidden');
    previewSection.classList.add('hidden');
    fileInput.value = '';
    document.querySelectorAll('input[type="range"]').forEach(input => {
        input.value = input.id === 'quality' ? 90 : 100;
    });
});
