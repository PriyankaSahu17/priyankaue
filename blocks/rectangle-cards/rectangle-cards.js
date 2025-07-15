import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// export default function decorate(block) {
//   /* change to ul, li */
//   const ul = document.createElement('ul');
//   [...block.children].forEach((row) => {
//     const li = document.createElement('li');
//     moveInstrumentation(row, li);
//     while (row.firstElementChild) li.append(row.firstElementChild);
//     [...li.children].forEach((div) => {
//       if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
//       else div.className = 'cards-card-body';
//     });
//     ul.append(li);
//   });
//   ul.querySelectorAll('picture > img').forEach((img) => {
//     const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
//     moveInstrumentation(img, optimizedPic.querySelector('img'));
//     img.closest('picture').replaceWith(optimizedPic);
//   });
//   block.textContent = '';
//   block.append(ul);
// }
export default function decorate(block) {
  const ul = document.createElement('ul');
  const children = [...block.children];

  children.forEach((row, index) => {
    const li = document.createElement('li');
    if (index >= 3) li.classList.add('hidden'); // hide initially

    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
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

  // Add See More button
  const seeMoreBtn = document.createElement('button');
  seeMoreBtn.textContent = 'See more';
  seeMoreBtn.className = 'see-more-btn';
  block.append(seeMoreBtn);

  let visibleCount = 3;
  seeMoreBtn.addEventListener('click', () => {
    const hiddenItems = ul.querySelectorAll('li.hidden');
    for (let i = 0; i < 3 && i < hiddenItems.length; i++) {
      hiddenItems[i].classList.remove('hidden');
    }
    visibleCount += 3;
    if (visibleCount >= ul.children.length) {
      seeMoreBtn.style.display = 'none';
    }
  });
}
