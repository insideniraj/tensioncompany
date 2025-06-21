// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('#mobileMenu a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Smooth scrolling for anchor links
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

    // Startup Teaser - Random startup display
    const startupTeaserData = [
        {
            name: "QuantumLeap Energy",
            description: "Revolutionary fusion reactor technology",
            category: "Clean Energy",
            icon: "fas fa-bolt"
        },
        {
            name: "NeuralMind AI",
            description: "Advanced artificial general intelligence",
            category: "AI Research",
            icon: "fas fa-brain"
        },
        {
            name: "CarbonFix",
            description: "Direct air capture technology",
            category: "Climate Tech",
            icon: "fas fa-leaf"
        },
        {
            name: "GeneCure Therapeutics",
            description: "CRISPR-based gene therapies",
            category: "Biotech",
            icon: "fas fa-dna"
        },
        {
            name: "AutoNova Robotics",
            description: "Autonomous manufacturing systems",
            category: "Robotics",
            icon: "fas fa-robot"
        }
    ];

    function updateStartupTeaser() {
        const container = document.getElementById('startupTeaser');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Get 3 random startups
        const shuffled = startupTeaserData.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        selected.forEach(startup => {
            const card = document.createElement('div');
            card.className = 'bg-gray-900/50 border border-gray-800 rounded-xl p-6 card-hover-effect';
            card.innerHTML = `
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mr-4">
                        <i class="${startup.icon} text-white"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-white">${startup.name}</h3>
                        <p class="text-sm text-gray-400">${startup.category}</p>
                    </div>
                </div>
                <p class="text-gray-300 text-sm">${startup.description}</p>
            `;
            container.appendChild(card);
        });
    }

    // Impact Calculator functionality
    function updateImpactCalculator() {
        const amount = parseInt(document.getElementById('investmentAmountInput')?.value) || 1000000;
        const horizon = parseInt(document.getElementById('investmentHorizonInput')?.value) || 5;

        // Calculate projected metrics
        const startupsFunded = Math.floor(amount / 200000);
        const jobsCreated = Math.floor(startupsFunded * 25);
        const potentialReturn = Math.floor(amount * 8.5);
        const impactScore = amount > 5000000 ? 'Very High' : amount > 1000000 ? 'High' : 'Medium';

        // Update display
        const projectedStartups = document.getElementById('projectedStartups');
        const projectedJobs = document.getElementById('projectedJobs');
        const projectedReturn = document.getElementById('projectedReturn');
        const projectedImpact = document.getElementById('projectedImpact');

        if (projectedStartups) projectedStartups.textContent = `${startupsFunded}-${startupsFunded + 3}`;
        if (projectedJobs) projectedJobs.textContent = `${jobsCreated}-${jobsCreated + 80}`;
        if (projectedReturn) projectedReturn.textContent = `$${(potentialReturn / 1000000).toFixed(1)}M-$${((potentialReturn * 1.5) / 1000000).toFixed(1)}M`;
        if (projectedImpact) projectedImpact.textContent = impactScore;
    }

    // Counter animation
    function animateCounters() {
        const counters = [
            { element: 'startupsFunded', target: 47, suffix: '' },
            { element: 'jobsCreated', target: 1250, suffix: '' },
            { element: 'exitsCompleted', target: 12, suffix: '' }
        ];

        counters.forEach(counter => {
            const element = document.getElementById(counter.element);
            if (!element) return;

            let current = 0;
            const increment = counter.target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= counter.target) {
                    current = counter.target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + counter.suffix;
            }, 20);
        });
    }

    // Initialize startup teaser
    updateStartupTeaser();

    // Set up impact calculator listeners
    const amountSlider = document.getElementById('investmentAmount');
    const amountInput = document.getElementById('investmentAmountInput');
    const horizonSlider = document.getElementById('investmentHorizon');
    const horizonInput = document.getElementById('investmentHorizonInput');

    if (amountSlider && amountInput) {
        amountSlider.addEventListener('input', function() {
            amountInput.value = this.value;
            updateImpactCalculator();
        });
        amountInput.addEventListener('input', function() {
            amountSlider.value = this.value;
            updateImpactCalculator();
        });
    }

    if (horizonSlider && horizonInput) {
        horizonSlider.addEventListener('input', function() {
            horizonInput.value = this.value;
            updateImpactCalculator();
        });
        horizonInput.addEventListener('input', function() {
            horizonSlider.value = this.value;
            updateImpactCalculator();
        });
    }

    // Initialize impact calculator
    updateImpactCalculator();

    // Animate counters when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'startupsFunded') {
                    animateCounters();
                }
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.card-hover-effect, .timeline-item, #startupsFunded').forEach(el => {
        observer.observe(el);
    });

    // Update startup teaser every 30 seconds
    setInterval(updateStartupTeaser, 30000);

    // Counter animation
    const counters = [
        { id: 'startupsFunded', end: 75, duration: 2000 },
        { id: 'jobsCreated', end: 1500, duration: 2000 },
        { id: 'exitsCompleted', end: 12, duration: 2000 }
    ];

    const animateCounter = (element, end, duration) => {
        let start = 0;
        const range = end - start;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const currentValue = Math.floor(start + range * percentage);
            element.innerText = currentValue.toLocaleString();
            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                element.innerText = end.toLocaleString();
            }
        }
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = counters.find(c => c.id === entry.target.id);
                if (counter && !entry.target.hasAttribute('data-animated')) {
                    animateCounter(entry.target, counter.end, counter.duration);
                    entry.target.setAttribute('data-animated', 'true');
                }
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        const el = document.getElementById(counter.id);
        if (el) {
            observer.observe(el);
        }
    });

    // Investment Impact Calculator
    const investmentAmount = document.getElementById('investmentAmount');
    const investmentAmountInput = document.getElementById('investmentAmountInput');
    const investmentHorizon = document.getElementById('investmentHorizon');
    const investmentHorizonInput = document.getElementById('investmentHorizonInput');

    const projectedStartups = document.getElementById('projectedStartups');
    const projectedJobs = document.getElementById('projectedJobs');
    const projectedReturn = document.getElementById('projectedReturn');

    function updateProjections() {
        const amount = parseFloat(investmentAmountInput.value);
        const years = parseInt(investmentHorizonInput.value);

        if (!isNaN(amount) && !isNaN(years)) {
            const startupsMin = Math.max(1, Math.round(amount / 200000));
            const startupsMax = Math.max(2, Math.round(amount / 125000));
            projectedStartups.textContent = `${startupsMin}-${startupsMax}`;
            
            const jobsMin = startupsMin * 20;
            const jobsMax = startupsMax * 30;
            projectedJobs.textContent = `${jobsMin}-${jobsMax}`;

            const returnMin = amount * (3 + years);
            const returnMax = amount * (5 + years * 1.5);
            projectedReturn.textContent = `$${(returnMin/1000000).toFixed(1)}M-$${(returnMax/1000000).toFixed(1)}M`;
        }
    }

    if(investmentAmount && investmentAmountInput && investmentHorizon && investmentHorizonInput) {
        investmentAmount.addEventListener('input', (e) => {
            investmentAmountInput.value = e.target.value;
            updateProjections();
        });
        investmentAmountInput.addEventListener('input', (e) => {
            investmentAmount.value = e.target.value;
            updateProjections();
        });
        investmentHorizon.addEventListener('input', (e) => {
            investmentHorizonInput.value = e.target.value;
            updateProjections();
        });
        investmentHorizonInput.addEventListener('input', (e) => {
            investmentHorizon.value = e.target.value;
            updateProjections();
        });
        updateProjections();
    }

    // Startup Teaser
    const startupTeaser = document.getElementById('startupTeaser');
    if(startupTeaser) {
        const startups = [
            { name: "QuantumLeap AI", field: "Generative AI", description: "Developing next-gen AI models that can reason and create like humans." },
            { name: "HelioDrive", field: "Sustainable Energy", description: "Building compact fusion reactors to power the future of clean energy." },
            { name: "BioSynth", field: "Healthcare Tech", description: "Engineering synthetic proteins to cure previously untreatable diseases." },
            { name: "ConnectSphere", field: "Decentralized Networks", description: "Creating a truly decentralized, user-owned internet infrastructure." },
            { name: "CarbonCapture Collective", field: "Climate Tech", description: "Deploying scalable, efficient direct air capture technology to reverse climate change." },
            { name: "NeuroBridge", field: "Biotechnology", description: "Developing brain-computer interfaces to restore motor function and enhance human capability." },
        ];
        const randomStartup = startups[Math.floor(Math.random() * startups.length)];
        startupTeaser.innerHTML = `
            <div class="col-span-1 md:col-span-3 text-center bg-gray-900/50 border border-gray-800 rounded-xl p-8 card-hover-effect">
                <h3 class="text-2xl font-bold text-white mb-2">${randomStartup.name}</h3>
                <div class="inline-block bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm mb-4">${randomStartup.field}</div>
                <p class="text-gray-400 max-w-2xl mx-auto">${randomStartup.description}</p>
            </div>
        `;
    }

    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 120,
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');

        question.addEventListener('click', () => {
            const isOpened = answer.style.maxHeight && answer.style.maxHeight !== '0px';

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    otherIcon.classList.remove('fa-minus');
                    otherIcon.classList.add('fa-plus');
                }
            });

            // Toggle current item
            if (isOpened) {
                answer.style.maxHeight = '0px';
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });

    // Cookie Consent Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        // Check if user has already accepted cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.classList.remove('hidden');
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }
}); 