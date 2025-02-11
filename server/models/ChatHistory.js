import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  messages: [{
    role: { type: String, enum: ["user", "bot"], required: true },
    text: { type: String, required: true },
    source: { 
      type: String, 
      enum: ["rivescript", "huggingface", "gemini", "fallback"],
      index: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
      validate: v => !isNaN(v) && v >= 0 && v <= 1
    },
    metrics: {
      type: Map,
      of: Number,
      default: () => new Map()
    },
    timestamp: { type: Date, default: Date.now, index: true }
  }],
  lastInteraction: { type: Date, default: Date.now, index: true },
  maxMessages: { type: Number, default: 100 }
}, {
  timestamps: true
});

// Cleanup old messages
ChatSchema.pre('save', async function(next) {
  try {
    this.lastInteraction = new Date();
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Cleanup method for old chats
ChatSchema.statics.cleanup = async function(daysOld = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);
  return this.updateMany(
    { lastInteraction: { $lt: cutoff } },
    { $set: { messages: [] } }
  );
};

export default mongoose.model("ChatHistory", ChatSchema);