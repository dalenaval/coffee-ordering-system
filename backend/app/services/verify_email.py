import resend
from app.core.config import RESEND_API_KEY, FRONTEND_URL

resend.api_key = RESEND_API_KEY

def send_verification_email(email, token):
    verification_link = f"{FRONTEND_URL}/login?email_verify={token}"
    
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#4b2e1e;">Kape Nga Ni</h2>
        <p>Thank you for registering with Kape Nga Ni.</p>

        <p>Please click the link below to verify your email address:</p>
        <a href="{verification_link}" style="display:inline-block;margin-top:16px;padding:12px 24px;background-color:#4b2e1e;color:#fff;text-decoration:none;border-radius:4px;">
            Verify Email
        </a>
        <p>This link will expire in 24 hours.</p>

        <p style="margin-top:24px;color:#666;">
            If you did not create an account, please ignore this email.
        </p>    
    </div>
    """

    return resend.Emails.send({
        "from": "Kape Nga Ni <hello@kapengani.site>",
        "to": email,
        "subject": "Verify your email address",
        "html": html
    })