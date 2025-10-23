// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Check authentication
const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
    
    if (!user || !user.token) {
        window.location.href = 'login.html';
    }
};

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// File handling
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImageBtn = document.getElementById('removeImage');
const analyzeBtn = document.getElementById('analyzeBtn');

let selectedFile = null;

// Drag and drop functionality
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// Click to upload
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Handle file selection
const handleFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
    }
    
    selectedFile = file;
    displayImage(file);
};

// Display selected image
const displayImage = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        uploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
        analyzeBtn.disabled = false;
    };
    
    reader.readAsDataURL(file);
};

// Remove image
removeImageBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetUpload();
});

const resetUpload = () => {
    selectedFile = null;
    fileInput.value = '';
    previewImg.src = '';
    uploadArea.style.display = 'block';
    imagePreview.style.display = 'none';
    analyzeBtn.disabled = true;
};

// Sample images
const sampleItems = document.querySelectorAll('.sample-item');
sampleItems.forEach(item => {
    item.addEventListener('click', () => {
        const sampleType = item.dataset.sample;
        loadSampleImage(sampleType);
    });
});

const loadSampleImage = (type) => {
    // Create sample image data based on type
    const sampleImages = {
        'early-blight': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f4a261" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="60" text-anchor="middle" dy=".3em" fill="%23fff"%3EEarly Blight Sample%3C/text%3E%3C/svg%3E',
        'late-blight': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e76f51" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="60" text-anchor="middle" dy=".3em" fill="%23fff"%3ELate Blight Sample%3C/text%3E%3C/svg%3E',
        'healthy': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2327ae60" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="60" text-anchor="middle" dy=".3em" fill="%23fff"%3EHealthy Sample%3C/text%3E%3C/svg%3E'
    };
    
    previewImg.src = sampleImages[type];
    selectedFile = { name: `${type}-sample.jpg`, type: 'sample' };
    uploadArea.style.display = 'none';
    imagePreview.style.display = 'block';
    analyzeBtn.disabled = false;
};

// Analyze button
analyzeBtn.addEventListener('click', async () => {
    if (!selectedFile) return;
    
    const resultsCard = document.getElementById('resultsCard');
    const loadingState = document.getElementById('loadingState');
    const resultsDisplay = document.getElementById('resultsDisplay');
    
    // Show results card with loading
    resultsCard.style.display = 'block';
    loadingState.style.display = 'block';
    resultsDisplay.style.display = 'none';
    
    // Scroll to results
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    try {
        // Simulate API call
        const result = await analyzePlantDisease(selectedFile);
        
        // Hide loading, show results
        setTimeout(() => {
            loadingState.style.display = 'none';
            displayResults(result);
        }, 2000);
        
    } catch (error) {
        console.error('Analysis error:', error);
        alert('An error occurred during analysis. Please try again.');
        resultsCard.style.display = 'none';
    }
});

// Placeholder function for API call
async function analyzePlantDisease(file) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Determine result based on file type (for demo)
    let diagnosis, confidence, description, recommendations;
    
    if (file.name && file.name.includes('early-blight')) {
        diagnosis = 'Early Blight';
        confidence = 94.5;
        description = 'Early blight is a fungal disease caused by Alternaria solani. It typically appears as dark brown spots with concentric rings on older leaves.';
        recommendations = [
            'Remove and destroy infected leaves',
            'Apply copper-based fungicides',
            'Ensure proper plant spacing for air circulation',
            'Avoid overhead watering',
            'Rotate crops annually'
        ];
    } else if (file.name && file.name.includes('late-blight')) {
        diagnosis = 'Late Blight';
        confidence = 96.8;
        description = 'Late blight is a serious disease caused by Phytophthora infestans. It can quickly destroy entire potato crops if not managed promptly.';
        recommendations = [
            'Remove infected plants immediately',
            'Apply appropriate fungicides',
            'Improve drainage and reduce humidity',
            'Use resistant varieties',
            'Monitor weather conditions closely'
        ];
    } else {
        diagnosis = 'Healthy';
        confidence = 98.2;
        description = 'Your potato plant appears healthy with no signs of disease. The leaves show normal coloration and structure.';
        recommendations = [
            'Continue regular monitoring',
            'Maintain proper watering schedule',
            'Ensure adequate nutrition',
            'Practice good garden hygiene',
            'Monitor for early signs of stress'
        ];
    }
    
    return {
        diagnosis,
        confidence,
        description,
        recommendations,
        imageSrc: previewImg.src
    };
    
    /* 
    // Actual API call example:
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData
    });
    
    return await response.json();
    */
}

// Display results
const displayResults = (result) => {
    const resultsDisplay = document.getElementById('resultsDisplay');
    const resultImg = document.getElementById('resultImg');
    const diagnosisBadge = document.getElementById('diagnosisBadge');
    const diagnosisValue = document.getElementById('diagnosisValue');
    const confidencePercentage = document.getElementById('confidencePercentage');
    const confidenceFill = document.getElementById('confidenceFill');
    const diseaseDetails = document.getElementById('diseaseDetails');
    
    // Set result image
    resultImg.src = result.imageSrc;
    
    // Set diagnosis
    diagnosisValue.textContent = result.diagnosis;
    
    // Update badge color
    diagnosisBadge.className = 'diagnosis-badge';
    if (result.diagnosis.toLowerCase().includes('early')) {
        diagnosisBadge.classList.add('early-blight');
    } else if (result.diagnosis.toLowerCase().includes('late')) {
        diagnosisBadge.classList.add('late-blight');
    } else {
        diagnosisBadge.classList.add('healthy');
    }
    
    // Set confidence
    confidencePercentage.textContent = `${result.confidence}%`;
    confidenceFill.style.width = `${result.confidence}%`;
    
    // Set disease details
    let detailsHTML = `
        <h4>About ${result.diagnosis}</h4>
        <p>${result.description}</p>
    `;
    
    if (result.recommendations && result.recommendations.length > 0) {
        detailsHTML += `
            <div class="recommendation">
                <strong>Recommended Actions:</strong>
            </div>
            <ul>
                ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `;
    }
    
    diseaseDetails.innerHTML = detailsHTML;
    
    // Show results
    resultsDisplay.style.display = 'block';
};

// New scan buttons
const newScanBtn = document.getElementById('newScanBtn');
const anotherScanBtn = document.getElementById('anotherScanBtn');

[newScanBtn, anotherScanBtn].forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            document.getElementById('resultsCard').style.display = 'none';
            resetUpload();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Download report
const downloadBtn = document.getElementById('downloadBtn');
downloadBtn.addEventListener('click', () => {
    alert('Download functionality will be implemented with backend integration');
    // In actual implementation, this would generate and download a PDF report
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});