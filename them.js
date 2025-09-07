// Loading animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Header background on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(44, 62, 80, 0.95)';
            } else {
                header.style.background = 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)';
            }
        });

        // Dynamic statistics counter
        function animateCounter(element, start, end, duration) {
            let startTime = null;
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const current = Math.floor(progress * (end - start) + start);
                element.textContent = current.toLocaleString() + (element.dataset.suffix || '');
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        // Start counter animations when stats section is visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const text = stat.textContent;
                        const number = parseInt(text.replace(/[^\d]/g, ''));
                        if (number) {
                            stat.dataset.suffix = text.includes('+') ? '+' : '';
                            animateCounter(stat, 0, number, 2000);
                        }
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            statsObserver.observe(aboutSection);
        }

        // Donation Modal Functionality
        function openDonationModal() {
            const modal = document.getElementById('donationModal');
            const donationForm = document.getElementById('donationForm');
            const successMessage = document.querySelector('.donation-success');
            
            // Reset form if it exists
            if (donationForm) {
                donationForm.reset();
                donationForm.style.display = 'block';
            }
            
            // Hide success message if it exists
            if (successMessage) {
                successMessage.style.display = 'none';
            }
            
            // Show modal with animation
            if (modal) {
                modal.style.display = 'block';
                // Trigger reflow
                modal.offsetHeight;
                modal.classList.add('show');
            }
        }

        document.querySelector('.close-modal')?.addEventListener('click', () => {
            const modal = document.getElementById('donationModal');
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('donationModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Donation amount presets
        document.querySelectorAll('.amount-preset').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.amount-preset').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                document.getElementById('amount').value = button.dataset.amount;
            });
        });

        // Form submissions
        document.getElementById('donationForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Add your donation processing logic here
            alert('Thank you for your donation! This is a demo - no actual payment will be processed.');
        });

        document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! We will get back to you soon.');
            e.target.reset();
        });

        // Story Slider Functionality
        function initStorySlider() {
            const track = document.querySelector('.story-track');
            const slides = Array.from(track.children);
            const nextButton = document.querySelector('.slider-nav.next');
            const prevButton = document.querySelector('.slider-nav.prev');
            const dotsContainer = document.querySelector('.story-dots');
            const dots = Array.from(dotsContainer.children);

            let currentSlide = 0;
            
            // Set initial slide positions
            slides.forEach((slide, index) => {
                slide.style.transform = `translateX(${100 * index}%)`;
            });

            // Update slide positions
            function updateSlides() {
                slides.forEach((slide, index) => {
                    slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
                });
                updateDots();
            }

            // Update active dot
            function updateDots() {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }

            // Next slide
            function moveToNextSlide() {
                if (currentSlide === slides.length - 1) {
                    currentSlide = 0;
                } else {
                    currentSlide++;
                }
                updateSlides();
            }

            // Previous slide
            function moveToPrevSlide() {
                if (currentSlide === 0) {
                    currentSlide = slides.length - 1;
                } else {
                    currentSlide--;
                }
                updateSlides();
            }

            // Event Listeners
            nextButton.addEventListener('click', moveToNextSlide);
            prevButton.addEventListener('click', moveToPrevSlide);

            // Dot navigation
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    updateSlides();
                });
            });

            // Auto advance slides every 5 seconds
            let slideInterval = setInterval(moveToNextSlide, 5000);

            // Pause auto-advance on hover
            track.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            track.addEventListener('mouseleave', () => {
                slideInterval = setInterval(moveToNextSlide, 5000);
            });

            // Touch events for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            track.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                clearInterval(slideInterval);
            });

            track.addEventListener('touchmove', (e) => {
                e.preventDefault();
            });

            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].clientX;
                handleSwipe();
                slideInterval = setInterval(moveToNextSlide, 5000);
            });

            function handleSwipe() {
                const swipeThreshold = 50;
                const difference = touchStartX - touchEndX;

                if (Math.abs(difference) > swipeThreshold) {
                    if (difference > 0) {
                        moveToNextSlide();
                    } else {
                        moveToPrevSlide();
                    }
                }
            }

            // Initial setup
            updateDots();
        }

        // Initialize the slider when the DOM is loaded
        document.addEventListener('DOMContentLoaded', initStorySlider);

        // Donation Form Currency Handling
