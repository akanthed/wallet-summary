import { forwardRef } from 'react';
import { AnalysisResult } from '@/lib/types';

type Props = {
  result: AnalysisResult;
  address?: string;
};

export const WalletStoryShareCard = forwardRef<HTMLDivElement, Props>(({ result, address }, ref) => {
  const { personalityData, stats } = result;
  const title = personalityData?.personalityTitle || 'Wallet Story';
  const punch = personalityData?.oneLineSummary || '';
  const traits = personalityData?.traits?.slice(0, 3) || [];

  const containerStyle: React.CSSProperties = {
    width: '1080px',
    height: '1080px',
    backgroundColor: '#0b0b10',
    color: '#ffffff',
    padding: '48px',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const appNameStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#c7b9ff',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 700,
    textAlign: 'center' as const,
    color: '#ffffff',
    margin: '40px 0 8px 0',
    lineHeight: 1.05,
  };

  const punchStyle: React.CSSProperties = {
    fontSize: '18px',
    textAlign: 'center' as const,
    color: '#e6e6e6',
    marginBottom: '20px',
  };

  const traitsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '28px',
  };

  const pillStyle: React.CSSProperties = {
    padding: '8px 14px',
    backgroundColor: '#111215',
    color: '#eaeaea',
    borderRadius: '999px',
    fontSize: '14px',
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '28px',
    marginTop: '12px',
  };

  const statBox: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  };

  const statValue: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 700,
    color: '#ffffff',
  };

  const statLabel: React.CSSProperties = {
    fontSize: '12px',
    color: '#b3b3b3',
    marginTop: '6px',
  };

  const footerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '36px',
    left: '48px',
    fontSize: '12px',
    color: '#9b9b9b',
  };

  return (
    <div ref={ref} style={containerStyle} id="wallet-share-card">
      <div style={headerStyle}>
        <div style={appNameStyle}>Wallet Story Explorer</div>
        <div style={{ fontSize: 12, color: '#7b7b7b' }}>{address ? `${address.substring(0,6)}...${address.slice(-4)}` : ''}</div>
      </div>

      <div>
        <div style={titleStyle}>{title}</div>
        <div style={punchStyle}>{punch}</div>
        <div style={traitsStyle}>
          {traits.map((t, i) => (
            <div key={i} style={pillStyle}>{t}</div>
          ))}
        </div>

        <div style={statsStyle}>
          <div style={statBox}>
            <div style={statValue}>{stats.walletAge}d</div>
            <div style={statLabel}>Wallet Age</div>
          </div>
          <div style={statBox}>
            <div style={statValue}>{stats.activityStatus}</div>
            <div style={statLabel}>Activity</div>
          </div>
        </div>
      </div>

      <div style={footerStyle}>Generated on Wallet Story Explorer</div>
    </div>
  );
});

WalletStoryShareCard.displayName = 'WalletStoryShareCard';
