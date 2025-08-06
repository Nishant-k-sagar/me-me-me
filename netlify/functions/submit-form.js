// File: netlify/functions/submit-form.js

export async function handler(event) {
  // We only care about POST requests from our form
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Get the secret Formspree URL from the environment variables
  const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;

  if (!formspreeEndpoint) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server configuration error.' }),
    };
  }

  try {
    const formData = JSON.parse(event.body);

    // Send the data to the real Formspree endpoint
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Success!
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Thank you for your message!' }),
      };
    } else {
      // Formspree returned an error
      const errorData = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: errorData.error || 'Something went wrong.' }),
      };
    }
  } catch (error) {
    // General server error
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error submitting form.' }),
    };
  }
}