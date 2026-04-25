## Project Structure

- **app/**: এখানে Next.js App Router ব্যবহার করা হয়েছে।
    - **(info)/**: প্রজেক্টের তথ্য সম্পর্কিত রাউট গ্রুপ (Route Group)।
    - **api/**: প্রজেক্টের ব্যাকএন্ড API রাউটগুলো।
    - **quran/**, **hadith/**, **duas/**, **prayer-times/**, **tools/**: নির্দিষ্ট ফিচারের পেজগুলো।
    - **layout.tsx**: মেইন লেআউট (Navbar এবং Footer সহ)।
    - **page.tsx**: হোম পেজ (Hero Section এবং Explore Resources)।
    - **globals.css**: স্টাইলিং ফাইল।
- **components/**: ওয়েবসাইটের ছোট ছোট অংশ (যেমন Navbar, Footer, Modal)।
- **public/**: ছবি, আইকন এবং অন্যান্য স্ট্যাটিক ফাইল।
- **tailwind.config.js**: ডিজাইন কাস্টমাইজেশন কনফিগারেশন।


## মূল ফিচারসমূহ (Main Features)

- **Prayer Times:** বর্তমান এবং পরবর্তী নামাজের সময়, এবং পুরো দিনের সময়সূচী।
- **Quran:** অনুবাদ এবং অডিওসহ কুরআন পড়ার ব্যবস্থা।
- **Hadith Collection:** প্রধান হাদীস গ্রন্থসমূহ পড়ার সুবিধা।
- **Dua Library:** দৈনন্দিন জীবনের প্রয়োজনীয় সব দুয়া।
- **Islamic Tools:** হিজরি ক্যালেন্ডার, আল্লাহর ৯৯ নাম এবং কিবলা কম্পাস।
- **Daily Inspiration:** প্রতিদিনের হাদীস এবং দুয়া।

## How to Run

১. **Install Dependencies:**
   টার্মিনাল ওপেন করে প্রজেক্টের রুট ডিরেক্টরিতে নিচের কমান্ডটি দিন:
   ```bash
   npm install
   ```

২. **Run Development Server:**
   ইন্সটল হয়ে গেলে প্রজেক্টটি রান করতে লিখুন:
   ```bash
   npm run dev
   ```

৩. **ওয়েবসাইটটি দেখুন:**
   এখন আপনার ব্রাউজারে `http://localhost:3000` লিংকে গিয়ে প্রজেক্টটি দেখতে পারবেন।

## অন্যান্য কমান্ড (Other Commands)

- **বিল্ড করতে (Build):** `npm run build`
- **প্রোডাকশন সার্ভার রান করতে (Production):** `npm run start`
