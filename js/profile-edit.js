/**
 * Profile Edit Toggle Module
 * Allows users to edit their profile information inline
 * Uses: Variables, Objects, Events, Functions, Loops, localStorage
 */

// Storage key for profile data
const PROFILE_STORAGE_KEY = 'profileData';
const CURRENT_USER_ID = 'currentUser';

/**
 * Initialize profile data from localStorage
 * @returns {object} - Stored profile data
 */
function initializeProfileData() {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  return stored
    ? JSON.parse(stored)
    : {
        name: '',
        title: '',
        location: '',
        bio: '',
        skills: [],
      };
}

/**
 * Save profile data to localStorage
 * @param {object} profileData - Profile data to save
 */
function saveProfileData(profileData) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
  console.log('Profile data saved:', profileData);
}

/**
 * Get current profile data from page or localStorage
 * @returns {object} - Profile data
 */
function getProfileData() {
  const name = document.querySelector('.profile-top h1');
  const title = document.querySelector('.profile-top .lead');
  const location = document.querySelector('.profile-top > p');
  const bio = document.querySelector('.profile-about p');

  return {
    name: name?.textContent.trim() || '',
    title: title?.textContent.trim() || '',
    location: location?.textContent.trim() || '',
    bio: bio?.textContent.trim() || '',
  };
}

/**
 * Create edit button for profile
 * @returns {HTMLElement} - Edit button element
 */
function createEditButton() {
  const button = document.createElement('button');
  button.id = 'profile-edit-toggle';
  button.className = 'btn btn-primary';
  button.setAttribute('aria-label', 'Edit profile information');
  button.setAttribute('title', 'Edit your profile');
  button.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';

  return button;
}

/**
 * Create save and cancel buttons for edit mode
 * @returns {object} - Object with save and cancel buttons
 */
function createProfileActionButtons() {
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-success profile-save-btn';
  saveBtn.setAttribute('aria-label', 'Save profile changes');
  saveBtn.innerHTML = '<i class="fas fa-check"></i> Save Changes';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-danger profile-cancel-btn';
  cancelBtn.setAttribute('aria-label', 'Cancel profile editing');
  cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';

  return { saveBtn, cancelBtn };
}

/**
 * Toggle edit mode on/off
 */
function toggleEditMode() {
  const profileTop = document.querySelector('.profile-top');
  const editBtn = document.getElementById('profile-edit-toggle');

  if (!profileTop) return;

  const isEditing = profileTop.classList.contains('editing');

  if (isEditing) {
    // Exit edit mode
    exitEditMode();
  } else {
    // Enter edit mode
    enterEditMode();
  }
}

/**
 * Enter edit mode - Convert fields to editable inputs
 */
function enterEditMode() {
  const profileTop = document.querySelector('.profile-top');
  if (!profileTop) return;

  profileTop.classList.add('editing');

  // Get current data
  const nameEl = profileTop.querySelector('h1');
  const titleEl = profileTop.querySelector('.lead');
  const locationEl = profileTop.querySelector('p:not(.lead)');

  // Store original values
  const originalData = {
    name: nameEl?.textContent.trim() || '',
    title: titleEl?.textContent.trim() || '',
    location: locationEl?.textContent.trim() || '',
  };
  profileTop.dataset.originalData = JSON.stringify(originalData);

  // Replace name with editable input
  if (nameEl) {
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'profile-edit-input profile-name-input';
    nameInput.value = nameEl.textContent.trim();
    nameInput.setAttribute('aria-label', 'Edit your full name');
    nameInput.placeholder = 'Full Name';
    nameEl.replaceWith(nameInput);
  }

  // Replace title with editable input
  if (titleEl) {
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'profile-edit-input profile-title-input';
    titleInput.value = titleEl.textContent.trim();
    titleInput.setAttribute('aria-label', 'Edit your professional title');
    titleInput.placeholder = 'Professional Title';
    titleEl.replaceWith(titleInput);
  }

  // Replace location with editable input
  if (locationEl && !locationEl.classList.contains('lead')) {
    const locationInput = document.createElement('input');
    locationInput.type = 'text';
    locationInput.className = 'profile-edit-input profile-location-input';
    locationInput.value = locationEl.textContent.trim();
    locationInput.setAttribute('aria-label', 'Edit your location');
    locationInput.placeholder = 'City, State';
    locationEl.replaceWith(locationInput);
  }

  // Update edit button to show "Cancel" text alongside action buttons
  const editBtn = document.getElementById('profile-edit-toggle');
  if (editBtn) {
    editBtn.innerHTML = '<i class="fas fa-pencil"></i> Editing...';
    editBtn.disabled = true;
    editBtn.style.opacity = '0.6';
  }

  // Show save/cancel buttons
  showProfileActionButtons();

  // Announce to screen readers
  announceA11yChange('Edit mode activated - Profile fields are now editable');

  console.log('Edit mode entered');
}

