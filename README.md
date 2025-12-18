# 🧠 Wallet Story Explorer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**Turn any Ethereum wallet into a human-readable story.**

Wallet Story Explorer is an open-source web app that analyzes Ethereum wallet activity and presents it as a **personality-driven narrative** — simple, visual, and fun to explore.

Instead of raw tables and hashes, you get **stories, traits, and behavior patterns** anyone can understand.

---

## 🌐 Live Demo

**[Try it now →](https://wallet-summary.vercel.app/)**

---


## ✨ What It Does

Paste any Ethereum wallet address and instantly get:

* 🎭 **Wallet Personality**
  (e.g. *The Energetic Explorer*, *The Relentless Executor*)

* 🧠 **Personality Traits**
  Human-friendly traits derived from on-chain behavior

* 📖 **AI-Generated Story**
  A short narrative describing how the wallet behaves over time

* 📊 **Key Stats**
  * Wallet age
  * Total transactions
  * ETH balance
  * Activity status (Active / Dormant)

* 🔗 **Shareable Results**
  Designed to be screenshot- and share-friendly

No wallet connection required.
No transactions needed.
Read-only and privacy-friendly.

---

## 🧩 Why This Exists

Most blockchain explorers are:
* Technical
* Data-heavy
* Intimidating for non-crypto users

**Wallet Story Explorer** focuses on:
* Curiosity over complexity
* Storytelling over dashboards
* Exploration over trading

It's built for:
* Beginners curious about crypto
* Builders exploring wallets
* Crypto enthusiasts
* Anyone who wants to *understand wallets as behavior*, not just balances

---

## 🛠 Tech Stack

* **Frontend:** Next.js 14 (App Router), TypeScript
* **Styling:** Tailwind CSS
* **AI:** Google Gemini API (via Google AI Studio)
* **Blockchain Data:** Etherscan API (free tier)
* **Deployment:** Vercel
* **License:** MIT

---

## 🚀 Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/akanthed/wallet-summary.git
cd wallet-summary
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env.local` file in the root directory:
```env
ETHERSCAN_API_KEY=your_etherscan_api_key
GEMINI_API_KEY=your_gemini_api_key
```

#### Get API Keys:

**Etherscan API Key** (Free)
1. Go to [etherscan.io/apis](https://etherscan.io/apis)
2. Sign up for a free account
3. Generate an API key
4. Free tier: 5 calls/second, 100k calls/day

**Google Gemini API Key** (Free)
1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create an API key
4. Free tier: 15 requests/minute, 1500 requests/day

### 4️⃣ Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧠 How It Works (High Level)

1. User enters an Ethereum wallet address
2. App fetches public on-chain data from Etherscan API
3. Data is analyzed and summarized
4. Summary is sent to Google Gemini AI
5. Gemini generates:
   * A wallet personality type
   * Key personality traits
   * A narrative story
6. Results are rendered in a clean, shareable UI

All analysis is **read-only** and uses **public blockchain data only**.

---

## 🧪 Example Wallets to Try

* **Vitalik Buterin**
  `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`

* **OpenSea Wallet**
  `0x5b3256965e7C3cF26E11FCAf296DfC8807C01073`

* **Uniswap Deployer**
  `0x1a9C8182C09F50C8318d769245beA52c32BE35BC`

---

## 🔧 Troubleshooting

**"Invalid API Key" error:**
- Verify your `.env.local` file exists in the root directory
- Double-check API keys are correct (no extra spaces)
- Restart the dev server after adding/changing keys

**"Rate limit reached" error:**
- Free tiers have limits (see API Keys section above)
- Wait a few minutes before retrying
- Results are cached to minimize repeat API calls

**"No transactions found":**
- Verify the wallet address format is correct (starts with 0x)
- Check if the wallet has activity on [Etherscan](https://etherscan.io)
- Try a different wallet address

---

## ⚠️ Disclaimer

This project is for **educational and exploratory purposes only**.

* Not financial advice
* Not investment analysis
* AI interpretations are illustrative, not factual claims
* All data is from public blockchain sources

---

## 🛣 Roadmap

Planned features for future versions:

- [ ] Shareable image cards (PNG export)
- [ ] Wallet vs Wallet comparison
- [ ] Timeline visualization of major events
- [ ] Achievement badges system
- [ ] Famous wallets gallery
- [ ] Multiple blockchain support (Polygon, BSC, etc.)
- [ ] Caching & performance improvements
- [ ] Mobile app

Contributions welcome! 🚀

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please keep changes:
* Incremental and focused
* Well-documented
* Beginner-friendly
* Open-source aligned

---

## 💬 Questions or Feedback?

- 🐛 [Report a bug](https://github.com/akanthed/wallet-summary/issues)
- 💡 [Request a feature](https://github.com/akanthed/wallet-summary/issues)
- ⭐ [Star the repo](https://github.com/akanthed/wallet-summary)

---

## 📄 License

MIT License - Free to use, modify, and distribute.

See [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Built By

Created with ❤️ for the Ethereum community

---

## ⭐ Support the Project

If you find this interesting or useful:
* ⭐ Star the repo
* 🐦 Share it on social media
* 🧠 Try analyzing different wallets
* 💡 Suggest new features

---

**Powered by [Google Gemini AI](https://ai.google.dev/) • Data from [Etherscan](https://etherscan.io)**