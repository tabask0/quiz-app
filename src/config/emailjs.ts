// EmailJS Configuration
// Get these values from https://www.emailjs.com/

export const EMAILJS_CONFIG = {
  // Replace these with your actual EmailJS credentials
  SERVICE_ID: "service_phlnxep", // Your EmailJS service ID
  COMPLETION_TEMPLATE_ID: "template_1hp26nh", // Your EmailJS completion template ID
  TERMINATION_TEMPLATE_ID: "template_syq6m43", // Your EmailJS termination template ID
  PUBLIC_KEY: "YuDSusaOKA9KG3ye3", // Your EmailJS public key

  // Your email address to receive notifications
  RECIPIENT_EMAIL: "bucur37@gmail.com", // Replace with your email
};

// Instructions for setup:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Create a new service (Gmail, Outlook, etc.)
// 3. Create an email template with the following variables:
//    - {{to_email}}
//    - {{candidate_name}}
//    - {{candidate_email}}
//    - {{score}}
//    - {{total_questions}}
//    - {{percentage}}
//    - {{correct_answers}}
//    - {{incorrect_answers}}
//    - {{completion_time}}
//    - {{termination_reason}}
//    - {{termination_time}}
//    - {{questions_answered}}
//    - {{partial_score}}
//    - {{detailed_results}}
//    - {{message}}
// 4. Copy your Service ID, Template ID, and Public Key
// 5. Replace the values above with your actual credentials
// 6. Replace the recipient email with your email address
