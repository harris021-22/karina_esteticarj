document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle (simple version)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#f6f4f0';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.style.display = 'none';
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for header height
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active state for navigation links
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Background Audio Logic
    const bgAudio = document.getElementById('bg-audio');
    const audioControl = document.getElementById('audio-control');
    const volumeSlider = document.getElementById('volume-slider');
    const audioWrapper = document.querySelector('.audio-wrapper');
    let audioStarted = false;
    
    // Set initial volume to 25%
    if (bgAudio) {
        bgAudio.volume = 0.25;
        if (volumeSlider) {
            volumeSlider.value = 0.25;
        }
    }

    // Handle Volume Slider
    if (volumeSlider && bgAudio) {
        // Prevent click events on slider from bubbling up to document and triggering startAudio immediately if we want to separate logic,
        // but startAudio has a check below.
        volumeSlider.addEventListener('click', (e) => e.stopPropagation());
        volumeSlider.addEventListener('touchstart', (e) => e.stopPropagation());

        volumeSlider.addEventListener('input', (e) => {
            bgAudio.volume = e.target.value;
            // Update icon based on volume if audio is playing
            if (audioStarted && !bgAudio.paused) {
                if (bgAudio.volume == 0) {
                    audioControl.innerHTML = '<i class="ph ph-speaker-slash"></i>';
                } else if (bgAudio.volume < 0.5) {
                    audioControl.innerHTML = '<i class="ph ph-speaker-low"></i>';
                } else {
                    audioControl.innerHTML = '<i class="ph ph-speaker-high"></i>';
                }
            }
        });
    }

    // Play on first interaction
    const startAudio = () => {
        if (!audioStarted && bgAudio) {
            bgAudio.play().then(() => {
                audioStarted = true;
                if(audioControl) {
                    audioControl.classList.add('playing');
                    if (bgAudio.volume < 0.5 && bgAudio.volume > 0) {
                        audioControl.innerHTML = '<i class="ph ph-speaker-low"></i>';
                    } else if (bgAudio.volume == 0) {
                        audioControl.innerHTML = '<i class="ph ph-speaker-slash"></i>';
                    } else {
                        audioControl.innerHTML = '<i class="ph ph-speaker-high"></i>';
                    }
                }
            }).catch(err => {
                console.log("Audio play blocked by browser:", err);
            });
            
            // Remove listeners after first interaction
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
            document.removeEventListener('scroll', startAudio);
        }
    };

    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);

    // Toggle audio button
    if (audioControl && bgAudio) {
        audioControl.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent triggering startAudio again if not started
            
            // Toggle slider visibility
            if (audioWrapper) {
                audioWrapper.classList.toggle('show-slider');
            }
            
            // If the audio hasn't started or is paused, play it when interacting with the button.
            // Only toggle pause if they are not just opening the menu?
            // The user says "quando clicar no círculo não vai tirar o volume, vai abrir a aba"
            // So we don't play/pause on click. Just open the tab.
            // BUT wait, we must start it if it never started.
            if (!audioStarted) {
                startAudio();
            }
        });

        // Close slider when clicking outside
        document.addEventListener('click', (e) => {
            if (audioWrapper && !audioWrapper.contains(e.target)) {
                audioWrapper.classList.remove('show-slider');
            }
        });
        
        document.addEventListener('touchstart', (e) => {
            if (audioWrapper && !audioWrapper.contains(e.target)) {
                audioWrapper.classList.remove('show-slider');
            }
        });
    }
});
