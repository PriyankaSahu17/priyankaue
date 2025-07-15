
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'rectangle-cards-card-image';
      else div.className = 'rectangle-cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);


  const liElements = [...ul.querySelectorAll('li')];

  // Hide everything beyond the first 10 cards
  liElements.forEach((li, index) => {
    if (index >= 10) {
      li.classList.add('hidden');
    }
  });

  // Create and append the See More button
  const seeMoreBtn = document.createElement('button');
  seeMoreBtn.textContent = 'See more';
  seeMoreBtn.className = 'see-more-btn';
  block.appendChild(seeMoreBtn);

  seeMoreBtn.addEventListener('click', () => {
    const hiddenCards = ul.querySelectorAll('li.hidden');
    for (let i = 0; i < 5 && i < hiddenCards.length; i++) {
      hiddenCards[i].classList.remove('hidden');
    }

    // Hide button if no more cards
    if (ul.querySelectorAll('li.hidden').length === 0) {
      seeMoreBtn.style.display = 'none';
    }
  });
}
