import { useState } from 'react';
import styles from './ShareButton.module.css';

interface ShareButtonProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  onShare?: (platform: string) => void;
  compact?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : 'https://pseudorun.com',
  title = 'PseudoRun - #1 IGCSE Pseudocode Editor',
  description = 'Practice IGCSE pseudocode with PseudoRun - the free online editor for Computer Science students',
  hashtags = ['IGCSE', 'ComputerScience', 'Pseudocode', 'PseudoRun'],
  onShare,
  compact = false
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + ' ' + description)}&hashtags=${hashtags.join(',')}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(description)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + description + ' ' + url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`
  };

  const handleShare = async (platform: string) => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    }

    onShare?.(platform);
    setShowShareMenu(false);

    // Track share event for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'social_share', {
        platform,
        url,
        title
      });
    }
  };

  if (compact) {
    return (
      <div className={styles.shareButtonCompact}>
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className={styles.shareToggle}
          aria-label="Share PseudoRun"
        >
          <span className={styles.shareIcon}>📤</span>
        </button>

        {showShareMenu && (
          <div className={styles.shareMenuCompact}>
            <button onClick={() => handleShare('twitter')} className={styles.shareOption}>
              <span className={styles.platformIcon}>𝕏</span>
            </button>
            <button onClick={() => handleShare('facebook')} className={styles.shareOption}>
              <span className={styles.platformIcon}>📘</span>
            </button>
            <button onClick={() => handleShare('linkedin')} className={styles.shareOption}>
              <span className={styles.platformIcon}>💼</span>
            </button>
            <button onClick={() => handleShare('whatsapp')} className={styles.shareOption}>
              <span className={styles.platformIcon}>💬</span>
            </button>
            <button onClick={() => handleShare('copy')} className={styles.shareOption}>
              <span className={styles.platformIcon}>{copied ? '✅' : '📋'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.shareButton}>
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className={styles.shareToggle}
        aria-label="Share PseudoRun with friends"
      >
        <span className={styles.shareIcon}>📤</span>
        Share PseudoRun
      </button>

      {showShareMenu && (
        <div className={styles.shareMenu}>
          <div className={styles.shareHeader}>
            <h4>Share PseudoRun</h4>
            <p>Help other IGCSE students discover the best pseudocode tool!</p>
          </div>

          <div className={styles.shareOptions}>
            <button
              onClick={() => handleShare('twitter')}
              className={styles.shareOption}
              aria-label="Share on Twitter"
            >
              <span className={styles.platformIcon}>𝕏</span>
              <div className={styles.platformInfo}>
                <span className={styles.platformName}>Twitter</span>
                <span className={styles.platformDesc}>Share with IGCSE students</span>
              </div>
            </button>

            <button
              onClick={() => handleShare('facebook')}
              className={styles.shareOption}
              aria-label="Share on Facebook"
            >
              <span className={styles.platformIcon}>📘</span>
              <div className={styles.platformInfo}>
                <span className={styles.platformName}>Facebook</span>
                <span className={styles.platformDesc}>Share with classmates</span>
              </div>
            </button>

            <button
              onClick={() => handleShare('linkedin')}
              className={styles.shareOption}
              aria-label="Share on LinkedIn"
            >
              <span className={styles.platformIcon}>💼</span>
              <div className={styles.platformInfo}>
                <span className={styles.platformName}>LinkedIn</span>
                <span className={styles.platformDesc}>Share with educators</span>
              </div>
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              className={styles.shareOption}
              aria-label="Share on WhatsApp"
            >
              <span className={styles.platformIcon}>💬</span>
              <div className={styles.platformInfo}>
                <span className={styles.platformName}>WhatsApp</span>
                <span className={styles.platformDesc}>Share with study groups</span>
              </div>
            </button>

            <button
              onClick={() => handleShare('email')}
              className={styles.shareOption}
              aria-label="Share via email"
            >
              <span className={styles.platformIcon}>📧</span>
              <div className={styles.platformInfo}>
                <span className={styles.platformName}>Email</span>
                <span className={styles.platformDesc}>Share with teachers</span>
              </div>
            </button>

            <button
              onClick={() => handleShare('copy')}
              className={styles.shareOption}
              aria-label="Copy link to clipboard"
            >
              <span className={styles.platformIcon}>{copied ? '✅' : '📋'}</span>
              <div className={styles.platformInfo}>
                <span className={styles.platformName}>Copy Link</span>
                <span className={styles.platformDesc}>{copied ? 'Copied!' : 'Copy PseudoRun URL'}</span>
              </div>
            </button>
          </div>

          <div className={styles.shareFooter}>
            <p className={styles.shareImpact}>
              🎯 Help 10,000+ IGCSE students master pseudocode with PseudoRun
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;