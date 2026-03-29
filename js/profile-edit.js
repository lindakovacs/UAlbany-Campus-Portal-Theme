/**
 * Profile Edit Module
 * Provides profile editing, experience/education CRUD, and social media management
 * Functionality: Form state management, validation, localStorage persistence, event handling
 * Uses: Variables, Objects, Events, Functions, Loops, localStorage, DOM manipulation
 */

// Storage keys for profile data
const PROFILE_STORAGE_KEY = 'profileData';
const EXPERIENCE_STORAGE_KEY = 'experienceList';
const EDUCATION_STORAGE_KEY = 'educationList';
const CURRENT_USER_ID = 'currentUser';

// Profile form state constant
const profileFormState = {
  name: '',
  email: '',
  phone: '',
  bio: '',
  status: '',
  company: '',
  website: '',
  location: '',
  skills: '',
  githubusername: '',
  social: {
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: '',
  },
};

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
        status: '',
        company: '',
        website: '',
        email: '',
        phone: '',
        social: {
          twitter: '',
          facebook: '',
          linkedin: '',
          youtube: '',
          instagram: '',
        },
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

/**
 * EXPERIENCE MANAGEMENT FUNCTIONS
 */

/**
 * Get experience list from localStorage
 * @returns {array} - Array of experience objects
 */
