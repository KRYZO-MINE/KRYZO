// === INITIALIZATION ===
window.addEventListener('load', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    updateTime();
    setInterval(updateTime, 1000);
});

// === LOCAL TIME LOGIC ===
function updateTime() {
    const timeDisplay = document.getElementById('local-time');
    if(timeDisplay) {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('en-IN', {
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        });
    }
}

// === DARK MODE LOGIC ===
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    html.classList.remove('dark');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    if (html.classList.contains('dark')) {
        localStorage.theme = 'dark';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.theme = 'light';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// === MOBILE MENU ===
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('close-menu');
const links = document.querySelectorAll('.mobile-link');

const toggleMenu = () => {
    const isOpen = menu.style.opacity === '1';
    menu.style.opacity = isOpen ? '0' : '1';
    menu.style.pointerEvents = isOpen ? 'none' : 'auto';
};

btn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);
links.forEach(link => link.addEventListener('click', toggleMenu));

// === SCROLL TO TOP & ACTIVE NAVIGATION (ScrollSpy) ===
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const sections = document.querySelectorAll('.section-spy');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.remove('translate-y-20', 'opacity-0');
    } else {
        scrollToTopBtn.classList.add('translate-y-20', 'opacity-0');
    }

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-primary', 'dark:text-white', 'font-bold');
        link.classList.add('text-slate-600', 'dark:text-slate-400');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('text-primary', 'dark:text-white', 'font-bold');
            link.classList.remove('text-slate-600', 'dark:text-slate-400');
        }
    });
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === PROJECT FILTER LOGIC ===
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projects.forEach(project => {
            const categories = project.getAttribute('data-filter-category').split(' ');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                project.style.display = 'block';
                project.classList.add('reveal-on-scroll', 'is-visible');
            } else {
                project.style.display = 'none';
                project.classList.remove('reveal-on-scroll', 'is-visible');
            }
        });
    });
});

// === PROJECT FILTER LOGIC ===
const modal = document.getElementById('project-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalContent = document.getElementById('modal-content');
const closeModal = document.getElementById('close-modal');
const triggers = document.querySelectorAll('.project-trigger');

const mTitle = document.getElementById('modal-title');
const mCategory = document.getElementById('modal-category');
const mImage = document.getElementById('modal-image');
const mDesc = document.getElementById('modal-desc');
const mLink = document.getElementById('modal-link');

function openModal(data) {
    mTitle.textContent = data.title;
    mCategory.textContent = data.category;
    mImage.src = data.image;
    mDesc.textContent = data.desc;
    if (mLink && data.link) {
        mLink.href = data.link;
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        modalBackdrop.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    document.body.style.overflow = 'hidden'; 
}

function hideModal() {
    modalBackdrop.classList.add('opacity-0');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const data = {
            title: trigger.dataset.title,
            category: trigger.dataset.category,
            image: trigger.dataset.image,
            desc: trigger.dataset.desc,
            link: trigger.dataset.link
        };
        openModal(data);
    });
});

closeModal.addEventListener('click', hideModal);
modalBackdrop.addEventListener('click', hideModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
});

// === TOAST NOTIFICATION LOGIC ===
const toastContainer = document.getElementById('toast-container');
const contactForm = document.getElementById('contact-form');

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
    const colorClass = type === 'success' ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'bg-red-500 text-white';

    toast.className = `flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl font-medium text-sm toast-enter toast-enter-active ${colorClass}`;
    toast.innerHTML = `${icon} <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('toast-enter-active');
        toast.classList.add('toast-exit-active');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-circle-notch animate-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
        showToast('Message sent successfully! I will get back to you soon.');
        e.target.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1500);
});

// === SCROLL REVEAL ANIMATION [MODERN] ===

// === SCROLL REVEAL ANIMATION [MODERN] ===
