function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

/*--------------------
Vars
--------------------*/
const $menu = document.querySelector(".menu");
const $items = document.querySelectorAll(".menu--item");
const $images = document.querySelectorAll(".menu--item img");
let menuWidth = $menu.clientWidth;
let itemWidth = $items[0].clientWidth;
let wrapWidth = $items.length * itemWidth;

let scrollSpeed = 0;
let oldScrollY = 0;
let scrollY = 0;
let y = 0;

/*--------------------
Lerp
--------------------*/
const lerp = (v0, v1, t) => {
  return v0 * (1 - t) + v1 * t;
};

/*--------------------
Dispose
--------------------*/
const dispose = (scroll) => {
  gsap.set($items, {
    x: (i) => {
      return i * itemWidth + scroll;
    },
    modifiers: {
      x: (x, target) => {
        const s = gsap.utils.wrap(-itemWidth, wrapWidth, parseInt(x));
        return `${s}px`;
      },
    },
  });
};
dispose(0);

/*--------------------
Wheel
--------------------*/
const handleMouseWheel = (e) => {
  scrollY -= e.deltaY * 0.9;
};

/*--------------------
Touch
--------------------*/
let touchStart = 0;
let touchX = 0;
let isDragging = false;
const handleTouchStart = (e) => {
  touchStart = e.clientX || e.touches[0].clientX;
  isDragging = true;
  $menu.classList.add("is-dragging");
};
const handleTouchMove = (e) => {
  if (!isDragging) return;
  touchX = e.clientX || e.touches[0].clientX;
  scrollY += (touchX - touchStart) * 2.5;
  touchStart = touchX;
};
const handleTouchEnd = () => {
  isDragging = false;
  $menu.classList.remove("is-dragging");
};
/*--------------------
HOVER ON SKILLS
--------------------*/
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mouseenter", (e) => {
    // Add active state only to hovered card
    e.currentTarget.classList.add("active");
  });

  card.addEventListener("mouseleave", (e) => {
    // Remove active state when mouse leaves
    e.currentTarget.classList.remove("active");
  });
});

/*--------------------
Listeners
--------------------*/
$menu.addEventListener("mousewheel", handleMouseWheel);
$menu.addEventListener("touchstart", handleTouchStart);
$menu.addEventListener("touchmove", handleTouchMove);
$menu.addEventListener("touchend", handleTouchEnd);
$menu.addEventListener("mousedown", handleTouchStart);
$menu.addEventListener("mousemove", handleTouchMove);
$menu.addEventListener("mouseleave", handleTouchEnd);
$menu.addEventListener("mouseup", handleTouchEnd);
$menu.addEventListener("selectstart", () => {
  return false;
});

/*--------------------
Resize
--------------------*/
window.addEventListener("resize", () => {
  menuWidth = $menu.clientWidth;
  itemWidth = $items[0].clientWidth;
  wrapWidth = $items.length * itemWidth;
});

/*--------------------
Render
--------------------*/
const render = () => {
  requestAnimationFrame(render);
  y = lerp(y, scrollY, 0.1);
  dispose(y);

  scrollSpeed = y - oldScrollY;
  oldScrollY = y;

  gsap.to($items, {
    skewX: -scrollSpeed * 0.2,
    rotate: scrollSpeed * 0.01,
    scale: 1 - Math.min(100, Math.abs(scrollSpeed)) * 0.003,
  });
};
render();

/*--------------------
Rocket Animation
--------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const rocket = document.querySelector(".rocket");
  const path = document.querySelector("#curve");

  // Set rocket to follow path
  rocket.style.offsetPath = `path("${path.getAttribute("d")}")`;

  // Trigger animation when section is in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          rocket.classList.add("animate-rocket");
        } else {
          rocket.classList.remove("animate-rocket");
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(document.querySelector("#education"));
});
