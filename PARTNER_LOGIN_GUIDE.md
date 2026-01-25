# Partner Login Flow - Test Guide

## ✅ Complete Partner Authentication Flow

### **Registration → Payment → Login → Dashboard**

---

## 🔐 How Partner Login Works

### **1. Registration (Creates Firebase Auth + Firestore Document)**
- Partner fills form at `/partner/register?plan=Growth`
- Firebase Auth creates user with `email` + `password`
- Firestore document created at `partners/{uid}`:
  ```javascript
  {
    fullName: "John Doe",
    email: "partner@company.com",
    phone: "+1234567890",
    companyName: "Acme Inc",
    role: "partner",
    plan: "Growth",
    maxAdsPerDay: 5,
    subscriptionDays: 30,
    isActive: false,  // ← Inactive until payment
    createdAt: timestamp
  }
  ```
- Partner is **auto-logged in** after registration
- Redirected to `/partner/payment`

### **2. Payment (Activates Account)**
- Partner completes Stripe payment
- Firestore updates:
  ```javascript
  {
    isActive: true,  // ← Account activated
    subscriptionStart: timestamp
  }
  ```
- Redirected to `/partner/dashboard`

### **3. Subsequent Logins**
- Partner visits `/partner/login`
- Enters **same email & password** used during registration
- Firebase Auth validates credentials
- System checks `partners/{uid}` collection
- If `isActive: false` → Redirect to `/partner/payment`
- If `isActive: true` → Redirect to `/partner/dashboard`

---

## 🧪 Testing Steps

### **Test 1: New Partner Registration**
1. Go to `http://localhost:5173/partner-plans`
2. Click "Subscribe Now" on any plan
3. Fill registration form:
   - Email: `test@partner.com`
   - Password: `Test123!`
   - Confirm Password: `Test123!`
   - Company: `Test Corp`
4. Click "Proceed to Payment"
5. ✅ Should redirect to `/partner/payment`
6. ✅ Partner should be logged in (check AuthContext)

### **Test 2: Payment Completion**
1. On payment page, use test card: `4242 4242 4242 4242`
2. Expiry: Any future date (e.g., `12/34`)
3. CVC: Any 3 digits (e.g., `123`)
4. Click "Complete Subscription"
5. ✅ Should redirect to `/partner/dashboard`
6. ✅ `isActive` should be `true` in Firestore

### **Test 3: Partner Login (After Payment)**
1. Logout (if logged in)
2. Go to `http://localhost:5173/partner/login`
3. Enter credentials:
   - Email: `test@partner.com`
   - Password: `Test123!`
4. Click "Access Dashboard"
5. ✅ Should redirect to `/partner/dashboard`
6. ✅ Should see partner data (company name, plan, etc.)

### **Test 4: Partner Login (Before Payment)**
1. Create new partner account (don't complete payment)
2. Logout
3. Go to `/partner/login`
4. Login with credentials
5. ✅ Should redirect to `/partner/payment` (not dashboard)
6. ✅ Complete payment to unlock dashboard

### **Test 5: Invalid Credentials**
1. Go to `/partner/login`
2. Enter wrong email or password
3. ✅ Should show error: "Invalid email or password"
4. ✅ Should NOT redirect anywhere

### **Test 6: Non-Partner User**
1. Create regular user account (via `/signup`)
2. Try logging in at `/partner/login`
3. ✅ Should show error: "No partner account found"
4. ✅ Should sign out and stay on login page

---

## 🔍 Debugging Checklist

### **If Login Fails:**

1. **Check Firebase Auth Console**
   - Go to Firebase Console → Authentication
   - Verify user exists with correct email
   - Check if email is verified (not required but good to know)

2. **Check Firestore Console**
   - Go to Firebase Console → Firestore
   - Navigate to `partners` collection
   - Find document with matching UID
   - Verify `role: "partner"` exists
   - Check `isActive` status

3. **Check Browser Console**
   - Open DevTools → Console
   - Look for Firebase errors
   - Common errors:
     - `auth/invalid-credential` → Wrong password
     - `auth/user-not-found` → Email doesn't exist
     - `auth/too-many-requests` → Too many failed attempts

4. **Check AuthContext State**
   - Open React DevTools
   - Find `AuthContext.Provider`
   - Check `user` object:
     ```javascript
     {
       uid: "...",
       email: "partner@company.com",
       role: "partner",  // ← Must be "partner"
       isActive: true,   // ← Must be true for dashboard
       companyName: "...",
       plan: "Growth"
     }
     ```

---

## 🛡️ Security Features

1. **Password Requirements**
   - Minimum 6 characters (Firebase default)
   - Can be strengthened in registration validation

2. **Role Verification**
   - Login checks `partners` collection
   - Non-partners cannot access partner routes

3. **Payment Gate**
   - Dashboard requires `isActive: true`
   - Unpaid partners redirected to payment

4. **Protected Routes**
   - `/partner/dashboard` → Requires auth + payment
   - `/partner/create-ad` → Requires auth + payment
   - `/partner/payment` → Requires auth only

---

## 📝 Common Issues & Solutions

### **Issue: "No partner account found"**
**Cause:** User exists in Firebase Auth but not in `partners` collection
**Solution:** Check Firestore, ensure document was created during registration

### **Issue: Redirects to payment instead of dashboard**
**Cause:** `isActive: false` in Firestore
**Solution:** Complete payment or manually set `isActive: true` in Firestore

### **Issue: "Invalid email or password"**
**Cause:** Credentials don't match Firebase Auth
**Solution:** Use Firebase Console to reset password or verify email

### **Issue: Stuck on loading screen**
**Cause:** AuthContext not resolving
**Solution:** Check browser console for errors, verify Firebase config

---

## 🎯 Expected Behavior Summary

| Scenario | Expected Result |
|----------|----------------|
| New registration | Auto-login → Payment page |
| Login (paid partner) | Dashboard |
| Login (unpaid partner) | Payment page |
| Login (wrong password) | Error message |
| Login (non-partner) | Error + sign out |
| Access dashboard without login | Redirect to `/partner/login` |
| Access dashboard without payment | Redirect to `/partner/payment` |

---

## ✅ Success Criteria

Partner login is working correctly if:
1. ✅ Partner can register with email/password
2. ✅ Partner is auto-logged in after registration
3. ✅ Partner can login anytime with same credentials
4. ✅ Unpaid partners are redirected to payment
5. ✅ Paid partners can access dashboard
6. ✅ Invalid credentials show error
7. ✅ Non-partners cannot access partner routes
