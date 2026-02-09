
# Marketplace App — Listing Credits Model

## Overview
A clean, mobile-first marketplace where users buy listing packs to post products. No subscriptions, no commissions, no ads. Revenue comes solely from selling listing credit packs.

---

## Pages & Features

### 1. Login / Signup Page
- Email + password authentication (Phone OTP can be added later)
- Clean, centered form with toggle between Login and Sign Up
- New users receive **3 free listing credits** on signup
- Redirect to Dashboard after login

### 2. Home / Browse Listings (Login Required)
- Grid of product cards showing image, title, price, location, and category
- Search bar and category filter dropdown
- Clicking a card opens the product detail view

### 3. Product Detail Page
- Full product images (carousel if multiple)
- Title, description, price, category, location
- **Call button** (shows phone number) and **WhatsApp button** (opens WhatsApp chat)
- Seller name displayed

### 4. User Dashboard
- Welcome banner with remaining listing credits prominently displayed
- Stats: total products listed
- Quick action buttons:
  - "Add New Product"
  - "Buy Listing Pack"
  - "My Listings"

### 5. Add Product Page
- Form fields: Title, Description, Price, Category (dropdown), Images (up to 5), Location (city), Contact Number
- On submit: deduct 1 listing credit and publish
- If credits = 0: show popup prompting user to buy a listing pack (block submission)

### 6. My Listings Page
- List of user's products with image thumbnail, title, price
- Status badges: Active / Sold / Removed
- Mark as Sold and Delete actions

### 7. Buy Credits Page
- Display listing pack options as cards:
  - 5 Listings → ₹29
  - 10 Listings → ₹49
  - 25 Listings → ₹99
  - 50 Listings → ₹179
- Razorpay integration (test mode) for payment
- On successful payment: add credits to user balance and save transaction

### 8. Admin Panel (separate section, admin-only access)
- View all users and their credit balances
- View and delete any listing
- View payment/transaction history
- Manually add listing credits to any user
- Edit listing pack pricing

### 9. Static Pages
- Terms and Conditions
- Privacy Policy
- Content guidelines with prohibited items warning

---

## Design
- Clean white background with **blue/purple** primary accent
- Mobile-first responsive layout
- Large, tappable buttons
- Simple top navigation bar with bottom nav on mobile
- Minimal, modern card-based UI

---

## Backend (Lovable Cloud / Supabase)
- **Authentication**: Email + password with user profiles
- **Database tables**: Users/profiles, listings, transactions, listing_packs (admin-configurable pricing), user_roles (for admin access)
- **Storage**: Image uploads for product photos (up to 5 per listing)
- **Edge function**: Razorpay payment verification webhook
- **Row-Level Security**: Users can only edit/delete their own listings; admin role for full access
- **3 free credits** granted automatically on signup via database trigger

---

## Payment Flow
1. User selects a listing pack
2. Razorpay checkout opens (test mode)
3. Payment verified via edge function webhook
4. Credits added to user's balance
5. Transaction record saved

---

## Not Built Now (Future-Ready Structure)
- Featured/promoted listings
- Seller verification badges
- In-app chat between buyers and sellers
- Phone OTP authentication
