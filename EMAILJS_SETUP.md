# EmailJS Setup Guide

This guide will help you set up EmailJS to receive email notifications when candidates complete the quiz or get terminated.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Create an Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

## Step 3: Create Email Templates

### Template 1: Quiz Completion

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

**Subject:** Quiz Completed - {{candidate_name}} - Score: {{percentage}}%

**Body:**

```
Quiz Completion Notification

Candidate: {{candidate_name}}
Email: {{candidate_email}}
Completion Time: {{completion_time}}

SCORE SUMMARY:
- Total Questions: {{total_questions}}
- Correct Answers: {{correct_answers}}
- Incorrect Answers: {{incorrect_answers}}
- Final Score: {{score}}/{{total_questions}}
- Percentage: {{percentage}}%

DETAILED RESULTS:
{{detailed_results}}

Message: {{message}}
```

4. Save the template and note down the **Template ID**

### Template 2: Quiz Termination

1. Create another template for terminations
2. Use this template content:

**Subject:** Quiz Terminated - {{candidate_name}} - Reason: {{termination_reason}}

**Body:**

```
Quiz Termination Notification

Candidate: {{candidate_name}}
Email: {{candidate_email}}
Termination Time: {{termination_time}}
Termination Reason: {{termination_reason}}

PROGRESS AT TERMINATION:
- Questions Answered: {{questions_answered}}/{{total_questions}}
- Partial Score: {{partial_score}}%

Message: {{message}}
```

## Step 4: Get Your Public Key

1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** (also called User ID)

## Step 5: Update Configuration

1. Open `src/config/emailjs.ts`
2. Replace the placeholder values:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: "your_actual_service_id_here",
  TEMPLATE_ID: "your_actual_template_id_here",
  PUBLIC_KEY: "your_actual_public_key_here",
  RECIPIENT_EMAIL: "your-email@example.com",
};
```

## Step 6: Test the Setup

1. Start your development server: `npm run dev`
2. Complete a quiz or trigger a termination
3. Check your email for notifications

## Troubleshooting

- Make sure all IDs are correct (no extra spaces or quotes)
- Check that your email service is properly connected
- Verify that the template variables match exactly
- Check the browser console for any error messages

## Free Tier Limits

EmailJS free tier includes:

- 200 emails per month
- 2 email services
- 2 email templates

This should be sufficient for testing and small-scale usage.
