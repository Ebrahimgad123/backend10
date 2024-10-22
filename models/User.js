const mongoose =require('mongoose')

// نموذج المستخدم
const userSchema =new mongoose.Schema(
  {

    googleId: { type: String},
    displayName: { type: String, required: true },
    email: { type: String, required: true,unique:true },
    profilePicture: { type: String ,default: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",},
    password: {
      type: String,
      required: true, 
    },
    firstName: {
      type: String,
      default: 'your-first-Name', 
    },
    lastName: {
      type: String,
      default: 'your-last-Name', 
    },
    emailStatus: {
      type: String,
      enum: ['Unverified', 'Verified'], // الحالتان الممكنتان
      default: 'Verified',
    },
    phoneNumber: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false, // حالة التحقق إذا كان المستخدم مشرفًا
    },
  },
  {
    timestamps: true, // إضافة الطوابع الزمنية (تاريخ الإنشاء وتاريخ التعديل)
  }
);

// إنشاء الموديل
const User = mongoose.model('User', userSchema);

module.exports=User;
