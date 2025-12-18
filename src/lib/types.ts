// Generic Etherscan API response wrappers
export interface EtherscanResponse<T> {
    status: '1' | '0';
    message: string;
    result: T;
  }
  
  export interface EtherscanError {
    status: '0';
    message: string;
    result: string;
  }
  
  // Specific Etherscan result types
  export interface EtherscanTx {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    from: string;
    to: string;
    value: string;
    gasPrice: string;
    gasUsed: string;
    isError: string;
  }
  
  export interface EtherscanTokenTx {
    timeStamp: string;
    tokenSymbol: string;
    tokenName: string;
    from: string;
    to: string;
  }
  
  export interface EtherscanNftTx {
    timeStamp: string;
    tokenName: string;
    tokenID: string;
  }
  
  // Internal application types
  export interface WalletStats {
    walletAge: number;
    txCount: number;
    balance: string;
    activityStatus: 'Active' | 'Moderate' | 'Dormant';
  }
  
  export type PersonalityData = {
    personalityTitle: string;
    oneLineSummary: string;
    traits: string[];
    personalityStory: string;
  }

  export type TimelineEvent = {
    date: string;
    type: 'Creation' | 'Transaction' | 'NFT' | 'Token' | 'Activity' | 'Milestone';
    title: string;
    description: string;
    value?: string;
  }

  export interface AnalysisResult {
    personality: string;
    story: string;
    highlights: string[];
    stats: WalletStats;
    limitedData: boolean;
    personalityData: PersonalityData;
    timelineEvents: TimelineEvent[];
  }
  
  export type ComparisonResult = {
    wallet1: AnalysisResult | null;
    wallet2: AnalysisResult | null;
  }
  

    