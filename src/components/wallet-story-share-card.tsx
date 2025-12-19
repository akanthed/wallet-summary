import { forwardRef } from "react";
import { AnalysisResult } from "@/lib/types";

type WalletStoryShareCardProps = {
  result: AnalysisResult;
  address: string;
};

/**
 * SQUARE SHARE CARD COMPONENT
 * 
 * 1080 × 1080 px social-media friendly image
 * - Dark theme matching brand
 * - Compact, punchy, visual summary
 * - Optimized for X, LinkedIn, WhatsApp sharing
 * - NO gradients, blur, or animations
 */
export const WalletStoryShareCard = forwardRef<HTMLDivElement, WalletStoryShareCardProps>(
  ({ result, address }, ref) => {
    const { personalityData, stats } = result;
    
    const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    
    // Only show first 3 traits
    const displayTraits = personalityData.traits.slice(0, 3);
    
    // Pick 2 most interesting stats
    const statItems = [
      { label: 'Wallet Age', value: `${stats.walletAge} days` },
      { label: 'Activity', value: stats.activityStatus },
    ];

    return (
      <div
        ref={ref}
        id="wallet-share-card"
        style={{
          width: '1080px',
          height: '1080px',
          backgroundColor: '#0b0b10',
          color: '#ffffff',
          padding: '64px',
          fontFamily: 'system-ui, -apple-system, Arial, sans-serif',
          boxSizing: 'border-box',
          position: 'fixed',
          left: '-9999px',
          top: '0',
          zIndex: -1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#a78bfa',
            letterSpacing: '0.5px',
          }}>
            🔮 Wallet Story Explorer
          </div>
          <div style={{
            fontSize: '20px',
            fontFamily: 'Consolas, Monaco, monospace',
            color: '#71717a',
          }}>
            {truncatedAddress}
          </div>
        </div>

        {/* Main Content - Center */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: '32px',
        }}>
          {/* Personality Title */}
          <h1 style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.1,
            maxWidth: '900px',
          }}>
            {personalityData.personalityTitle}
          </h1>

          {/* Punch Line */}
          <p style={{
            fontSize: '28px',
            color: '#a1a1aa',
            margin: 0,
            lineHeight: 1.4,
            maxWidth: '800px',
          }}>
            {personalityData.oneLineSummary}
          </p>

          {/* Traits */}
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '16px',
          }}>
            {displayTraits.map((trait, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#1f1f23',
                  color: '#e4e4e7',
                  padding: '14px 28px',
                  borderRadius: '50px',
                  fontSize: '22px',
                  fontWeight: 500,
                  border: '1px solid #3f3f46',
                }}
              >
                {trait}
              </span>
            ))}
          </div>

          {/* Key Stats */}
          <div style={{
            display: 'flex',
            gap: '48px',
            marginTop: '24px',
          }}>
            {statItems.map((stat, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontSize: '18px',
                  color: '#71717a',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 600,
                  color: '#ffffff',
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #27272a',
          paddingTop: '24px',
        }}>
          <div style={{
            fontSize: '18px',
            color: '#52525b',
          }}>
            Generated on Wallet Story Explorer
          </div>
          <div style={{
            fontSize: '18px',
            color: '#a78bfa',
            fontWeight: 500,
          }}>
            What's your wallet story?
          </div>
        </div>
      </div>
    );
  }
);

WalletStoryShareCard.displayName = "WalletStoryShareCard";
