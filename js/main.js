/**
 * Green AI Portfolio - Main JavaScript
 * Handles navigation, animations, and interactivity
 */

(function() {
    'use strict';

    // DOM Elements
    const sidebar = document.querySelector('.sidebar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    /**
     * Mobile Navigation Toggle
     */
    function initMobileNav() {
        if (!navToggle) return;

        // Create toggle button for mobile if not in sidebar
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'nav-toggle mobile-nav-toggle';
        mobileToggle.setAttribute('aria-label', 'Toggle navigation');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<span class="hamburger"></span>';
        document.body.appendChild(mobileToggle);

        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            sidebar.classList.toggle('active');
            document.body.classList.toggle('nav-open');

            // Trap focus in sidebar when open
            if (!isExpanded) {
                sidebar.querySelector('.nav-link').focus();
            }
        });

        // Close nav when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            }
        });

        // Close nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
                mobileToggle.focus();
            }
        });
    }

    /**
     * Active Navigation Link on Scroll
     */
    function initScrollSpy() {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    updateActiveNav(id);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            if (section.getAttribute('id')) {
                observer.observe(section);
            }
        });
    }

    /**
     * Update active navigation link
     */
    function updateActiveNav(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');

            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Smooth Scroll for Navigation Links
     */
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);

                    if (target) {
                        // Close mobile nav if open
                        sidebar.classList.remove('active');
                        const mobileToggle = document.querySelector('.mobile-nav-toggle');
                        if (mobileToggle) {
                            mobileToggle.setAttribute('aria-expanded', 'false');
                        }
                        document.body.classList.remove('nav-open');

                        // Smooth scroll to target
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        // Update URL without scrolling
                        history.pushState(null, null, href);

                        // Move focus to target for accessibility
                        target.setAttribute('tabindex', '-1');
                        target.focus({ preventScroll: true });
                    }
                }
            });
        });
    }

    /**
     * Animate Elements on Scroll
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.about-card, .ism-feature, .blog-card, .research-card, .interview-card, .mentor-card, .project-card, .final-card'
        );

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Form Validation and Enhancement
     */
    function initFormHandling() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            // Let Netlify Forms handle the submission
            // Just add visual feedback
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Reset button after submission (Netlify handles the actual form)
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });

        // Add floating labels effect
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    /**
     * Keyboard Navigation Enhancement
     */
    function initKeyboardNav() {
        // Add keyboard navigation for cards
        const interactiveCards = document.querySelectorAll('.blog-card, .research-card');

        interactiveCards.forEach(card => {
            const link = card.querySelector('a');
            if (link) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'A') {
                        link.click();
                    }
                });
            }
        });
    }

    /**
     * Progress Bar Animation
     */
    function initProgressBar() {
        const progressBars = document.querySelectorAll('.progress-fill');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        progressBars.forEach(bar => observer.observe(bar));
    }

    /**
     * Theme Toggle (for future enhancement)
     */
    function initThemeToggle() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }

    /**
     * Prefers Reduced Motion Check
     */
    function checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            // Disable animations
            document.documentElement.classList.add('reduced-motion');
        }

        prefersReducedMotion.addEventListener('change', () => {
            if (prefersReducedMotion.matches) {
                document.documentElement.classList.add('reduced-motion');
            } else {
                document.documentElement.classList.remove('reduced-motion');
            }
        });
    }

    /**
     * Initialize all functionality
     */
    function init() {
        checkReducedMotion();
        initMobileNav();
        initScrollSpy();
        initSmoothScroll();
        initScrollAnimations();
        initFormHandling();
        initKeyboardNav();
        initProgressBar();
        initThemeToggle();
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
