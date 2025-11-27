// scripts.js
// This file contains all the JavaScript code to make my portfolio interactive.
// It handles switching between sections (like a Single-Page App),
// filtering my projects, and submitting my contact form.

// Wait until the entire HTML document is fully loaded and ready.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GATHER ALL THE IMPORTANT ELEMENTS ---
    // We do this at the start so we can use them later.

    // Get all navigation links (Home, About, etc.)
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get all the main content sections (Home, About, etc.)
    const sections = document.querySelectorAll('main .section');
    
    // Get the contact form element
    const contactForm = document.getElementById('contact-form');
    
    // Get the <p> tag used to show messages (like "Message Sent!")
    const formMessage = document.getElementById('form-message');
    
    // Get the "Send Message" button
    const submitButton = document.getElementById('submit-button');

    // --- 2. NAVIGATION LOGIC (Showing/Hiding Sections) ---

    /**
     * This function handles switching the "active" section.
     * @param {string} targetId - The ID of the section to show (e.g., "home", "about").
     */
    function navigateTo(targetId) {
        
        // Loop through all sections
        sections.forEach(section => {
            // If this section's ID matches the one we want to show...
            if (section.id === targetId) {
                // ...add the 'active' class (which CSS will use to show it)
                section.classList.add('active');
            } else {
                // ...otherwise, remove the 'active' class to hide it.
                section.classList.remove('active');
            }
        });

        // Loop through all navigation links to update their style
        navLinks.forEach(link => {
            // If this link's 'data-target' (from the HTML) matches the section we just showed...
            if (link.dataset.target === targetId) {
                // ...add the 'active' class (to make it look "selected," e.g., underline or bold)
                link.classList.add('active');
            } else {
                // ...otherwise, remove the 'active' class.
                link.classList.remove('active');
            }
        });
        
        // Scroll back to the top of the page every time we switch sections.
        window.scrollTo(0, 0);
    }

    // Add a "click" listener to every navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Stop the link from trying to jump to an anchor (its default behavior)
            e.preventDefault();
            
            // Get the target section ID from the link's 'data-target' attribute
            const targetId = link.dataset.target;
            
            // Call our function to show the correct section
            navigateTo(targetId);
        });
    });

    // --- 3. PROJECT FILTERING LOGIC ---

    // Get all the filter buttons (All, Web, Design, Other)
    const filterButtons = document.querySelectorAll('#projects .filter-btn');
    
    // Get all the project cards
    const projectCards = document.querySelectorAll('#projects .project-card');

    // Add a "click" listener to every filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the category to filter by from the button's 'data-category' attribute
            const filterCategory = button.dataset.category;

            // First, remove the 'active' class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Then, add the 'active' class to the specific button that was just clicked
            button.classList.add('active');

            // Loop through all the project cards to decide whether to show or hide them
            projectCards.forEach(card => {
                // Get the card's own category from its 'data-category' attribute
                const cardCategory = card.dataset.category;
                
                // Show the card if the filter is "all" OR if the card's category matches the filter
                if (filterCategory === 'all' || filterCategory === cardCategory) {
                    card.style.display = 'block'; // Show the card
                } else {
                    card.style.display = 'none'; // Hide the card
                }
            });
        });
    });

    // --- 4. CONTACT FORM SUBMISSION (AJAX) ---
    // "AJAX" means submitting the form without a full page refresh.

    // Only run this code if the contact form actually exists on the page
    if (contactForm) {
        // Add a "submit" listener to the form
        contactForm.addEventListener('submit', async (e) => {
            // Stop the form from doing a default full-page submission
            e.preventDefault();

            // --- 4a. Form Validation ---
            // Get the current values from the form fields and trim whitespace
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // A simple rule (Regex) to check for a basic email structure
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Get the submission URL from the form's 'action' attribute
            const formUrl = contactForm.action;

            // Clear any old messages (success or error)
            formMessage.textContent = '';
            formMessage.classList.remove('text-red-600', 'text-green-600');

            // Check if any fields are empty
            if (name === '' || email === '' || message === '') {
                formMessage.textContent = 'Please fill out all fields.';
                formMessage.classList.add('text-red-600'); // Show error in red
                return; // Stop the function here
            }

            // Check if the email is in a valid format
            if (!emailPattern.test(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.classList.add('text-red-600'); // Show error in red
                return; // Stop the function here
            }

            // --- 4b. Form Submission ---
            
            // Disable the button to prevent multiple submissions
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Show a neutral message
            formMessage.textContent = 'Connecting to server...';
            formMessage.classList.add('text-slate-600');

            // Create a FormData object, which easily gathers all form fields
            const formData = new FormData(contactForm);

            // Use a 'try...catch' block to handle potential network errors
            try {
                // Send the form data to the URL (getform.io) asynchronously
                const response = await fetch(formUrl, {
                    method: 'POST',
                    body: formData,
                });

                // Check if the submission was successful (e.g., HTTP 200 OK)
                if (response.ok) {
                    // Success!
                    formMessage.textContent = 'Message Sent Successfully! Thank you.';
                    formMessage.classList.remove('text-slate-600', 'text-red-600');
                    formMessage.classList.add('text-green-600'); // Show success in green
                    contactForm.reset(); // Clear the form fields
                } else {
                    // The server responded with an error (e.g., 404, 500)
                    formMessage.textContent = 'Oops! There was an issue sending your message. Please try again.';
                    formMessage.classList.remove('text-slate-600', 'text-green-600');
                    formMessage.classList.add('text-red-600'); // Show error in red
                }
            } catch (error) {
                // A network error occurred (e.g., user is offline)
                formMessage.textContent = 'A network error occurred. Check your internet connection.';
                formMessage.classList.remove('text-slate-600', 'text-green-600');
                formMessage.classList.add('text-red-600'); // Show error in red
                console.error('Form submission error:', error); // Log the error for debugging
            } finally {
                // This 'finally' block runs whether the 'try' or 'catch' was executed
                // Re-enable the button and reset its text so the user can try again
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    }
});