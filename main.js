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

	// custom event
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

//FORM HANDLER//
const contactForm = document.querySelector('#contact-form');
const contactBtn = document.querySelector('#contact-btn');
const contactInput = document.querySelector('#email');

// fake sending email to api endpoint
function postEmailToDatabase(emai) {
	console.info(`Your email is ${emai}`);
	return new Promise((resolve) => setTimeout(resolve, 2000));
}

// options for submit button
const contactBtnOptions = {
	pending: `
    <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>
    <span class="uppercase tracking-wide animate-pulse">
    Sending...
    </span>
  `,
	success: `
  <span class="uppercase tracking-wide">
    Thank you!
    </span>
    <span class="uppercase tracking-wide">
    ✌️😎
    </span>`,
};

async function handleFormSubmit(e) {
	e.preventDefault();
	addDisabledAttribute([contactForm, contactBtn]);
	const userEmail = contactInput.value;
	contactBtn.innerHTML = contactBtnOptions.pending;
	contactInput.style.display = 'none';
	await postEmailToDatabase(userEmail);
	contactBtn.innerHTML = contactBtnOptions.success;
}

contactForm.addEventListener('submit', handleFormSubmit);

// FADE UP OBSERVER //
function fadeUpObserverCallback(elsToWatch) {
	elsToWatch.forEach((el) => {
		if (el.isIntersecting) {
			el.target.classList.add('faded');
			fadeUpObserver.unobserve(el.target);
			el.target.addEventListener(
				'transitionend',
				() => {
					el.target.classList.remove('fade-up', 'faded');
				},
				{ once: true }
			);
		}
	});
}

const fadeUpObserverOptions = {
	threshold: 0.6,
};

const fadeUpObserver = new IntersectionObserver(
	fadeUpObserverCallback,
	fadeUpObserverOptions
);

document.querySelectorAll('.fade-up').forEach((item) => {
	fadeUpObserver.observe(item);
});
