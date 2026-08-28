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
      email: 'buynestventures5@gmail.com',
      phone: '8512898728',
      address: 'Space No-B-4, Basement Floor, Plot No.-12, Suneja Tower-II, Dist Center, Janak Puri, New Delhi, Delhi, 110058, India',
      companyName: 'BUYNEST VENTURES PRIVATE LIMITED',
    });
  }
  return contactInfo;
};

const ContactInfo = mongoose.models.ContactInfo || mongoose.model('ContactInfo', contactInfoSchema);

export default ContactInfo;







