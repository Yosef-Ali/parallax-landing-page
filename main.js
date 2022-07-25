import './style.css';

// IMAGE SLIDER //
const sliderBtns = document.querySelectorAll('[data-slideBtn]');
const slideContainer = document.querySelector('[data-slideContainer]');
const slides = [...document.querySelectorAll('[data-slide]')];

let currentIndex = 0;
let isMoving = false;

//btn handle functions
const handleSliderBtnClick = (e) => {
	if (isMoving) return;
	isMoving = true;
	e.currentTarget.id === 'prev' ? currentIndex-- : currentIndex++;
	console.log(currentIndex);
	slideContainer.dispatchEvent(new Event('sliderMove'));
};

// remove/add attributes functions
const removeDisabledAttributes = (els) =>
	els.forEach((el) => el.removeAttribute('disabled'));

const addDisabledAttribute = (els) =>
	els.forEach((el) => el.setAttribute('disabled', 'true'));

// event listeners
sliderBtns.forEach((btn) => {
	btn.addEventListener('click', handleSliderBtnClick);
});

slideContainer.addEventListener('sliderMove', () => {
	// translate the container to the left or right
	slideContainer.style.transform = `translateX(-${
		currentIndex * slides[0].clientWidth
	}px)`;

	// remove disable attribute from btns
	removeDisabledAttributes(sliderBtns);
	// add disable attribute to btns if needed
	currentIndex === 0 && addDisabledAttribute([sliderBtns[0]]);
});

// click after transition end
slideContainer.addEventListener('transitionend', () => (isMoving = false));

// disable Image drag event listener
document
	.querySelectorAll('[data-slide] img')
	.forEach((img) => (img.ondragstart = () => false));

// intersection observer for slider
const slideObserver = new IntersectionObserver(
	(slide) => {
		if (slide[0].isIntersecting) {
			addDisabledAttribute([sliderBtns[1]]);
		}
	},
	{ threshold: 0.75 }
);

slideObserver.observe(slides[slides.length - 1]);
