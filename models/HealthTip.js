import mongoose from 'mongoose';

const HealthTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const HealthTip = mongoose.model('HealthTip', HealthTipSchema);

export default HealthTip;
