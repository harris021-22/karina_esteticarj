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
            navLinks.style.background = '#0067A6';
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
    let audioStarted = false;
    
    // Set initial volume to 25%
    if (bgAudio) {
        bgAudio.volume = 0.25;
    }

    // Play on first interaction
    const startAudio = () => {
        if (!audioStarted && bgAudio) {
            const playPromise = bgAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
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
                    // Remove listeners after SUCCESSFUL play
                    document.removeEventListener('click', startAudio);
                    document.removeEventListener('touchstart', startAudio);
                    document.removeEventListener('scroll', startAudio);
                    document.removeEventListener('touchend', startAudio);
                }).catch(err => {
                    console.log("Audio play blocked by browser:", err);
                    // If blocked, keep the listeners so the next click can try again
                });
            }
        }
    };

    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);
    document.addEventListener('touchend', startAudio);

    // Toggle audio button
    if (audioControl && bgAudio) {
        audioControl.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent triggering startAudio again if not started
            
            if (!audioStarted) {
                startAudio();
            } else {
                if (bgAudio.paused) {
                    bgAudio.play();
                    audioControl.innerHTML = '<i class="ph ph-speaker-high"></i>';
                } else {
                    bgAudio.pause();
                    audioControl.innerHTML = '<i class="ph ph-speaker-slash"></i>';
                }
            }
        });
    }
});