/**
 * Exit edit mode - Convert inputs back to text
 */
function exitEditMode() {
  const profileTop = document.querySelector('.profile-top');
  if (!profileTop) return;

  profileTop.classList.remove('editing');

  // Get edited values
  const nameInput = profileTop.querySelector('.profile-name-input');
  const titleInput = profileTop.querySelector('.profile-title-input');
  const locationInput = profileTop.querySelector('.profile-location-input');

  // Convert back to display elements
  if (nameInput) {
    const nameEl = document.createElement('h1');
    nameEl.className = 'large';
    nameEl.textContent = nameInput.value.trim() || 'Name';
    nameInput.replaceWith(nameEl);
  }

  if (titleInput) {
    const titleEl = document.createElement('p');
    titleEl.className = 'lead';
    titleEl.textContent = titleInput.value.trim() || 'Professional Title';
    titleInput.replaceWith(titleEl);
  }

  if (locationInput) {
    const locationEl = document.createElement('p');
    locationEl.textContent = locationInput.value.trim() || 'Location';
    locationInput.replaceWith(locationEl);
  }

  // Restore edit button
  const editBtn = document.getElementById('profile-edit-toggle');
  if (editBtn) {
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
    editBtn.disabled = false;
    editBtn.style.opacity = '1';
  }

  // Hide save/cancel buttons
  hideProfileActionButtons();

  announceA11yChange('Edit mode exited');
  console.log('Edit mode exited');
}

/**
 * Save profile changes
 */
function saveProfileChanges() {
  const profileTop = document.querySelector('.profile-top');
  const nameInput = profileTop?.querySelector('.profile-name-input');
  const titleInput = profileTop?.querySelector('.profile-title-input');
  const locationInput = profileTop?.querySelector('.profile-location-input');

  // Validate inputs
  if (!nameInput?.value.trim()) {
    alert('Please enter your name');
    nameInput?.focus();
    return;
  }

  // Prepare data to save
  const profileData = {
    name: nameInput?.value.trim() || '',
    title: titleInput?.value.trim() || '',
    location: locationInput?.value.trim() || '',
    lastUpdated: new Date().toISOString(),
  };

  // Save to localStorage
  saveProfileData(profileData);

  // Exit edit mode
  exitEditMode();

  // Show success message
  announceA11yChange('Profile changes saved successfully');
  console.log('Profile saved:', profileData);

  // Visual feedback
  const saveBtn = document.querySelector('.profile-save-btn');
  if (saveBtn) {
    saveBtn.style.opacity = '0.7';
    setTimeout(() => {
      saveBtn.style.opacity = '1';
    }, 200);
  }
}

/**
 * Cancel profile editing and restore original data
 */
