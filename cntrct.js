    document.querySelector('form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        const result = await response.json();
        if (result.ok) {
            alert('Message sent successfully!');
            form.reset();
        } else {
            alert('There was an error sending your message. Please try again later.');
        }
    });
