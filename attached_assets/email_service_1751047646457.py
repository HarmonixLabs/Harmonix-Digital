import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
import requests

class EmailService:
    """Email service for sending verification and notification emails"""
    
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@harmonixdigital.com')
        self.from_name = os.getenv('FROM_NAME', 'HARMONIX Digital')
        self.base_url = os.getenv('FRONTEND_URL', 'https://harmonixdigital.com')
        
    def send_email(self, to_email, subject, html_content, text_content=None):
        """Send email using SMTP"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email
            
            # Add text version if provided
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)
            
            # Add HTML version
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            current_app.logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            current_app.logger.error(f"Failed to send email to {to_email}: {e}")
            return False
    
    def send_verification_email(self, email, name, token):
        """Send email verification email"""
        verification_url = f"{self.base_url}/verify-email?token={token}"
        
        subject = "Verify Your HARMONIX Account"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
                body {{ font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #0F1115; color: #F2F2F5; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
                .header {{ text-align: center; margin-bottom: 40px; }}
                .logo {{ color: #D4AF37; font-size: 32px; font-weight: bold; margin-bottom: 10px; }}
                .tagline {{ color: #B4FFE3; font-size: 14px; }}
                .content {{ background-color: #1A1A1A; padding: 40px; border-radius: 12px; border: 1px solid #342C52; }}
                .title {{ color: #D4AF37; font-size: 24px; font-weight: bold; margin-bottom: 20px; }}
                .text {{ color: #F2F2F5; line-height: 1.6; margin-bottom: 20px; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%); color: #0F1115; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 40px; color: #B4FFE3; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">HARMONIX</div>
                    <div class="tagline">Intelligent Systems for Timeless Sovereignty</div>
                </div>
                
                <div class="content">
                    <h1 class="title">Welcome to HARMONIX, {name}!</h1>
                    
                    <p class="text">
                        Thank you for joining HARMONIX Digital. You're now part of an exclusive community building the future of AI-powered business automation.
                    </p>
                    
                    <p class="text">
                        To complete your registration and start your 7-day free trial, please verify your email address by clicking the button below:
                    </p>
                    
                    <div style="text-align: center;">
                        <a href="{verification_url}" class="button">Verify Email Address</a>
                    </div>
                    
                    <p class="text">
                        Once verified, you'll have full access to:
                        <br>• 12 specialized AI agents
                        <br>• Agent marketplace and builder
                        <br>• SŌL unified orchestration interface
                        <br>• Complete business automation suite
                    </p>
                    
                    <p class="text">
                        If you didn't create this account, please ignore this email.
                    </p>
                </div>
                
                <div class="footer">
                    <p>This verification link expires in 24 hours.</p>
                    <p>© 2024 HARMONIX Digital. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to HARMONIX, {name}!
        
        Thank you for joining HARMONIX Digital. To complete your registration and start your 7-day free trial, please verify your email address by visiting:
        
        {verification_url}
        
        This verification link expires in 24 hours.
        
        If you didn't create this account, please ignore this email.
        
        © 2024 HARMONIX Digital. All rights reserved.
        """
        
        return self.send_email(email, subject, html_content, text_content)
    
    def send_password_reset_email(self, email, name, token):
        """Send password reset email"""
        reset_url = f"{self.base_url}/reset-password?token={token}"
        
        subject = "Reset Your HARMONIX Password"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
                body {{ font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #0F1115; color: #F2F2F5; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
                .header {{ text-align: center; margin-bottom: 40px; }}
                .logo {{ color: #D4AF37; font-size: 32px; font-weight: bold; margin-bottom: 10px; }}
                .tagline {{ color: #B4FFE3; font-size: 14px; }}
                .content {{ background-color: #1A1A1A; padding: 40px; border-radius: 12px; border: 1px solid #342C52; }}
                .title {{ color: #D4AF37; font-size: 24px; font-weight: bold; margin-bottom: 20px; }}
                .text {{ color: #F2F2F5; line-height: 1.6; margin-bottom: 20px; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%); color: #0F1115; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 40px; color: #B4FFE3; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">HARMONIX</div>
                    <div class="tagline">Intelligent Systems for Timeless Sovereignty</div>
                </div>
                
                <div class="content">
                    <h1 class="title">Password Reset Request</h1>
                    
                    <p class="text">
                        Hi {name},
                    </p>
                    
                    <p class="text">
                        We received a request to reset your HARMONIX account password. Click the button below to create a new password:
                    </p>
                    
                    <div style="text-align: center;">
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </div>
                    
                    <p class="text">
                        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                    </p>
                    
                    <p class="text">
                        For security reasons, this link will expire in 1 hour.
                    </p>
                </div>
                
                <div class="footer">
                    <p>This reset link expires in 1 hour.</p>
                    <p>© 2024 HARMONIX Digital. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Password Reset Request
        
        Hi {name},
        
        We received a request to reset your HARMONIX account password. Visit the following link to create a new password:
        
        {reset_url}
        
        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
        
        For security reasons, this link will expire in 1 hour.
        
        © 2024 HARMONIX Digital. All rights reserved.
        """
        
        return self.send_email(email, subject, html_content, text_content)
    
    def send_welcome_email(self, email, name):
        """Send welcome email after trial signup"""
        subject = "Welcome to HARMONIX - Your AI Revolution Begins Now"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to HARMONIX</title>
            <style>
                body {{ font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #0F1115; color: #F2F2F5; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
                .header {{ text-align: center; margin-bottom: 40px; }}
                .logo {{ color: #D4AF37; font-size: 32px; font-weight: bold; margin-bottom: 10px; }}
                .tagline {{ color: #B4FFE3; font-size: 14px; }}
                .content {{ background-color: #1A1A1A; padding: 40px; border-radius: 12px; border: 1px solid #342C52; }}
                .title {{ color: #D4AF37; font-size: 24px; font-weight: bold; margin-bottom: 20px; }}
                .text {{ color: #F2F2F5; line-height: 1.6; margin-bottom: 20px; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%); color: #0F1115; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
                .feature {{ background-color: #0F1115; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #D4AF37; }}
                .footer {{ text-align: center; margin-top: 40px; color: #B4FFE3; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">HARMONIX</div>
                    <div class="tagline">Intelligent Systems for Timeless Sovereignty</div>
                </div>
                
                <div class="content">
                    <h1 class="title">Welcome to the Future, {name}!</h1>
                    
                    <p class="text">
                        Congratulations! You've just unlocked access to the most advanced AI agent orchestration platform ever created. Your 7-day free trial has begun.
                    </p>
                    
                    <div style="text-align: center;">
                        <a href="{self.base_url}/dashboard" class="button">Enter Your Dashboard</a>
                    </div>
                    
                    <div class="feature">
                        <strong style="color: #D4AF37;">🤖 12 Specialized AI Agents</strong><br>
                        Sales, Marketing, HR, Finance, and more - each expertly trained for specific business functions.
                    </div>
                    
                    <div class="feature">
                        <strong style="color: #D4AF37;">🎯 SŌL Unified Interface</strong><br>
                        Command all agents from one powerful orchestration center. True AI sovereignty.
                    </div>
                    
                    <div class="feature">
                        <strong style="color: #D4AF37;">🛠️ Agent Builder</strong><br>
                        Create, customize, and deploy your own AI agents with our drag-and-drop builder.
                    </div>
                    
                    <div class="feature">
                        <strong style="color: #D4AF37;">🏪 NFT Marketplace</strong><br>
                        Own, trade, and monetize AI agents as digital assets on the blockchain.
                    </div>
                    
                    <p class="text">
                        <strong>Your trial includes:</strong><br>
                        ✓ Full access to all 12 agents<br>
                        ✓ Unlimited agent interactions<br>
                        ✓ Agent builder and customization<br>
                        ✓ Priority support<br>
                        ✓ No setup fees
                    </p>
                    
                    <p class="text">
                        Ready to revolutionize your business? Your AI agents are waiting.
                    </p>
                </div>
                
                <div class="footer">
                    <p>Questions? Reply to this email or visit our support center.</p>
                    <p>© 2024 HARMONIX Digital. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(email, subject, html_content)
    
    def send_trial_ending_email(self, email, name, days_left):
        """Send trial ending notification"""
        subject = f"Your HARMONIX Trial Ends in {days_left} Days"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Trial Ending Soon</title>
            <style>
                body {{ font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #0F1115; color: #F2F2F5; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
                .header {{ text-align: center; margin-bottom: 40px; }}
                .logo {{ color: #D4AF37; font-size: 32px; font-weight: bold; margin-bottom: 10px; }}
                .content {{ background-color: #1A1A1A; padding: 40px; border-radius: 12px; border: 1px solid #342C52; }}
                .title {{ color: #D4AF37; font-size: 24px; font-weight: bold; margin-bottom: 20px; }}
                .text {{ color: #F2F2F5; line-height: 1.6; margin-bottom: 20px; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%); color: #0F1115; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
                .urgency {{ background-color: #342C52; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 40px; color: #B4FFE3; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">HARMONIX</div>
                </div>
                
                <div class="content">
                    <h1 class="title">Don't Lose Your AI Advantage</h1>
                    
                    <p class="text">
                        Hi {name},
                    </p>
                    
                    <div class="urgency">
                        <strong style="color: #D4AF37; font-size: 18px;">Your trial ends in {days_left} days</strong>
                    </div>
                    
                    <p class="text">
                        You've experienced the power of HARMONIX. Your AI agents have been working tirelessly to transform your business operations.
                    </p>
                    
                    <p class="text">
                        Continue your journey to AI sovereignty. Upgrade now and keep your competitive edge.
                    </p>
                    
                    <div style="text-align: center;">
                        <a href="{self.base_url}/pricing" class="button">Upgrade Now</a>
                    </div>
                    
                    <p class="text">
                        <strong>What you'll keep:</strong><br>
                        ✓ All 12 specialized AI agents<br>
                        ✓ SŌL unified orchestration<br>
                        ✓ Agent builder and marketplace<br>
                        ✓ Priority support<br>
                        ✓ Advanced analytics
                    </p>
                </div>
                
                <div class="footer">
                    <p>© 2024 HARMONIX Digital. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(email, subject, html_content)

