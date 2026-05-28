const { Resend } = require('resend');
const Inquiry = require('../models/Inquiry');

const resend = new Resend(process.env.EMAIL_PASS);

const normalizeInquiryStatus = (status) => {
  if (!status) {
    return 'New';
  }

  const normalized = status.toString().trim().toLowerCase();
  const statusMap = {
    new: 'New',
    contacted: 'Contacted',
    converted: 'Converted',
    closed: 'Closed'
  };

  return statusMap[normalized] || 'New';
};

const createInquiry = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const inquiry = new Inquiry({
      name,
      phone,
      message: message || '',
      status: normalizeInquiryStatus(req.body.status)
    });

    await inquiry.save();

    res.status(201).json({ success: true, message: 'Inquiry submitted' });

    (async () => {
      try {
        await resend.emails.send({
          from: 'Ayodhya Estate <onboarding@resend.dev>',
          to: process.env.EMAIL_TO,
          subject: '🕉️ New Inquiry - Ayodhya Estate',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h2>🕊️ New Inquiry Request</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Message:</strong> ${message || 'No message'}</p>
              <p>Jai Shri Ram! 🙏</p>
            </div>
          `
        });
        console.log('Email sent successfully via Resend API');
      } catch (emailError) {
        console.error('Resend API Error:', emailError);
      }
    })();
  } catch (error) {
    console.error('Inquiry submission error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const nextStatus = normalizeInquiryStatus(req.body.status);
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: nextStatus },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({ success: true, message: 'Inquiry status updated', data: inquiry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  updateInquiryStatus
};