# Wallet Story Explorer

Turn any Ethereum wallet address into a human-readable, story-like explanation using AI. This open-source web app uses the Etherscan API to fetch wallet data and Google's Gemini AI to generate an engaging narrative.

![Wallet Story Explorer Screenshot](https://i.imgur.com/example.png)

## Features

- **AI-Powered Stories**: Get a unique personality and story for any Ethereum wallet.
- **Key Stats**: See important metrics like wallet age, transaction count, and activity status.
- **Simple Interface**: A clean, modern UI for easy exploration.
- **Mobile Friendly**: Fully responsive design for use on any device.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google Gemini](https://ai.google.dev/) via Genkit
- [Etherscan API](https://etherscan.io/apis)

## Setup and Installation

Follow these steps to get the project running locally.

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/wallet-story-explorer.git
cd wallet-story-explorer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.local.example .env.local
```

Now, open `.env.local` and add your API keys:

- `ETHERSCAN_API_KEY`: Get a free API key from [Etherscan](https://etherscan.io/myapikey).
- `API_KEY`: This is your Google AI/Gemini API key. Get one from [Google AI Studio](https://aistudio.google.com/app/apikey). You'll also need to enable the "Generative Language API" in your Google Cloud project.

### 4. Run the development server

```bash
npm run dev
```

The application should now be running at [http://localhost:9002](http://localhost:9002).

## Deployment

This app is optimized for deployment on [Vercel](https://vercel.com/).

1.  Push your code to a GitHub repository.
2.  Import the repository into Vercel.
3.  Add your environment variables (`ETHERSCAN_API_KEY`, `API_KEY`) in the Vercel project settings.
4.  Deploy!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
