let currentStep = 1;
const totalSteps = 4;

// Initialize form when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupFileUploads();
    updateProgressBar();
});

// Step navigation functions
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            document.getElementById(`step${currentStep}`).classList.add('hidden');
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.remove('hidden');
            updateProgressBar();
            updateStepIndicators();
            
            if (currentStep === 4) {
                populateReviewContent();
            }
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.add('hidden');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.remove('hidden');
        updateProgressBar();
        updateStepIndicators();
    }
}

function updateProgressBar() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function updateStepIndicators() {
    for (let i = 1; i <= totalSteps; i++) {
        const indicator = document.getElementById(`step${i}-indicator`);
        if (i < currentStep) {
            indicator.className = 'step-indicator completed';
        } else if (i === currentStep) {
            indicator.className = 'step-indicator active';
        } else {
            indicator.className = 'step-indicator pending';
        }
    }
}

// Validation functions
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('border-red-500');
            showFieldError(field, 'This field is required');
        } else {
            field.classList.remove('border-red-500');
            clearFieldError(field);
        }
    });

    // Additional validation for specific fields
    if (currentStep === 1) {
        const foundedYear = document.getElementById('foundedYear');
        if (foundedYear.value && (foundedYear.value < 1990 || foundedYear.value > 2024)) {
            isValid = false;
            foundedYear.classList.add('border-red-500');
            showFieldError(foundedYear, 'Please enter a valid year between 1990 and 2024');
        }
    }

    if (currentStep === 3) {
        const pitchDeck = document.getElementById('pitchDeck');
        const pitchVideo = document.getElementById('pitchVideo');
        
        if (!pitchDeck.files.length) {
            isValid = false;
            showFileError('pitchDeckStatus', 'Pitch deck is required');
        }
        
        if (!pitchVideo.files.length) {
            isValid = false;
            showFileError('pitchVideoStatus', 'Pitch video is required');
        }
    }

    return isValid;
}

function showFieldError(field, message) {
    let errorDiv = field.parentNode.querySelector('.field-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-400 text-sm mt-1';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showFileError(statusId, message) {
    const statusDiv = document.getElementById(statusId);
    statusDiv.className = 'mt-2 text-sm text-red-400';
    statusDiv.textContent = message;
    statusDiv.classList.remove('hidden');
}

// File upload handling
function setupFileUploads() {
    const fileInputs = ['pitchDeck', 'pitchVideo', 'financialModel', 'additionalDocs'];
    
    fileInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        const uploadArea = document.getElementById(`${inputId}Upload`);
        const statusDiv = document.getElementById(`${inputId}Status`);
        
        if (input && uploadArea) {
            // Click to upload
            uploadArea.addEventListener('click', () => input.click());
            
            // File selection
            input.addEventListener('change', (e) => handleFileSelect(e, inputId, statusDiv));
            
            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                input.files = e.dataTransfer.files;
                handleFileSelect(e, inputId, statusDiv);
            });
        }
    });
}

function handleFileSelect(event, inputId, statusDiv) {
    const file = event.target.files[0];
    if (!file) return;

    // File size validation
    const maxSizes = {
        pitchDeck: 20 * 1024 * 1024, // 20MB
        pitchVideo: 500 * 1024 * 1024, // 500MB
        financialModel: 10 * 1024 * 1024, // 10MB
        additionalDocs: 50 * 1024 * 1024 // 50MB
    };

    if (file.size > maxSizes[inputId]) {
        statusDiv.className = 'mt-2 text-sm text-red-400';
        statusDiv.textContent = `File too large. Maximum size: ${formatFileSize(maxSizes[inputId])}`;
        statusDiv.classList.remove('hidden');
        event.target.value = '';
        return;
    }

    // File type validation
    const allowedTypes = {
        pitchDeck: ['.pdf', '.ppt', '.pptx'],
        pitchVideo: ['video/'],
        financialModel: ['.xlsx', '.xls', '.csv'],
        additionalDocs: []
    };

    if (inputId === 'pitchVideo') {
        if (!file.type.startsWith('video/')) {
            statusDiv.className = 'mt-2 text-sm text-red-400';
            statusDiv.textContent = 'Please select a valid video file';
            statusDiv.classList.remove('hidden');
            event.target.value = '';
            return;
        }
    } else if (inputId === 'pitchDeck') {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.pitchDeck.includes(fileExtension)) {
            statusDiv.className = 'mt-2 text-sm text-red-400';
            statusDiv.textContent = 'Please select a PDF, PPT, or PPTX file';
            statusDiv.classList.remove('hidden');
            event.target.value = '';
            return;
        }
    } else if (inputId === 'financialModel') {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.financialModel.includes(fileExtension)) {
            statusDiv.className = 'mt-2 text-sm text-red-400';
            statusDiv.textContent = 'Please select an Excel or CSV file';
            statusDiv.classList.remove('hidden');
            event.target.value = '';
            return;
        }
    }

    // Success
    statusDiv.className = 'mt-2 text-sm text-green-400';
    statusDiv.textContent = `✓ ${file.name} (${formatFileSize(file.size)})`;
    statusDiv.classList.remove('hidden');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Review content population
