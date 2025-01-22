const propKeyMap = {
  "productsToDisplay": "products to display",
  "allAppsTitle": "all apps and services title text" ,
  "appCategories":"categorised app-list for all apps and services",
  "viewAllBtnText":"view all button text",
}

const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.trim().toLowerCase();
    const content = row.children[1];
    const text = content.textContent.trim().toLowerCase();
    if (key && content) rdx[key] = { content, text };
  }
  return rdx;
}, {});

const transformDialogHtml = (block) => {
  const categories = block.querySelectorAll('div > ol'); // The <ol> that holds the list

  // Create the dialog structure
  const modalDialog = document.createElement('dialog');
  modalDialog.id = 'view-all-modal';
  modalDialog.setAttribute('daa-lh', 'test');

  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');
  modalContainer.setAttribute('daa-lh', 'show all');

  // Close button
  const closeButton = document.createElement('button');
  closeButton.classList.add('btn-close');
  closeButton.setAttribute('title', 'Close');
  closeButton.setAttribute('daa-im', 'true');
  closeButton.setAttribute('daa-ll', 'Close');

  // Modal content
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // Title for the modal
  const modalTitle = document.createElement('h2');
  modalTitle.textContent = 'show all';
  modalContent.appendChild(modalTitle);

  // Loop through categories (DX, CC, etc.)
  categories.forEach(category => {
      const categoryProducts = category.querySelectorAll(':scope > li'); // Grab all the categories
      categoryProducts.forEach(categoryProduct => {
        const categoryTitle = categoryProduct.querySelector('p').textContent.trim().toLowerCase();
        const appsList = categoryProduct.querySelectorAll('ul li'); // List of apps under each category

        // Create a container for the apps under this category
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('categorised-app-container');
        categoryContainer.setAttribute('daa-lh', categoryTitle);

        // Add the category title (e.g., "acrobat", "cc")
        const categoryHeading = document.createElement('p');
        categoryHeading.classList.add('category-title');
        categoryHeading.textContent = categoryTitle;

        modalContent.appendChild(categoryHeading);

        // Create chiclets for each app in this category
        appsList.forEach(app => {
          const appName = app.textContent.trim();
          const appLink = '/content/help/en/support/' + appName.toLowerCase().replace(/\s+/g, '-') + '.html';

          // Create the chiclet for each app
          const chiclet = document.createElement('a');
          chiclet.classList.add('modal-chiclet');
          chiclet.href = appLink;
          chiclet.setAttribute('daa-im', 'true');
          chiclet.setAttribute('daa-ll', appName);

          // Icon-text wrapper for the chiclet
          const iconTextWrapper = document.createElement('div');
          iconTextWrapper.classList.add('icon-text-wrapper');

          // Placeholder image (you can update with actual icons later)
          const img = document.createElement('img');
          img.src = 'https://chl-author-preview.dev.corp.adobe.com/content/dam/help/mnemonics/acrobat_dc_app_RGB.svg'; // Placeholder icon
          img.classList.add('product-icon');
          img.setAttribute('loading', 'lazy');
          img.alt = appName;

          // Title of the app inside the chiclet
          const appTitle = document.createElement('p');
          appTitle.classList.add('app-title');
          appTitle.textContent = appName;

          // Append the image and title to the chiclet
          iconTextWrapper.appendChild(img);
          iconTextWrapper.appendChild(appTitle);
          chiclet.appendChild(iconTextWrapper);

          // Append the chiclet to the category container
          categoryContainer.appendChild(chiclet);
        });
        // Add the category container to the modal content
        modalContent.appendChild(categoryContainer);
      })
  });

  // Add the close button and modal content to the modal container
  modalContainer.appendChild(closeButton);
  modalContainer.appendChild(modalContent);

  // Append the modal container to the modal dialog
  modalDialog.appendChild(modalContainer);

  return modalDialog;
}

const transformHtml = (block, metadata) => {
  // Grab the original HTML structure
  const links = metadata[propKeyMap.productsToDisplay]?.content?.querySelectorAll('ul>li');

  // Create the container for the transformed HTML
  const chicletContainer = document.createElement('div');
  chicletContainer.classList.add('productchiclet');
  
  const container = document.createElement('div');
  container.classList.add('chiclet-container');
  container.setAttribute('daa-lh', 'All apps and services');

  // Transform each product from the original HTML into the new format
  links.forEach(link => {
      const anchor = link.querySelector('a');
      const name = anchor ? anchor.textContent.trim() : link.textContent.trim();
      const href = anchor ? anchor.getAttribute('href') : '#';
      
      // Create a chiclet
      const chiclet = document.createElement('a');
      chiclet.classList.add('chiclet');
      chiclet.href = href;
      chiclet.setAttribute('daa-im', 'true');
      chiclet.setAttribute('daa-ll', name);

      // Create the icon-text wrapper
      const iconTextWrapper = document.createElement('div');
      iconTextWrapper.classList.add('icon-text-wrapper');
      
      // Create the image and title elements (currently placeholders)
      const img = document.createElement('img');
      img.src = 'https://chl-author-preview.dev.corp.adobe.com/content/dam/help/mnemonics/acrobat_dc_app_RGB.svg';  // Placeholder icon
      img.classList.add('product-icon');
      img.alt = name;

      const title = document.createElement('p');
      title.classList.add('title');
      title.textContent = name;

      iconTextWrapper.appendChild(img);
      iconTextWrapper.appendChild(title);
      chiclet.appendChild(iconTextWrapper);

      container.appendChild(chiclet);
  });

  // Create the "View All" chiclet
  const viewAllChiclet = document.createElement('div');
  viewAllChiclet.classList.add('chiclet', 'view-all');
  viewAllChiclet.setAttribute('daa-im', 'true');
  viewAllChiclet.setAttribute('daa-ll', 'View All');

  const viewAllWrapper = document.createElement('div');
  viewAllWrapper.classList.add('icon-text-wrapper');

  const viewAllIcon = document.createElement('div');
  viewAllIcon.classList.add('view-all-icon');
  
  const viewAllTitle = document.createElement('p');
  viewAllTitle.classList.add('title');
  viewAllTitle.textContent = 'View All';

  viewAllWrapper.appendChild(viewAllIcon);
  viewAllWrapper.appendChild(viewAllTitle);
  viewAllChiclet.appendChild(viewAllWrapper);
  container.appendChild(viewAllChiclet);

  // Create the View All Modal
  const viewAllModal = transformDialogHtml(metadata[propKeyMap.appCategories]?.content)

  // Add the chiclet container to the main container
  chicletContainer.appendChild(container);
  chicletContainer.appendChild(viewAllModal);

  
  // Append the transformed HTML into the DOM
  block.replaceChildren(chicletContainer)

}

const bindEvents = () => {
  const element = document.querySelector('.productchiclet');
  const closeModalButton = element.querySelector('.btn-close');
  const dialog = element.querySelector('#view-all-modal');
  const viewAllChiclet = element.querySelector('.chiclet.view-all');
  viewAllChiclet.addEventListener('click', () => {
    document.getElementById('view-all-modal').showModal();
  });
  if (dialog && closeModalButton) {
    closeModalButton.onclick = () => {
      dialog.close();
    };
    dialog.addEventListener('click', (event) => {
        const modelContainer = dialog.querySelector('.modal-container');
        // Adding this check to handle click event on backdrop and closing the dialog.
        if (event.target === dialog && event.target !== modelContainer)
            dialog.close();
    });
}
}

export default (block) => {
  const metadata = getMetadata(block);
  transformHtml(block, metadata);
  bindEvents();
};
