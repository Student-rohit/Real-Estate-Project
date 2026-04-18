import { errorHandler } from '../utils/error.js';

// Smart rule-based real estate chatbot
const getRealEstateResponse = (message) => {
  const msg = message.toLowerCase().trim();

  // ── Greetings ──────────────────────────────────────────────
  if (/^(hi|hello|hey|howdy|good\s?(morning|afternoon|evening))/.test(msg)) {
    return "👋 Hello! Welcome to **RealEstate**. I'm your AI assistant. I can help you:\n\n• 🏠 Find properties to **buy or rent**\n• 💰 Understand **pricing & budgets**\n• 📋 Learn about the **listing process**\n• 🔍 Navigate our **search features**\n\nWhat are you looking for today?";
  }

  // ── Buy / Purchase ─────────────────────────────────────────
  if (/\b(buy|purchase|buying|for sale|want to buy|looking to buy)\b/.test(msg)) {
    return "🏡 **Buying a Property?** Great choice!\n\nHere's how to get started:\n1. Head to our **Search** page and select `Type: Sale`\n2. Set your **budget** and preferred **location**\n3. Filter by bedrooms, bathrooms, and amenities\n4. Click on any listing to see full details & contact the owner\n\n💡 *Tip: Use the price range filter to find the best deals!*\n\nWould you like help with anything specific — budget range, area, or property type?";
  }

  // ── Rent ───────────────────────────────────────────────────
  if (/\b(rent|rental|renting|for rent|lease|leasing|tenant)\b/.test(msg)) {
    return "🔑 **Looking to Rent?** Perfect!\n\nSteps to find your next home:\n1. Visit the **Search** page → set `Type: Rent`\n2. Filter by **area, price, and bedrooms**\n3. Check listings with furnished/parking options\n4. **Contact the landlord** directly from the listing page\n\n📌 Most rentals are available immediately. Would you like tips on what to look for in a rental?";
  }

  // ── Sell / Create Listing ──────────────────────────────────
  if (/\b(sell|selling|list my|create listing|add property|post property|list property)\b/.test(msg)) {
    return "📝 **Want to Sell or Rent Out Your Property?**\n\nHere's how:\n1. **Sign in** or create an account\n2. Go to your **Profile** dashboard\n3. Click **Create Listing**\n4. Add photos, set your price, and publish!\n\n✅ Your listing will be visible to thousands of buyers instantly. Need help with pricing your property?";
  }

  // ── Price / Budget ─────────────────────────────────────────
  if (/\b(price|cost|budget|afford|how much|expensive|cheap|rate|value)\b/.test(msg)) {
    return "💰 **Property Pricing Guide:**\n\n| Type | Typical Range |\n|------|---------------|\n| 1BHK Apartment | ₹15L – ₹40L |\n| 2BHK Apartment | ₹35L – ₹80L |\n| 3BHK House | ₹60L – ₹1.5Cr |\n| Monthly Rent (1BHK) | ₹8K – ₹20K |\n| Monthly Rent (2BHK) | ₹15K – ₹40K |\n\n💡 Prices vary by location, amenities, and market conditions. Use our **Search Filters** to set your exact budget range!";
  }

  // ── Search / Find Property ─────────────────────────────────
  if (/\b(search|find|look for|browse|filter|discover|show me|available)\b/.test(msg)) {
    return "🔍 **Finding Properties is Easy!**\n\nVisit our [Search Page](/search) and use these filters:\n- 📍 **Location** — city, neighborhood, or pin code\n- 💵 **Price Range** — min to max budget\n- 🛏️ **Bedrooms** — 1, 2, 3, 4+ BHK\n- 🏠 **Type** — House, Apartment, Condo, Land\n- 🔖 **Listing Type** — For Sale / For Rent\n\nWould you like me to suggest the best filters for your needs?";
  }

  // ── Contact / Agent ────────────────────────────────────────
  if (/\b(contact|agent|owner|landlord|call|email|reach|connect)\b/.test(msg)) {
    return "📞 **Contacting a Property Owner:**\n\n1. Open any listing you're interested in\n2. Scroll down to the **Contact** section\n3. Send a message directly to the owner\n\n✉️ Owners usually respond within **24 hours**. You can also save listings to compare later from your Profile. Need help finding a specific property?";
  }

  // ── Amenities ──────────────────────────────────────────────
  if (/\b(parking|garage|pool|furnished|gym|security|wifi|garden|balcony|elevator|lift)\b/.test(msg)) {
    const amenity = msg.match(/parking|garage|pool|furnished|gym|security|wifi|garden|balcony|elevator|lift/)[0];
    return `🏗️ **Searching for properties with ${amenity}?**\n\nYou can filter listings by amenities on our Search page!\n\n🔎 Head to [Search](/search) and look for the **"Offer"** or **"Features"** filter to find properties with ${amenity} and other amenities.\n\nWould you like tips on what other features to look for?`;
  }

  // ── Location Questions ─────────────────────────────────────
  if (/\b(location|area|city|neighborhood|where|locality|zone|district)\b/.test(msg)) {
    return "📍 **Location Search Tips:**\n\nOur platform covers properties across major cities and localities. To search by location:\n\n1. Go to the **Search** page\n2. Type your preferred **city or area** in the search bar\n3. Listings nearby will appear automatically\n\n🏙️ Popular areas: Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai\n\nWhich city or area are you interested in?";
  }

  // ── Documents / Legal ─────────────────────────────────────
  if (/\b(document|legal|registration|agreement|stamp duty|loan|emi|mortgage|bank|finance)\b/.test(msg)) {
    return "📄 **Property Documents & Legalities:**\n\n**For Buyers:**\n- Sale Deed, Title Deed\n- Encumbrance Certificate\n- Building Approval Plan\n- Khata Certificate\n\n**For Renters:**\n- Rental Agreement (11 months)\n- ID Proof & Address Proof\n- Security Deposit receipt\n\n💼 Always consult a legal expert before signing. Would you like more details on any specific document?";
  }

  // ── Investment ─────────────────────────────────────────────
  if (/\b(invest|investment|roi|return|profit|appreciation|future|value|grow)\b/.test(msg)) {
    return "📈 **Real Estate Investment Insights:**\n\n✅ Real estate typically appreciates **5–12% annually** in India's major cities\n✅ Rental yield ranges from **2–5%** in metro areas\n✅ Under-construction properties often offer **better returns**\n\n🔑 **Best investment locations right now:**\n- Pune (IT corridor)\n- Hyderabad (Hi-Tech City)\n- Bangalore (Whitefield, Electronic City)\n- Mumbai (Navi Mumbai expansion)\n\nWould you like to know more about a specific city?";
  }

  // ── Profile / Account ──────────────────────────────────────
  if (/\b(profile|account|sign in|sign up|login|register|dashboard)\b/.test(msg)) {
    return "👤 **Account & Profile:**\n\n- **Sign Up** → Create your account at [/sign-up](/sign-up)\n- **Sign In** → Log in at [/sign-in](/sign-in)\n- **Profile** → Manage listings, view saved properties at [/profile](/profile)\n\n🔒 Your data is secure. We use JWT authentication to protect your account. How can I help you further?";
  }

  // ── About / Company ────────────────────────────────────────
  if (/\b(about|who are you|company|platform|website|realestate|real estate)\b/.test(msg)) {
    return "🏢 **About RealEstate:**\n\nWe are a modern real estate marketplace connecting **buyers, sellers, and renters** with the best properties across India.\n\n🌟 **What we offer:**\n- Thousands of verified listings\n- Direct owner contact (no middlemen)\n- Smart search and filters\n- Free listing creation\n\nVisit our [About Page](/about) for more info. How can I assist you today?";
  }

  // ── Thank you ──────────────────────────────────────────────
  if (/\b(thank|thanks|thank you|thx|ty|appreciate)\b/.test(msg)) {
    return "😊 You're welcome! I'm happy to help. If you have any more questions about properties, buying, renting, or anything else — feel free to ask!\n\n🏠 Happy house hunting! 🍀";
  }

  // ── Goodbye ────────────────────────────────────────────────
  if (/\b(bye|goodbye|see you|later|ciao|exit|quit)\b/.test(msg)) {
    return "👋 Goodbye! It was great chatting with you. Come back anytime you need help with your property search. Good luck! 🏡✨";
  }

  // ── Help ───────────────────────────────────────────────────
  if (/\b(help|assist|support|guide|how|what can)\b/.test(msg)) {
    return "🤝 **I can help you with:**\n\n🏠 **Properties** → Find homes to buy or rent\n💰 **Pricing** → Understand market rates & budgets\n📝 **Listing** → How to sell or rent your property\n📞 **Contact** → Connect with owners/agents\n📄 **Documents** → Understand legal requirements\n📈 **Investment** → Tips for real estate investment\n👤 **Account** → Sign up, sign in, manage profile\n\nJust type your question and I'll guide you! What would you like to know?";
  }

  // ── Default fallback ───────────────────────────────────────
  return `🤔 I'm not sure I understood that. Here are some things I can help with:\n\n• 🏠 **"Find a 2BHK flat in Pune"**\n• 💰 **"What's the price range for apartments?"**\n• 📝 **"How do I list my property?"**\n• 📞 **"How do I contact an owner?"**\n• 📄 **"What documents do I need to buy a house?"**\n\nCould you rephrase your question? I'm here to help! 😊`;
};

export const chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return next(errorHandler(400, 'Message is required'));
    }

    // Small artificial delay to feel more natural
    await new Promise((resolve) => setTimeout(resolve, 400));

    const reply = getRealEstateResponse(message);
    res.status(200).json({ reply });
  } catch (error) {
    next(error);
  }
};
