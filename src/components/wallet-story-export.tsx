import { forwardRef } from "react";
import { AnalysisResult } from "@/lib/types";

type WalletStoryExportProps = {
  result: AnalysisResult;
  address: string;
};

/**
 * LIGHT THEME EXPORT COMPONENT
 * 
 * This component is designed ONLY for PNG/PDF export.
 * - Uses explicit inline styles (NO Tailwind, NO CSS variables)
 * - White background with dark text for reliable rendering
 * - Fixed dimensions for consistent output
 * - No animations, gradients, or opacity tricks
 */
export const WalletStoryExport = forwardRef<HTMLDivElement, WalletStoryExportProps>(
  ({ result, address }, ref) => {
    const { personalityData, stats, badges } = result;
    
    const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

    // Inline styles only - no Tailwind classes
    const styles = {
      container: {
        position: 'absolute' as const,
        top: '-9999px',
        left: '0',
        width: '1080px',
        minHeight: '1350px',
        backgroundColor: '#ffffff',
        color: '#111111',
        padding: '48px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        boxSizing: 'border-box' as const,
        visibility: 'visible' as const,
        opacity: 1,
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e5e7eb',
      },
      logo: {
        fontSize: '24px',
        fontWeight: 700,
        color: '#4f46e5',
      },
      addressText: {
        fontSize: '16px',
        fontFamily: 'monospace',
        color: '#6b7280',
      },
      title: {
        fontSize: '48px',
        fontWeight: 700,
        color: '#111111',
        marginBottom: '16px',
        textAlign: 'center' as const,
        lineHeight: 1.2,
      },
      summary: {
        fontSize: '20px',
        color: '#444444',
        textAlign: 'center' as const,
        marginBottom: '32px',
        lineHeight: 1.5,
      },
      sectionTitle: {
        fontSize: '18px',
        fontWeight: 600,
        color: '#111111',
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e5e7eb',
      },
      traitsContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '32px',
      },
      trait: {
        backgroundColor: '#f3f4f6',
        color: '#333333',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 500,
        border: '1px solid #e5e7eb',
      },
      storySection: {
        marginBottom: '32px',
      },
      storyText: {
        fontSize: '16px',
        color: '#333333',
        lineHeight: 1.8,
        whiteSpace: 'pre-wrap' as const,
      },
      statsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '32px',
      },
      statCard: {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
      },
      statLabel: {
        fontSize: '14px',
        color: '#666666',
        marginBottom: '4px',
      },
      statValue: {
        fontSize: '24px',
        fontWeight: 600,
        color: '#111111',
      },
      badgesSection: {
        marginBottom: '32px',
      },
      badgeItem: {
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6',
      },
      badgeName: {
        fontWeight: 600,
        color: '#2563eb',
      },
      badgeRarity: {
        fontSize: '12px',
        color: '#666666',
        marginLeft: '8px',
      },
      badgeDescription: {
        fontSize: '14px',
        color: '#555555',
        marginTop: '4px',
      },
      footer: {
        marginTop: 'auto',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center' as const,
        fontSize: '14px',
        color: '#888888',
      },
    };

    return (
      <div ref={ref} style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>🔮 Wallet Story</div>
          <div style={styles.addressText}>{truncatedAddress}</div>
        </div>

        {/* Title & Summary */}
        <h1 style={styles.title}>{personalityData.personalityTitle}</h1>
        <p style={styles.summary}>{personalityData.oneLineSummary}</p>

        {/* Traits */}
        <div style={styles.traitsContainer}>
          {personalityData.traits.map((trait, index) => (
            <span key={index} style={styles.trait}>{trait}</span>
          ))}
        </div>

        {/* Personality Story */}
        <div style={styles.storySection}>
          <h2 style={styles.sectionTitle}>Personality Story</h2>
          <p style={styles.storyText}>{personalityData.personalityStory}</p>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Wallet Age</div>
            <div style={styles.statValue}>{stats.walletAge} days</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Transactions</div>
            <div style={styles.statValue}>{stats.txCount.toLocaleString()}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>ETH Balance</div>
            <div style={styles.statValue}>{parseFloat(stats.balance).toFixed(4)} ETH</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Activity Status</div>
            <div style={styles.statValue}>{stats.activityStatus}</div>
          </div>
        </div>

        {/* Achievements */}
        {badges && badges.length > 0 && (
          <div style={styles.badgesSection}>
            <h2 style={styles.sectionTitle}>Achievements ({badges.length})</h2>
            {badges.map((badge) => (
              <div key={badge.id} style={styles.badgeItem}>
                <span style={styles.badgeName}>{badge.name}</span>
                <span style={styles.badgeRarity}>({badge.rarity})</span>
                <div style={styles.badgeDescription}>{badge.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          Generated by Wallet Story Explorer
        </div>
      </div>
    );
  }
);

WalletStoryExport.displayName = "WalletStoryExport";