document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency');
    const usdAmounts = document.querySelector('.usd-amounts');
    const rwfAmounts = document.querySelector('.rwf-amounts');
    const amountInput = document.getElementById('amount');
    
    if (currencySelect) {
        currencySelect.addEventListener('change', function() {
            if (this.value === 'USD') {
                usdAmounts.style.display = 'flex';
                rwfAmounts.style.display = 'none';
                amountInput.placeholder = 'Enter amount in USD';
            } else {
                usdAmounts.style.display = 'none';
                rwfAmounts.style.display = 'flex';
                amountInput.placeholder = 'Enter amount in RWF';
            }
            // Reset amount input and button selection
            amountInput.value = '';
            document.querySelectorAll('.amount-preset').forEach(btn => btn.classList.remove('active'));
        });
    }

    // Handle amount preset buttons
    document.querySelectorAll('.amount-preset').forEach(button => {
        button.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            const currency = this.getAttribute('data-currency');
            
            // Update input value
            amountInput.value = amount;
            
            // Update active state of buttons
            document.querySelectorAll('.amount-preset').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Format amount input based on currency
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            const currency = currencySelect.value;
            const value = this.value.replace(/[^0-9]/g, '');
            
            if (currency === 'RWF') {
                // Round to nearest whole number for RWF
                this.value = value;
            } else {
                // Allow decimals for USD
                if (value.length > 2) {
                    const wholePart = value.slice(0, -2);
                    const decimalPart = value.slice(-2);
                    this.value = wholePart + '.' + decimalPart;
                }
            }
        });
    }
});

// Sponsorship Modal Functionality
function openSponsorshipModal(type) {
    const modal = document.getElementById('donationModal');
    const form = document.getElementById('donationForm');
    const amountInput = document.getElementById('amount');
    const frequencySelect = document.getElementById('frequency');
    
    // Set default values based on sponsorship type
    switch(type) {
        case 'child':
            amountInput.value = document.querySelector('#currency').value === 'USD' ? '25' : '25000';
            frequencySelect.value = 'monthly';
            break;
        case 'family':
            amountInput.value = document.querySelector('#currency').value === 'USD' ? '100' : '100000';
            frequencySelect.value = 'monthly';
            break;
        case 'project':
            amountInput.value = '';
            frequencySelect.value = 'once';
            break;
    }
    
    modal.style.display = 'block';
}

// Handle modal close for both donation and sponsorship
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('donationModal');
    const closeButton = document.querySelector('.close-modal');
    
    if (closeButton && modal) {
        closeButton.onclick = function() {
            modal.style.display = 'none';
        }
        
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
});

// Handle sponsorship selection from sponsorship.html
document.addEventListener('DOMContentLoaded', function() {
    const sponsorType = sessionStorage.getItem('sponsorType');
    if (sponsorType && window.location.hash === '#get-involved') {
        // Clear the stored sponsor type
        sessionStorage.removeItem('sponsorType');
        
        // Open donation modal with appropriate defaults
        setTimeout(() => {
            const modal = document.getElementById('donationModal');
            const amountInput = document.getElementById('amount');
            const frequencySelect = document.getElementById('frequency');
            const currencySelect = document.getElementById('currency');
            
            if (modal) {
                // Set defaults based on sponsorship type
                switch(sponsorType) {
                    case 'child':
                        currencySelect.value = 'RWF';
                        amountInput.value = '25000';
                        frequencySelect.value = 'monthly';
                        break;
                    case 'family':
                        currencySelect.value = 'RWF';
                        amountInput.value = '100000';
                        frequencySelect.value = 'monthly';
                        break;
                    case 'project':
                        currencySelect.value = 'RWF';
                        amountInput.value = '';
                        frequencySelect.value = 'once';
                        break;
                    case 'general':
                        currencySelect.value = 'RWF';
                        amountInput.value = '';
                        frequencySelect.value = 'monthly';
                        break;
                }
                
                // Trigger currency change event to update amount buttons
                const event = new Event('change');
                currencySelect.dispatchEvent(event);
                
                // Show the modal
                modal.style.display = 'block';
            }
        }, 500); // Small delay to ensure smooth transition
    }
});

