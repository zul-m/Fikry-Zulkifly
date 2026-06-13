// Mobile gallery carousel
const galleryMain = document.querySelector<HTMLElement>('.gallery-main');
const track = galleryMain?.querySelector<HTMLElement>('.gallery-track');
const total = galleryMain?.querySelectorAll('.gallery-slide').length ?? 0;
const counter = document.querySelector<HTMLElement>('.gallery-counter');
let galleryIdx = 0;
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;
let didSwipe = false;

function showGallerySlide(index: number, animated = true) {
  if (total === 0 || !track) return;
  galleryIdx = ((index % total) + total) % total;
  track.style.transition = animated ? 'transform 0.3s ease' : 'none';
  track.style.transform = `translateX(-${galleryIdx * 100}%)`;
  if (galleryMain) galleryMain.dataset.lightboxIndex = String(galleryIdx);
  if (counter) counter.textContent = `${galleryIdx + 1} / ${total}`;
}

if (galleryMain && track) {
  galleryMain.addEventListener('touchstart', (e) => {
    const t = (e as TouchEvent).touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    isDragging = true;
    didSwipe = false;
    track.style.transition = 'none';
  }, { passive: true });

  galleryMain.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const t = (e as TouchEvent).touches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
      didSwipe = true;
      track.style.transform = `translateX(calc(-${galleryIdx * 100}% + ${dx}px))`;
    }
  }, { passive: false });

  galleryMain.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = (e as TouchEvent).changedTouches[0].clientX - touchStartX;
    if (didSwipe && Math.abs(dx) > 50) {
      showGallerySlide(dx < 0 ? galleryIdx + 1 : galleryIdx - 1);
    } else {
      showGallerySlide(galleryIdx); // snap back
    }
  });
}

const dialog = document.getElementById('gallery-lightbox') as HTMLDialogElement | null;

if (dialog) {
  const slides = Array.from(dialog.querySelectorAll<HTMLElement>('.lightbox-slide'));
  const counter = dialog.querySelector('.lightbox-counter');
  let current = 0;

  function show(index: number) {
    slides[current].classList.remove('is-active');
    current = ((index % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
  }

  document.querySelector('.gallery-cta')?.addEventListener('click', (e) => {
    e.stopPropagation();
    show(0);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });

  document.querySelectorAll<HTMLElement>('[data-lightbox-index]').forEach(el => {
    el.addEventListener('click', () => {
      if (el === galleryMain && didSwipe) return;
      const idx = parseInt(el.dataset.lightboxIndex ?? '0', 10);
      show(idx);
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  function closeDialog() {
    dialog!.close();
    document.body.style.overflow = '';
  }

  dialog.querySelector('.lightbox-prev')?.addEventListener('click', () => show(current - 1));
  dialog.querySelector('.lightbox-next')?.addEventListener('click', () => show(current + 1));
  dialog.querySelector('.lightbox-close')?.addEventListener('click', closeDialog);

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', (e) => {
    if (!dialog.open) return;
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}
