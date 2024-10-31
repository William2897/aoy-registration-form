import sgMail from '@sendgrid/mail';
import { Registration } from '../entities/Registration';
import { logger } from '../utils/logger';
import { readFileSync } from 'fs';
import path from 'path';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
  }).format(amount);
};

const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not defined in environment variables.`);
  }
  return value;
};

// Capitalize first letter of each word
const capitalizeWords = (str: string): string => {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

const sendGridApiKey = getEnvVariable('SENDGRID_API_KEY');
sgMail.setApiKey(sendGridApiKey);

export const sendConfirmationEmail = async (registration: Registration) => {
  try {
    const eventDate = '5-8 June, 2025';
    const venue = '*****, Penang';
    const fromEmail = getEnvVariable('SENDGRID_FROM_EMAIL');
    const bannerPath = path.join(__dirname, '../assets/banner.png');
    const bannerContent = readFileSync(bannerPath).toString('base64');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AOY 2025 Registration Confirmation</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.5;
              color: #1a202c;
              background-color: #f7fafc;
            }

            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .banner {
              width: 100%;
              height: auto;
              display: block;
              object-fit: cover;
            }

            .content {
              padding: 32px 24px;
            }

            .section {
              margin-bottom: 32px;
            }

            .header {
              text-align: center;
              margin-bottom: 24px;
            }

            h1 {
              font-size: 28px;
              font-weight: 700;
              color: #1a365d;
              margin-bottom: 24px;
            }

            h2 {
              font-size: 20px;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e2e8f0;
            }

            .details-card {
              background-color: #f8fafc;
              border-radius: 12px;
              border: 1px solid #e2e8f0;
              padding: 24px;
            }

            .event-detail {
              display: flex;
              margin-bottom: 16px;
              align-items: baseline;
            }

            .event-detail:last-child {
              margin-bottom: 0;
            }

            .detail-label {
              width: 120px;
              color: #4a5568;
              font-weight: 500;
            }

            .detail-value {
              flex: 1;
              font-weight: 600;
              color: #2d3748;
            }

            .price-list {
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid #e2e8f0;
            }

            .price-item {
              display: flex;
              justify-content: space-between;
              padding: 16px 24px;
              border-bottom: 1px solid #e2e8f0;
              background-color: #ffffff;
            }

            .price-item:last-child {
              border-bottom: none;
              background-color: #f8fafc;
            }

            .price-label {
              color: #4a5568;
              font-weight: 500;
            }

            .price-value {
              font-weight: 600;
              color: #2d3748;
            }

            .total-row {
              font-size: 18px;
              font-weight: 700;
              color: #2b6cb0;
            }

            @media only screen and (max-width: 600px) {
              .content {
                padding: 24px 16px;
              }

              .detail-label {
                width: 100px;
              }

              .price-item {
                padding: 12px 16px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <img src="cid:banner@aoy2025" alt="AOY 2025 - Midst of the Fire" class="banner">
            
            <div class="content">
              <div class="header">
                <h1>Registration Confirmed!</h1>
                <p>Dear ${registration.fullName},</p>
                <p>Thank you for registering for <strong>AOY 2025</strong>! We're excited to have you join us for this amazing event.</p>
              </div>

              <div class="section">
                <h2>Event Details</h2>
                <div class="details-card">
                  <div class="event-detail">
                    <span class="detail-label">Dates:</span>
                    <span class="detail-value">${eventDate}</span>
                  </div>
                  <div class="event-detail">
                    <span class="detail-label">Venue:</span>
                    <span class="detail-value">${venue}</span>
                  </div>
                  <div class="event-detail">
                    <span class="detail-label">Registration ID:</span>
                    <span class="detail-value" style="font-family: monospace;">${registration.id}</span>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Registration Details</h2>
                <div class="price-list">
                  <div class="price-item">
                    <span class="price-label">Category: </span>
                    <span class="price-value">${capitalizeWords(registration.occupationType)}</span>
                  </div>
                  <div class="price-item">
                    <span class="price-label">Base Price: </span>
                    <span class="price-value">${formatCurrency(registration.basePrice)}</span>
                  </div>
                  ${registration.hasKids ? `
                  <div class="price-item">
                    <span class="price-label">Kids Total: </span>
                    <span class="price-value">${formatCurrency(registration.kidsTotal)}</span>
                  </div>` : ''}
                  ${registration.tshirtTotal > 0 ? `
                  <div class="price-item">
                    <span class="price-label">T-Shirt Total: </span>
                    <span class="price-value">${formatCurrency(registration.tshirtTotal)}</span>
                  </div>` : ''}
                  <div class="price-item">
                    <span class="price-label">Subtotal: </span>
                    <span class="price-value">${formatCurrency(registration.subtotal)}</span>
                  </div>
                  <div class="price-item">
                    <span class="price-label">Early Bird Discount: </span>
                    <span class="price-value">- ${formatCurrency(registration.discount)}</span>
                  </div>
                  <div class="price-item total-row">
                    <span class="price-label">Total Amount: </span>
                    <span class="price-value">${formatCurrency(registration.finalTotal)}</span>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Next Steps</h2>
                <div class="details-card">
                  <ol style="padding-left: 24px;">
                    <li style="margin-bottom: 12px;">Save this email for your reference.</li>
                    <li style="margin-bottom: 12px;">Attend the event on the scheduled dates.</li>
                    <li>Join our Facebook group for updates: <a href="https://www.facebook.com/armyofyouthasia/" style="color: #2b6cb0;">AOY 2025 Community</a></li>
                  </ol>
                </div>

                <div style="text-align: center; margin-top: 32px;">
                  <p style="margin-bottom: 8px; color: #4a5568;">If you have any questions, please contact us:</p>
                  <p>
                    <a href="mailto:info@aoyweb.org" style="color: #2b6cb0; text-decoration: none;">info@aoyweb.org</a> | 
                    <span>+60 12-345 6789</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const msg = {
      to: registration.email,
      from: fromEmail,
      subject: 'Welcome to AOY 2025! Registration Confirmed',
      html: htmlContent.trim(),
      attachments: [
        {
          content: bannerContent,
          filename: 'banner.png',
          type: 'image/png',
          disposition: 'inline',
          content_id: 'banner@aoy2025',
        },
      ],
    };

    await sgMail.send(msg);
    logger.info(`Confirmation email sent successfully to ${registration.email} (ID: ${registration.id})`);
  } catch (error) {
    logger.error(`Failed to send confirmation email to ${registration.email}:`, error);
    throw error;
  }
};