function populateReviewContent() {
    const reviewContent = document.getElementById('reviewContent');
    const formData = new FormData(document.getElementById('funding-form'));
    
    const reviewData = {
        'Company Name': formData.get('companyName'),
        'Industry': getSelectedText('industry'),
        'Founded Year': formData.get('foundedYear'),
        'Funding Amount': getSelectedText('fundingAmount'),
        'Funding Stage': getSelectedText('fundingStage'),
        'Team Size': getSelectedText('teamSize'),
        'Revenue': getSelectedText('revenue'),
        'Founder Name': formData.get('founderName'),
        'Founder Title': formData.get('founderTitle'),
        'Email': formData.get('founderEmail')
    };

    let reviewHTML = '';
    Object.entries(reviewData).forEach(([label, value]) => {
        if (value) {
            reviewHTML += `
                <div class="flex justify-between py-2 border-b border-gray-700">
                    <span class="font-medium">${label}:</span>
                    <span class="text-gray-400">${value}</span>
                </div>
            `;
        }
    });

    // Add file uploads
    const files = ['pitchDeck', 'pitchVideo', 'financialModel'];
    files.forEach(fileId => {
        const fileInput = document.getElementById(fileId);
        if (fileInput.files.length > 0) {
            reviewHTML += `
                <div class="flex justify-between py-2 border-b border-gray-700">
                    <span class="font-medium">${getFileLabel(fileId)}:</span>
                    <span class="text-green-400">✓ Uploaded</span>
                </div>
            `;
        }
    });

    reviewContent.innerHTML = reviewHTML;
}

function getSelectedText(selectId) {
    const select = document.getElementById(selectId);
    return select.options[select.selectedIndex].text;
}

function getFileLabel(fileId) {
    const labels = {
        pitchDeck: 'Pitch Deck',
        pitchVideo: 'Pitch Video',
        financialModel: 'Financial Model'
    };
    return labels[fileId] || fileId;
}

// Form submission
document.getElementById('funding-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<div class="loading-spinner inline-block mr-2"></div>Submitting...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide form and show success message
        document.getElementById('funding-form').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');
        
        // Reset form
        document.getElementById('funding-form').reset();
        currentStep = 1;
        updateProgressBar();
        updateStepIndicators();
        
        // Show first step again for future use
        document.querySelectorAll('.step-content').forEach((step, index) => {
            if (index === 0) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });
        
    }, 3000);
});

// Real form submission function (replace with your backend API)
async function submitForm(formData) {
    try {
        const response = await fetch('/api/funding-application', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
}

// If it's the last step, handle form submission
if (currentStep === totalSteps) {
    const reviewForm = document.getElementById('funding-form');
    if(reviewForm) {
        // This listener should only be attached once
        if (!reviewForm.dataset.listenerAttached) {
            reviewForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // The submit button is the 'next-btn' on the final step
                const submitButton = document.getElementById('next-btn');
                const originalButtonText = submitButton.innerHTML;
                submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...`;
                submitButton.disabled = true;

                const formData = new FormData(reviewForm);
                
                // Append files manually from our file store
                for (const key in fileStore) {
                    if(fileStore[key].length > 0) {
                        fileStore[key].forEach((file, index) => {
                            formData.append(key, file, file.name);
                        });
                    }
                }

                fetch(reviewForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        showStep(currentStep + 1); // Show success step
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                alert("Submission failed: " + data["errors"].map(error => error["message"]).join(", "));
                            } else {
                                alert('Oops! There was a problem submitting your form. Please check your connection or try again.');
                            }
                            submitButton.innerHTML = originalButtonText;
                            submitButton.disabled = false;
                        });
                    }
                }).catch(error => {
                    console.error('Submission error:', error);
                    alert('Oops! A network error occurred. Please check your connection and try again.');
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                });
            });
            reviewForm.dataset.listenerAttached = 'true';
        }
    }
} 