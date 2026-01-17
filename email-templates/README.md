# Email Template Setup Guide

## How to Update the Confirmation Email in Supabase

### Step 1: Copy the Template
1. Open [`email-templates/confirm-signup.html`](file:///c:/Users/moria/Desktop/Websites/rabuste-coffee/email-templates/confirm-signup.html)
2. Copy the **entire HTML content**

### Step 2: Update in Supabase Dashboard
1. Go to **Supabase Dashboard**
2. Navigate to **Authentication** → **Email Templates**
3. Click on **"Confirm signup"** template
4. **Delete the default content**
5. **Paste** the new custom template
6. Click **Save**

### Step 3: Test
1. Sign up with a new email
2. Check your inbox
3. The email should now have:
   - ✅ Rabuste Coffee branding
   - ✅ Coffee-themed colors (brown/cream)
   - ✅ Beautiful styled button
   - ✅ "What's waiting for you" section
   - ✅ Professional footer

## Template Features

### Visual Design
- **Header**: Gradient brown background with Rabuste logo
- **Main Content**: Clean white background with coffee emoji
- **CTA Button**: Elegant rounded button with gradient
- **Features Section**: Icons showing what users can access
- **Footer**: Dark footer with copyright

### Brand Colors Used
- Primary Brown: `#8B6F47`
- Dark Brown: `#6d5638`
- Cream Background: `#F5F0EB`
- Dark Text: `#262626`
- Light Text: `#78716c`

### Template Variables
The template uses Supabase's built-in variable:
- `{{ .ConfirmationURL }}` - Auto-generated verification link

## Important Notes

⚠️ **Don't modify** `{{ .ConfirmationURL }}` - this is required by Supabase

✅ **Safe to customize:**
- Text content
- Colors
- Layout
- Add/remove sections
- Font styles

## Troubleshooting

**Email looks broken?**
- Make sure inline styles are preserved
- Check that all `<div>` tags are properly closed
- Verify `{{ .ConfirmationURL }}` syntax is exact

**Button not working?**
- The `{{ .ConfirmationURL }}` must be in the `href` attribute
- Don't add quotes around it in the template

**Colors don't match?**
- Use the brand colors listed above
- Maintain the brown/cream theme
