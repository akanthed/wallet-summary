
import { Badge, EtherscanTx, EtherscanTokenTx, EtherscanNftTx } from '@/lib/types';

const badgeDefinitions: Badge[] = [
    // Activity Badges
    { id: 'first_steps', name: 'First Steps', description: 'Completed your first transaction.', icon: 'Footprints', category: 'activity' },
    { id: 'century_club', name: 'Century Club', description: 'Made over 100 transactions.', icon: 'Award', category: 'activity' },
    { id: 'active_trader', name: 'Active Trader', description: 'Made over 1,000 transactions.', icon: 'Repeat', category: 'activity' },
    { id: 'lightning_fast', name: 'Lightning Fast', description: 'Made 10+ transactions in a single day.', icon: 'Zap', category: 'activity' },
    { id: 'night_owl', name: 'Night Owl', description: 'Most transactions were made between midnight and 6am UTC.', icon: 'Moon', category: 'activity' },
    
    // Wealth Badges
    { id: 'baby_whale', name: 'Baby Whale', description: 'Current balance is over 1 ETH.', icon: 'Gem', category: 'wealth' },
    { id: 'whale', name: 'Whale', description: 'Current balance is over 10 ETH.', icon: 'Crown', category: 'wealth' },
    { id: 'mega_whale', name: 'Mega Whale', description: 'Current balance is over 100 ETH.', icon: 'Trophy', category: 'wealth' },
    { id: 'portfolio_pro', name: 'Portfolio Pro', description: 'Holds 10+ different types of tokens.', icon: 'Briefcase', category: 'wealth' },

    // Time Badges
    { id: 'og', name: 'OG', description: 'Wallet is over 3 years old.', icon: 'Cake', category: 'time' },
    { id: 'early_adopter', name: 'Early Adopter', description: 'Wallet was created before 2020.', icon: 'Clock', category: 'time' },
    { id: 'veteran', name: 'Veteran', description: 'Wallet has been active for over 2 years.', icon: 'Shield', category: 'time' },

    // NFT Badges
    { id: 'nft_enthusiast', name: 'NFT Enthusiast', description: 'Owns 10+ NFTs.', icon: 'Image', category: 'nft' },
    { id: 'art_collector', name: 'Art Collector', description: 'Owns 50+ NFTs.', icon: 'Paintbrush2', category: 'nft' },
    { id: 'blue_chip', name: 'Blue Chip Collector', description: 'Owns a blue-chip NFT (e.g., from BAYC or CryptoPunks).', icon: '💎', category: 'nft' },

    // Special Badges
    { id: 'explorer', name: 'Explorer', description: 'Interacted with 20+ different smart contracts.', icon: 'Compass', category: 'special' },
    { id: 'generous', name: 'Generous', description: 'Sent transactions to 50+ different addresses.', icon: 'Gift', category: 'special' },
];

// Simplified mapping of blue chip NFT contract addresses
const BLUE_CHIP_NFT_CONTRACTS = [
    '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', // Bored Ape Yacht Club
    '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', // CryptoPunks
];

type BadgeEvaluationInput = {
    transactions: EtherscanTx[];
    tokenTransfers: EtherscanTokenTx[];
    nftTransfers: EtherscanNftTx[];
    balance: number;
    walletAgeInDays: number;
}

export function awardBadges(input: BadgeEvaluationInput): Badge[] {
    const { transactions, tokenTransfers, nftTransfers, balance, walletAgeInDays } = input;
    const awardedBadges: Badge[] = [];

    if (!transactions || transactions.length === 0) {
        return [];
    }

    const badgeCheckMap: { [key: string]: () => boolean } = {
        // Activity
        first_steps: () => transactions.length > 0,
        century_club: () => transactions.length >= 100,
        active_trader: () => transactions.length >= 1000,
        lightning_fast: () => {
            const txsByDay: { [day: string]: number } = {};
            transactions.forEach(tx => {
                const day = new Date(parseInt(tx.timeStamp) * 1000).toISOString().split('T')[0];
                txsByDay[day] = (txsByDay[day] || 0) + 1;
            });
            return Object.values(txsByDay).some(count => count >= 10);
        },
        night_owl: () => {
            let nightTx = 0;
            transactions.forEach(tx => {
                const hour = new Date(parseInt(tx.timeStamp) * 1000).getUTCHours();
                if (hour >= 0 && hour < 6) {
                    nightTx++;
                }
            });
            return nightTx > transactions.length / 2;
        },

        // Wealth
        baby_whale: () => balance >= 1,
        whale: () => balance >= 10,
        mega_whale: () => balance >= 100,
        portfolio_pro: () => new Set(tokenTransfers.map(t => t.contractAddress)).size >= 10,

        // Time
        og: () => walletAgeInDays > 365 * 3,
        early_adopter: () => parseInt(transactions[0].timeStamp) * 1000 < new Date('2020-01-01').getTime(),
        veteran: () => {
            const firstTxDate = new Date(parseInt(transactions[0].timeStamp) * 1000);
            const lastTxDate = new Date(parseInt(transactions[transactions.length - 1].timeStamp) * 1000);
            return (lastTxDate.getTime() - firstTxDate.getTime()) > (1000 * 60 * 60 * 24 * 365 * 2);
        },

        // NFT
        nft_enthusiast: () => nftTransfers.length >= 10,
        art_collector: () => nftTransfers.length >= 50,
        blue_chip: () => nftTransfers.some(nft => BLUE_CHIP_NFT_CONTRACTS.includes(nft.contractAddress.toLowerCase())),

        // Special
        explorer: () => new Set(transactions.map(t => t.to)).size >= 20,
        generous: () => {
            const outgoingAddresses = new Set(transactions.filter(t => t.from.toLowerCase() === transactions[0].from.toLowerCase()).map(t => t.to));
            return outgoingAddresses.size >= 50;
        },
    };

    for (const badge of badgeDefinitions) {
        if (badgeCheckMap[badge.id] && badgeCheckMap[badge.id]()) {
            awardedBadges.push(badge);
        }
    }
    
    return awardedBadges;
}
