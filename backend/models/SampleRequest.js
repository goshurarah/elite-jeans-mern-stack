// const mongoose = require('mongoose');

// const STATUS_ENUM = ['Pending', 'Approved', 'Rejected'];

// const actionSchema = new mongoose.Schema({
//   Log_Status: {
//     type: String,
//     enum: STATUS_ENUM,
//   },
//   Log_Date: {
//     type: Date,
//     default: Date.now,
//   },
//   Comments: {
//     type: String,
//   },
// });

// const sampleRequestSchema = new mongoose.Schema({
//   techpackId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'TechPack',
//   },
//   styleNumber: {
//     type: String,
    
//   },
//   size: {
//     type: String,
   
//   },
//   quantity: {
//     type: Number,
    
//   },
//   sampleType: {
//     type: String,
    
//   },
//   dueDate: {
//     type: Date,
    
//   },
//   comments: {
//     type: String,
//   },
//   status: {
//     type: String,
//     enum: STATUS_ENUM,
//     default: 'Pending',
//   },
//   actions: [actionSchema],
// });

// // Middleware to update the status based on the latest Log_Status
// sampleRequestSchema.pre('save', function (next) {
//   if (this.actions && this.actions.length > 0) {
//     const latestAction = this.actions[this.actions.length - 1];
//     if (latestAction.Log_Status) {
//       this.status = latestAction.Log_Status;
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('SampleRequest', sampleRequestSchema);
const mongoose = require('mongoose');
const STATUS_ENUM = ['Pending', 'Approved', 'Rejected'];
const actionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  performedAt: {
    type: Date,
    default: Date.now,
  },
  performedBy: {
    type: String,
    required: true,
  },
});
const sampleRequestSchema = new mongoose.Schema({
  techpackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TechPack',
  },
  workOrder_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workOrder',
  },
  styleNumber: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sampleType: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  comments: {
    type: String,
  },
  status: {
    type: String,
    enum: STATUS_ENUM,
    default: 'Pending',
  },
  actions: [actionSchema],
});
module.exports = mongoose.model('SampleRequest', sampleRequestSchema);