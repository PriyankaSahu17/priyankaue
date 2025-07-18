// import { createOptimizedPicture } from '../../scripts/aem.js';
// import { moveInstrumentation } from '../../scripts/scripts.js';

// export default function decorate(block) {
//   /* change to ul, li */
//   const ul = document.createElement('ul');
//   [...block.children].forEach((row) => {
//     const li = document.createElement('li');
//     moveInstrumentation(row, li);
//     while (row.firstElementChild) li.append(row.firstElementChild);
//     [...li.children].forEach((div) => {
//       if (div.children.length === 1 && div.querySelector('picture')) div.className = 'vertical-cards-card-image';
//       else div.className = 'vertical-cards-card-body';
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
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // Loop through each card (row)
    [...row.children].forEach((col, index) => {
      // If it's the image container (first child)
      if (index === 0 && col.querySelector('picture')) {
        // Add heart icon button
        const heartBtn = document.createElement('button');
        heartBtn.className = 'heart-button';
        heartBtn.innerHTML = '♡'; // Empty heart

        heartBtn.onclick = () => {
          heartBtn.classList.toggle('favorited');
          heartBtn.innerHTML = heartBtn.classList.contains('favorited') ? '♥' : '♡';
          handleFavoriteToggle(heartBtn);
        };

        // Style button
        col.style.position = 'relative'; // Ensure container is relative
        heartBtn.style.position = 'absolute';
        heartBtn.style.top = '0';
        heartBtn.style.right = '0';
        heartBtn.style.background = 'none';
        heartBtn.style.border = 'none';
        heartBtn.style.fontSize = '48px';
        heartBtn.style.cursor = 'pointer';
        heartBtn.style.color = '#000000ff'; // Red heart

        col.appendChild(heartBtn);
      }
    });
  });
}

// Empty function to define action
function handleFavoriteToggle(button) {
  const isFavorited = button.classList.contains('favorited');

  if (isFavorited) {
    // Fetch card data
    const card = button.closest('.vertical-cards-wrapper > div');
    const image = card.querySelector('img')?.src || '';
    const description = card.querySelector('p')?.innerText || '';
    const tags = [...card.querySelectorAll('ul li a')].map(a => a.innerText);
    
    const favoriteData = {
      image,
      description,
      tags,
      timestamp: Date.now(), // optional
    };

    // Get existing favorites
    const existing = JSON.parse(localStorage.getItem('favorites') || '[]');

    // Save only if not already saved
    const alreadySaved = existing.some(item => item.image === image);
    if (!alreadySaved) {
      existing.push(favoriteData);
      localStorage.setItem('favorites', JSON.stringify(existing));
      console.log('Saved to favorites:', favoriteData);
    }

  } else {
    // If unfavorited: optionally remove from localStorage
    const existing = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updated = existing.filter(item => item.image !== button.closest('.vertical-cards-wrapper > div').querySelector('img')?.src);
    localStorage.setItem('favorites', JSON.stringify(updated));
    console.log('Removed from favorites');
  }
}
