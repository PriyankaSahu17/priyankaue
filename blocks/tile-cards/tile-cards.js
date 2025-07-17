import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  const pastelColors = [
    '#fce4ec', '#e1f5fe', '#f3e5f5', '#fff3e0', '#e8f5e9',
    '#f0f4c3', '#ede7f6', '#f9fbe7', '#ffe0b2', '#e0f7fa'
  ];

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    const bgColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    li.style.backgroundColor = bgColor;

    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'tiles-card-image';
      } else {
        div.className = 'tiles-card-body';
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
}
