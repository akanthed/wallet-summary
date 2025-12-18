import { EtherscanError, EtherscanResponse, EtherscanTx, EtherscanTokenTx, EtherscanNftTx } from "@/lib/types";

const ETHERSCAN_API_URL = "https://api.etherscan.io/api";
const API_KEY = process.env.ETHERSCAN_API_KEY;

async function fetchEtherscan<T>(params: Record<string, string>): Promise<T> {
  if (!API_KEY) {
    throw new Error("Etherscan API key is not configured.");
  }
  
  const url = new URL(ETHERSCAN_API_URL);
  url.search = new URLSearchParams({ ...params, apikey: API_KEY }).toString();

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Etherscan API request failed with status ${response.status}`);
  }

  const data: EtherscanResponse<T> | EtherscanError = await response.json();

  if (data.status === "0") {
    // Etherscan API returns status "0" for errors
    const errorData = data as EtherscanError;
    if (errorData.result.includes('rate limit')) {
        throw new Error("API rate limit reached. Please try again in a few minutes.");
    }
    // Return empty array for "No transactions found"
    if (errorData.message === 'No transactions found') {
        return [] as unknown as T;
    }
    if (errorData.message === 'NOTOK' && errorData.result.includes('Invalid API Key')) {
        throw new Error("Invalid Etherscan API Key. Please check your .env.local file.");
    }
    throw new Error(`Etherscan API error: ${errorData.message} - ${errorData.result}`);
  }

  return (data as EtherscanResponse<T>).result;
}


export async function getAccountBalance(address: string): Promise<string> {
    const result = await fetchEtherscan<string>({
        module: 'account',
        action: 'balance',
        address,
        tag: 'latest',
    });
    return result;
}

export async function getTransactions(address: string): Promise<EtherscanTx[]> {
    const result = await fetchEtherscan<EtherscanTx[]>({
        module: 'account',
        action: 'txlist',
        address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '10000', // Max per Etherscan API docs
        sort: 'asc',
    });
    return Array.isArray(result) ? result : [];
}

export async function getTokenTransfers(address: string): Promise<EtherscanTokenTx[]> {
    try {
        const result = await fetchEtherscan<EtherscanTokenTx[]>({
            module: 'account',
            action: 'tokentx',
            address,
            page: '1',
            offset: '1000',
            sort: 'asc',
        });
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.warn("Could not fetch token transfers:", error);
        return [];
    }
}

export async function getNftTransfers(address: string): Promise<EtherscanNftTx[]> {
    try {
        const result = await fetchEtherscan<EtherscanNftTx[]>({
            module: 'account',
            action: 'tokennfttx',
            address,
            page: '1',
            offset: '1000',
            sort: 'asc',
        });
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.warn("Could not fetch NFT transfers:", error);
        return [];
    }
}