function getExperienceList() {
  const stored = localStorage.getItem(EXPERIENCE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save experience list to localStorage
 * @param {array} experiences - Array of experience objects
 */
function saveExperienceList(experiences) {
  localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(experiences));
  console.log('Experiences saved:', experiences);
}

/**
 * Add experience with validation
 * @param {object} experienceData - Experience form data
 */
function addExperience(experienceData) {
  if (
    !experienceData.title ||
    !experienceData.company ||
    !experienceData.from
  ) {
    alert('Title, Company, and From Date are required');
    return false;
  }

  const experiences = getExperienceList();
  const newExp = {
    id: Date.now().toString(),
    ...experienceData,
    createdAt: new Date().toISOString(),
  };

  experiences.unshift(newExp); // Add to beginning
  saveExperienceList(experiences);
  renderExperienceList();
  announceA11yChange('Experience added successfully');
  return true;
}

/**
 * Delete experience with confirmation
 * @param {string} expId - Experience ID to delete
 */
function deleteExperience(expId) {
  if (!confirm('Are you sure you want to delete this experience?')) return;

  let experiences = getExperienceList();
  experiences = experiences.filter((exp) => exp.id !== expId);
  saveExperienceList(experiences);
  renderExperienceList();
  announceA11yChange('Experience deleted');
}

/**
 * Render experience list in DOM
 */
/**
 * Format date to readable string
 * @param {string} dateStr - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

/**
 * Render experience list in DOM
 */
function renderExperienceList() {
  const experiences = getExperienceList();
  const container = document.getElementById('profile-exp');

  if (!container) return;

  // Remove only existing experience items (class="experience-list div")
  const existingItems = container.querySelectorAll('.exp-item');
  existingItems.forEach((item) => item.remove());

  // Add new experience items
  experiences.forEach((exp) => {
    const expDiv = document.createElement('div');
    expDiv.className = 'exp-item';
    expDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; gap: 1rem;">
        <div style="flex: 1;">
          <h3 class="text-dark">${exp.company}</h3>
          <p><strong>Position:</strong> ${exp.title}</p>
          ${exp.location ? `<p><strong>Location:</strong> ${exp.location}</p>` : ''}
          <p>
            <strong>From:</strong> ${formatDate(exp.from)}
            ${exp.to ? `<strong>To:</strong> ${formatDate(exp.to)}` : '<strong>To:</strong> Now'}
          </p>
          ${exp.description ? `<p><strong>Description:</strong> ${exp.description}</p>` : ''}
        </div>
        <button class="btn btn-danger btn-sm" onclick="deleteExperience('${exp.id}')" style="white-space: nowrap; margin-top: 0.5rem;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
      <hr style="margin: 1rem 0;">
    `;
    container.appendChild(expDiv);
  });
}

/**
 * Render education list in DOM
 */
function renderEducationList() {
  const educations = getEducationList();
  const container = document.getElementById('profile-edu');

  if (!container) return;

  // Remove only existing education items
  const existingItems = container.querySelectorAll('.edu-item');
  existingItems.forEach((item) => item.remove());

  // Add new education items
  educations.forEach((edu) => {
    const eduDiv = document.createElement('div');
    eduDiv.className = 'edu-item';
    eduDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; gap: 1rem;">
        <div style="flex: 1;">
          <h3 class="text-dark">${edu.school}</h3>
          <p><strong>Degree:</strong> ${edu.degree}</p>
          ${edu.fieldofstudy ? `<p><strong>Field of Study:</strong> ${edu.fieldofstudy}</p>` : ''}
          <p>
            <strong>From:</strong> ${formatDate(edu.from)}
            ${edu.to ? `<strong>To:</strong> ${formatDate(edu.to)}` : '<strong>To:</strong> Now'}
          </p>
          ${edu.description ? `<p><strong>Description:</strong> ${edu.description}</p>` : ''}
        </div>
        <button class="btn btn-danger btn-sm" onclick="deleteEducation('${edu.id}')" style="white-space: nowrap; margin-top: 0.5rem;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
      <hr style="margin: 1rem 0;">
    `;
    container.appendChild(eduDiv);
  });
}

/**
 * EDUCATION MANAGEMENT FUNCTIONS
 */

/**
 * Get education list from localStorage
 * @returns {array} - Array of education objects
 */
function getEducationList() {
  const stored = localStorage.getItem(EDUCATION_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save education list to localStorage
 * @param {array} educations - Array of education objects
 */
function saveEducationList(educations) {
  localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify(educations));
  console.log('Education saved:', educations);
}

/**
 * Add education with validation
 * @param {object} educationData - Education form data
 */
function addEducation(educationData) {
  if (
    !educationData.school ||
    !educationData.degree ||
    !educationData.fieldofstudy ||
    !educationData.from
  ) {
    alert('School, Degree, Field of Study, and From Date are required');
    return false;
  }

  const educations = getEducationList();
  const newEdu = {
    id: Date.now().toString(),
    ...educationData,
    createdAt: new Date().toISOString(),
  };

  educations.unshift(newEdu); // Add to beginning
  saveEducationList(educations);
  renderEducationList();
  announceA11yChange('Education added successfully');
  return true;
}

/**
 * Delete education with confirmation
 * @param {string} eduId - Education ID to delete
 */
function deleteEducation(eduId) {
  if (!confirm('Are you sure you want to delete this education?')) return;

  let educations = getEducationList();
  educations = educations.filter((edu) => edu.id !== eduId);
  saveEducationList(educations);
  renderEducationList();
  announceA11yChange('Education deleted');
}

/**
 * Toggle Add Experience Form visibility
 */
function toggleAddExperienceForm() {
  const form = document.getElementById('add-experience-form');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    // Clear form if showing
    if (form.style.display === 'block') {
      form.reset();
    }
  }
}

/**
 * Submit Add Experience Form
 */
function submitAddExperienceForm() {
  const title = document.getElementById('exp-title')?.value.trim();
  const company = document.getElementById('exp-company')?.value.trim();
  const location = document.getElementById('exp-location')?.value.trim();
  const from = document.getElementById('exp-from')?.value;
  const to = document.getElementById('exp-to')?.value;
  const current = document.getElementById('exp-current')?.checked;
  const description = document.getElementById('exp-description')?.value.trim();

  const experienceData = {
    title,
    company,
    location,
    from,
    to: current ? null : to,
    current,
    description,
  };

  if (addExperience(experienceData)) {
    toggleAddExperienceForm();
    document.getElementById('add-experience-form').reset();
  }
}

/**
 * Toggle Add Education Form visibility
 */
function toggleAddEducationForm() {
  const form = document.getElementById('add-education-form');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    // Clear form if showing
    if (form.style.display === 'block') {
      form.reset();
    }
  }
}

/**
 * Submit Add Education Form
 */
function submitAddEducationForm() {
  const school = document.getElementById('edu-school')?.value.trim();
  const degree = document.getElementById('edu-degree')?.value.trim();
  const fieldofstudy = document
    .getElementById('edu-fieldofstudy')
    ?.value.trim();
  const from = document.getElementById('edu-from')?.value;
  const to = document.getElementById('edu-to')?.value;
  const current = document.getElementById('edu-current')?.checked;
  const description = document.getElementById('edu-description')?.value.trim();

  const educationData = {
    school,
    degree,
    fieldofstudy,
    from,
    to: current ? null : to,
    current,
    description,
  };

  if (addEducation(educationData)) {
    toggleAddEducationForm();
    document.getElementById('add-education-form').reset();
  }
}

/**
 * Initialize experience and education rendering on page load
 */
document.addEventListener('DOMContentLoaded', function () {
  renderExperienceList();
  renderEducationList();
});