function cancelProfileEditing() {
  const profileTop = document.querySelector('.profile-top');
  if (!profileTop) return;

  // Restore original data
  const originalData = JSON.parse(profileTop.dataset.originalData || '{}');

  const nameInput = profileTop.querySelector('.profile-name-input');
  const titleInput = profileTop.querySelector('.profile-title-input');
  const locationInput = profileTop.querySelector('.profile-location-input');

  if (nameInput && originalData.name) nameInput.value = originalData.name;
  if (titleInput && originalData.title) titleInput.value = originalData.title;
  if (locationInput && originalData.location)
    locationInput.value = originalData.location;

  // Exit edit mode
  exitEditMode();

  announceA11yChange('Profile editing cancelled');
  console.log('Profile editing cancelled');
}

/**
 * Show save and cancel buttons
 */
function showProfileActionButtons() {
  // Remove existing action buttons if present
  document
    .querySelectorAll('.profile-save-btn, .profile-cancel-btn')
    .forEach((btn) => btn.remove());

  const { saveBtn, cancelBtn } = createProfileActionButtons();

  // Add buttons to the profile top section
  const profileTop = document.querySelector('.profile-top');
  if (profileTop) {
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'profile-edit-actions';
    actionsContainer.appendChild(saveBtn);
    actionsContainer.appendChild(cancelBtn);
    profileTop.appendChild(actionsContainer);

    saveBtn.addEventListener('click', saveProfileChanges);
    cancelBtn.addEventListener('click', cancelProfileEditing);

    // Keyboard support
    saveBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveProfileChanges();
      }
    });

    cancelBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        cancelProfileEditing();
      }
    });
  }
}

/**
 * Hide save and cancel buttons
 */
function hideProfileActionButtons() {
  const actionsContainer = document.querySelector('.profile-edit-actions');
  if (actionsContainer) {
    actionsContainer.remove();
  }
}

/**
 * Announce changes to screen readers
 * @param {string} message - Message to announce
 */
function announceA11yChange(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.classList.add('sr-only');
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    announcement.remove();
  }, 3000);
}

/**
 * Restore profile data from localStorage and update DOM
 */
function restoreProfileFromStorage() {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) return; // No saved data

  const profileData = JSON.parse(stored);
  const profileTop = document.querySelector('.profile-top');

  if (!profileTop) return;

  // Restore name
  const nameEl = profileTop.querySelector('h1.large');
  if (nameEl && profileData.name) {
    nameEl.textContent = profileData.name;
  }

  // Restore title
  const titleEl = profileTop.querySelector('p.lead');
  if (titleEl && profileData.title) {
    titleEl.textContent = profileData.title;
  }

  // Restore location
  const locationEl = profileTop.querySelector('p:not(.lead)');
  if (locationEl && profileData.location) {
    locationEl.textContent = profileData.location;
  }

  console.log('Profile restored from localStorage:', profileData);
}

/**
 * Initialize profile edit functionality
 */
document.addEventListener('DOMContentLoaded', function () {
  // Check if we're on the profile page
  if (document.querySelector('.profile-top')) {
    // Restore saved profile data from localStorage
    restoreProfileFromStorage();

    // Create and inject edit button
    const editBtn = createEditButton();
    const profileTop = document.querySelector('.profile-top');

    // Create container for edit button
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'profile-edit-btn-container';
    buttonContainer.style.marginTop = '1rem';
    buttonContainer.appendChild(editBtn);

    // Insert after photo actions or at the start of profile-top
    const photoActions = profileTop.querySelector('.photo-actions');
    if (photoActions) {
      photoActions.parentElement.insertBefore(
        buttonContainer,
        photoActions.nextSibling,
      );
    } else {
      profileTop.insertBefore(buttonContainer, profileTop.firstChild);
    }

    // Add click event listener
    editBtn.addEventListener('click', toggleEditMode);

    // Keyboard support (Alt + E to toggle edit mode)
    document.addEventListener('keydown', function (e) {
      if (e.altKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        toggleEditMode();
      }
    });

    console.log('Profile edit module initialized');
  }
});