// Modal Step Management
function showStep(stepId) {
    document.querySelectorAll('.modal-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(stepId).classList.add('active');
}

function openDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        showStep('step-message'); // Always start with the message step
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function showDonationForm() {
    showStep('step-form');
}

function showMessageStep() {
    showStep('step-message');
}

function skipDonation() {
    closeModal();
}

function showSuccessStep() {
    showStep('step-success');
}

function closeModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            showStep('step-message'); // Reset to first step for next time
            if (document.getElementById('donationForm')) {
                document.getElementById('donationForm').reset();
            }
        }, 300);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('donationModal');
    const closeButton = document.querySelector('.close-modal');
    const donationForm = document.getElementById('donationForm');
    
    // Close button handler
    if (closeButton && modal) {
        closeButton.onclick = closeModal;
    }
    
    // Click outside modal handler
    if (modal) {
        modal.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        }
    }
    
    // Form submission handler
    if (donationForm) {
        donationForm.onsubmit = function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = this.querySelector('.donation-submit');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            
            // Simulate form processing
            setTimeout(() => {
                showSuccessStep();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Auto close after success
                setTimeout(() => {
                    closeModal();
                }, 3000);
            }, 1500);
        };
    }
    
    // Handle sponsorship redirects from sponsorship.html
    const sponsorType = sessionStorage.getItem('sponsorType');
    if (sponsorType && window.location.hash === '#get-involved') {
        sessionStorage.removeItem('sponsorType');
        setTimeout(() => {
            openDonationModal();
            showDonationForm(); // Skip the message step for sponsorship redirects
            
            // Set appropriate defaults based on sponsorship type
            if (donationForm) {
                const currencySelect = document.getElementById('currency');
                const amountInput = document.getElementById('amount');
                const frequencySelect = document.getElementById('frequency');
                
                if (currencySelect && amountInput && frequencySelect) {
                    currencySelect.value = 'RWF';
                    frequencySelect.value = 'monthly';
                    
                    switch(sponsorType) {
                        case 'child':
                            amountInput.value = '25000';
                            break;
                        case 'family':
                            amountInput.value = '100000';
                            break;
                        case 'project':
                            amountInput.value = '';
                            frequencySelect.value = 'once';
                            break;
                    }
                    
                    // Trigger currency change event
                    currencySelect.dispatchEvent(new Event('change'));
                }
            }
        }, 500);
    }
});

// Share Modal Functions
function openShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

function copyShareLink() {
    const url = 'https://elayonmountain.org';
    const copyButton = document.querySelector('.copy-link');
    const originalText = copyButton.innerHTML;
    
    navigator.clipboard.writeText(url).then(() => {
        copyButton.classList.add('copied');
        copyButton.innerHTML = '<i class="fas fa-check"></i><span>Link Copied!</span>';
        
        setTimeout(() => {
            copyButton.classList.remove('copied');
            copyButton.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Share functionality
function shareToSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const description = encodeURIComponent("Join us in making a difference at Elayon Mountain Foundation!");
    
    let shareUrl;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${description}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${description}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${description}%20${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('shareModal');
    if (modal && event.target === modal) {
        closeShareModal();
    }
}
