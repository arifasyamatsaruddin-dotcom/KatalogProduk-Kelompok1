document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-contact-form]');
  const statusMessage = document.querySelector('[data-contact-status]');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      // Button loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'TRANSMITTING... <span class="material-symbols-outlined text-[18px] animate-spin">sync</span>';
      }

      const response = await submitContact(payload);
      
      // Success feedback
      if (window.showToast) {
        window.showToast(response.message || 'Transmission Received. Message dispatched.', 'success');
      } else {
        setMessage(statusMessage, response.message || 'Message sent successfully.', 'success');
      }

      form.reset();
    } catch (error) {
      // Error feedback
      if (window.showToast) {
        window.showToast(error.message || 'Transmission failure.', 'error');
      } else {
        setMessage(statusMessage, error.message, 'error');
      }
    } finally {
      // Restore button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
});
