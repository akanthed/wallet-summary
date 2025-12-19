import { forwardRef } from "react";
import { AnalysisResult } from "@/lib/types";

type WalletStoryExportProps = {
  result: AnalysisResult;
  address: string;
};

/**
 * DARK THEME EXPORT COMPONENT - Matches main UI
 * 
 * This component is designed ONLY for PNG/PDF export.
 * - Uses explicit inline styles (NO Tailwind, NO CSS variables)
 * - Dark background matching app UI
 * - Fixed dimensions for consistent output
 * - Rendered in a portal container for reliable capture
 */
export const WalletStoryExport = forwardRef<HTMLDivElement, WalletStoryExportProps>(
  ({ result, address }, ref) => {
    const { personalityData, stats, badges } = result;
    
    const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

    return (
      <div
        ref={ref}
        id="wallet-export-container"
        style={{
          width: '1080px',
          minHeight: '1400px',
          backgroundColor: '#09090b',
          color: '#fafafa',
          padding: '48px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid #27272a',
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#a78bfa',
          }}>
            🔮 Wallet Story
          </div>
          <div style={{
            fontSize: '18px',
            fontFamily: 'Consolas, Monaco, monospace',
            color: '#71717a',
          }}>
            {truncatedAddress}
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '56px',
          fontWeight: 700,
          color: '#fafafa',
          marginBottom: '16px',
          textAlign: 'center',
          lineHeight: 1.2,
        }}>
          {personalityData.personalityTitle}
        </h1>

        {/* Summary */}
        <p style={{
          fontSize: '22px',
          color: '#a1a1aa',
          textAlign: 'center',
          marginBottom: '40px',
          lineHeight: 1.5,
        }}>
          {personalityData.oneLineSummary}
        </p>

        {/* Traits */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '48px',
        }}>
          {personalityData.traits.map((trait, index) => (
            <span
              key={index}
              style={{
                backgroundColor: '#27272a',
                color: '#e4e4e7',
                padding: '10px 20px',
                borderRadius: '24px',
                fontSize: '16px',
                fontWeight: 500,
                border: '1px solid #3f3f46',
              }}
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Personality Story Section */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#fafafa',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #27272a',
          }}>
            ✨ Personality Story
          </h2>
          <p style={{
            fontSize: '17px',
            color: '#d4d4d8',
            lineHeight: 1.9,
            whiteSpace: 'pre-wrap',
          }}>
            {personalityData.personalityStory}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '48px',
        }}>
          <div style={{
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ fontSize: '14px', color: '#71717a', marginBottom: '8px' }}>
              📅 Wallet Age
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#fafafa' }}>
              {stats.walletAge} days
            </div>
          </div>
          <div style={{
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ fontSize: '14px', color: '#71717a', marginBottom: '8px' }}>
              🔄 Total Transactions
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#fafafa' }}>
              {stats.txCount.toLocaleString()}
            </div>
          </div>
          <div style={{
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ fontSize: '14px', color: '#71717a', marginBottom: '8px' }}>
              💰 ETH Balance
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#fafafa' }}>
              {parseFloat(stats.balance).toFixed(4)} ETH
            </div>
          </div>
          <div style={{
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ fontSize: '14px', color: '#71717a', marginBottom: '8px' }}>
              ⚡ Activity Status
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#fafafa' }}>
              {stats.activityStatus}
            </div>
          </div>
        </div>

        {/* Achievements */}
        {badges && badges.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#fafafa',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #27272a',
            }}>
              🏆 Achievements ({badges.length})
            </h2>
            {badges.map((badge) => (
              <div
                key={badge.id}
                style={{
                  padding: '14px 0',
                  borderBottom: '1px solid #27272a',
                }}
              >
                <span style={{ fontWeight: 600, color: '#a78bfa', fontSize: '16px' }}>
                  {badge.name}
                </span>
                <span style={{ fontSize: '13px', color: '#71717a', marginLeft: '10px' }}>
                  ({badge.rarity})
                </span>
                <div style={{ fontSize: '15px', color: '#a1a1aa', marginTop: '6px' }}>
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid #27272a',
          textAlign: 'center',
          fontSize: '15px',
          color: '#52525b',
        }}>
          Generated by Wallet Story Explorer • {new Date().toLocaleDateString()}
        </div>
      </div>
    );
  }
);

WalletStoryExport.displayName = "WalletStoryExport";
