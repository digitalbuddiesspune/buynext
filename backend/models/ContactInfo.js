import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      default: 'BuyNest',
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure only one contact info document exists
contactInfoSchema.statics.getContactInfo = async function () {
  let contactInfo = await this.findOne();
  if (!contactInfo) {
    contactInfo = await this.create({
      email: 'pharmabarringer@gmail.com',
      phone: '8745015901',
      address: 'Office No 110, Vishal Tower, District Centre, Janakpuri, New Delhi, Delhi - 110058, India',
      companyName: 'BuyNest',
    });
  }
  return contactInfo;
};

const ContactInfo = mongoose.models.ContactInfo || mongoose.model('ContactInfo', contactInfoSchema);

export default ContactInfo;







