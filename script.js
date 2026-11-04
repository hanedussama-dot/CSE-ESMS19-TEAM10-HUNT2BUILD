const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const brandLink = document.querySelector(".brand");

if (navToggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if (brandLink) {
  brandLink.addEventListener("click", (event) => {
    event.preventDefault();
    navLinks?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open menu");
    history.replaceState(null, "", "#top");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });
}

const qrGrid = document.getElementById("qrGrid");

if (qrGrid) {
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let centerFrame = 0;

  const updateCenteredQr = () => {
    if (!window.matchMedia("(max-width: 480px)").matches) return;
    const gridCenter = qrGrid.scrollLeft + qrGrid.clientWidth / 2;
    let closestTile = null;
    let closestDistance = Infinity;

    qrGrid.querySelectorAll(".qr-tile").forEach((tile) => {
      const tileCenter = tile.offsetLeft + tile.offsetWidth / 2;
      const distance = Math.abs(tileCenter - gridCenter);
      if (distance < closestDistance) {
        closestTile = tile;
        closestDistance = distance;
      }
      tile.classList.remove("is-centered");
    });

    closestTile?.classList.add("is-centered");
  };

  qrGrid.addEventListener("scroll", () => {
    window.cancelAnimationFrame(centerFrame);
    centerFrame = window.requestAnimationFrame(updateCenteredQr);
  }, { passive: true });
  window.addEventListener("resize", updateCenteredQr);
  updateCenteredQr();

  qrGrid.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    isDragging = true;
    startX = event.clientX;
    startScrollLeft = qrGrid.scrollLeft;
    qrGrid.classList.add("is-dragging");
    qrGrid.setPointerCapture(event.pointerId);
  });

  qrGrid.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    qrGrid.scrollLeft = startScrollLeft - (event.clientX - startX);
  });

  const stopDragging = (event) => {
    if (!isDragging) return;
    isDragging = false;
    qrGrid.classList.remove("is-dragging");
    if (qrGrid.hasPointerCapture(event.pointerId)) {
      qrGrid.releasePointerCapture(event.pointerId);
    }
  };

  qrGrid.addEventListener("pointerup", stopDragging);
  qrGrid.addEventListener("pointercancel", stopDragging);
  qrGrid.addEventListener("pointerleave", stopDragging);
}
