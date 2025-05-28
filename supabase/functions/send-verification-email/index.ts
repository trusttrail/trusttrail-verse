
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  code: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: VerificationEmailRequest = await req.json();

    // Email content with verification code
    const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Email Verification - TrustRail</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TrustRail</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Email Verification Required</p>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email Address</h2>
            
            <p style="margin-bottom: 20px;">Hello,</p>
            
            <p style="margin-bottom: 20px;">Thank you for signing up with TrustRail. To complete your registration and start submitting reviews, please verify your email address using the verification code below:</p>
            
            <div style="background: #f3f4f6; border: 2px dashed #9ca3af; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: #374151;">Your Verification Code</h3>
                <div style="font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</div>
            </div>
            
            <p style="margin-bottom: 20px;">This verification code is valid for <strong>30 minutes</strong> only. If the code expires, you can request a new one from the verification page.</p>
            
            <p style="margin-bottom: 20px;">Enter this code on the verification page to complete your email verification and gain access to submit reviews on our platform.</p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;"><strong>Security Note:</strong> If you didn't request this verification code, please ignore this email. Your account remains secure.</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">Best regards,<br>The TrustRail Team</p>
            
            <p style="font-size: 12px; color: #9ca3af; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <strong>Please do not reply to this E-mail as it is sent from a generic ID and is not monitored for responses.</strong>
            </p>
        </div>
    </body>
    </html>
    `;

    // Using a generic email sending service (you'll need to configure this with your preferred provider)
    // For now, I'll create the structure - you'll need to add your email provider credentials
    const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: Deno.env.get("EMAILJS_SERVICE_ID"),
        template_id: Deno.env.get("EMAILJS_TEMPLATE_ID"),
        user_id: Deno.env.get("EMAILJS_USER_ID"),
        template_params: {
          from_email: "hellotrustrail@gmail.com",
          from_name: "TrustRail",
          to_email: email,
          subject: "Email Verification Code - TrustRail",
          html_content: emailHTML
        }
      })
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to send email");
    }

    console.log("Verification email sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
