# 🛒 E-commerce Project  

## 📌 Overview  

This project is a **full-featured E-commerce platform** designed to provide users with a seamless online shopping experience. Key functionalities include:  

✅ **User Authentication & Authorization** – Secure user login and registration.  
✅ **Product Management** – CRUD operations for products, categories, subcategories, and brands ,etc .  
✅ **Shopping Cart & Wishlist** – Users can add/remove products from their cart or wishlist.  
✅ **Order Processing** – Smooth order placement.  
✅ **Payment Integration** – Secure payment processing using **Stripe**.  
✅ **Reviews & Ratings** – Users can leave feedback on products.  
✅ **Invoice Generation** – Automated **PDF invoices** sent via **email**.  

## 🛠️ Technologies Used  

### **Backend**  
🚀 **Node.js** – JavaScript runtime environment.  
🛠️ **Express.js** – Backend web framework.  
📦 **MongoDB** – NoSQL database for data storage.  
🔗 **Mongoose** – ODM library for MongoDB and Node.js.  
💳 **Stripe API** – Payment processing.  
📜 **PDFKit** – PDF document generation.  
📧 **Nodemailer** – Email sending service.  

### **Deployment**  
🌍 **Vercel** – Hosting platform for frontend deployment.  
☁️ **MongoDB Atlas** – Cloud database service for MongoDB.  

---

## 🎯 Features  

✅ **User Authentication & Authorization** – Secure login & role-based access control.  
✅ **Product Management** – Admins can add/update/delete products, categories, and brands.  
✅ **Shopping Cart & Wishlist** – Users can manage their cart and wishlist items.  
✅ **Order Processing** – Users can place orders, and admins can manage them.  
✅ **Payment Integration** – Secure transactions via **Stripe**.  
✅ **Reviews & Ratings** – Users can provide feedback on products.  
✅ **Invoice Generation** – **Custom HTML-based invoices** converted to PDF and emailed to users.  
✅ **Branding** – **Branded invoice designs** for a professional look.  

---

## 🚀 Installation  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/minahany0000/E-commerce.git
cd E-commerce
```

### **2️⃣ Install Backend Dependencies**  
```bash
npm install
```

### **3️⃣ Set Up Environment Variables**  
Create a **.env** file in the root directory and add the following variables:  

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_SERVICE=your_email_service_provider
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

### **4️⃣ Start the Server**  
```bash
npm start
```
Your backend server should now be running at **`http://localhost:3000`**.
---

## 📌 Usage  

1️⃣ **Access the Application** – Open **`http://localhost:3000`** in your browser.  
2️⃣ **User Registration/Login** – Sign up or log in with an existing account.  
3️⃣ **Browse Products** – Explore products by category, subcategory, or brand.  
4️⃣ **Manage Cart/Wishlist** – Add/remove products from your cart or wishlist.  
5️⃣ **Checkout** – Enter payment details and place an order.  
6️⃣ **Receive Invoice** – A **PDF invoice** is automatically emailed to the user after a successful order.  

---

## 🌍 Deployment  

🚀 The application is **deployed and accessible at**:  
🔗 [https://e-commerce-rust-ten-99.vercel.app](https://e-commerce-rust-ten-99.vercel.app)  

---

## 🤝 Contributing  

Contributions are **welcome**! Follow these steps:  

1. **Fork the repository**.  
2. **Create a new branch**:  
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Commit your changes**:  
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the branch**:  
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **Submit a pull request**.  


## 💡 Acknowledgements  

- 📝 **[PDFKit](https://pdfkit.org/)** – PDF generation.  
- 📧 **[Nodemailer](https://nodemailer.com/about/)** – Email handling.  
- 💳 **[Stripe](https://stripe.com/docs)** – Payment processing.  
- 🚀 **[Vercel](https://vercel.com/docs)** – Deployment services.  
- ☁️ **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** – Cloud database hosting.  
