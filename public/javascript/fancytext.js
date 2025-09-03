document.addEventListener("DOMContentLoaded", function () {
    let elements = document.querySelectorAll(".label, .text");

    function revealOnScroll() {
        elements.forEach((el, index) => {
            let position = el.getBoundingClientRect().top;
            let windowHeight = window.innerHeight;

            if (position < windowHeight * 0.85) {
                el.style.animationDelay = `${index * 0.1}s`; // Staggered delay effect
                el.classList.add("reveal");
            } else {
                el.classList.remove("reveal"); // Reset when scrolled up
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Run once on page load
});
