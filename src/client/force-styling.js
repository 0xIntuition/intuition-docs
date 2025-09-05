/**
 * Force dark theme styling - THE NUCLEAR OPTION
 * This JavaScript will run on the client and forcibly override any remaining white backgrounds
 */

export default function forceStyling() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyStyling);
  } else {
    applyStyling();
  }
  
  // Also apply on theme changes or page navigation
  if (typeof window !== 'undefined') {
    // Apply every second to catch any dynamic content
    setInterval(applyStyling, 1000);
  }
}

function applyStyling() {
  if (typeof document === 'undefined') return;
  
  const homepage = document.querySelector('.homepage');
  if (!homepage) return;
  
  // ULTIMATE NUCLEAR APPROACH: Force ALL elements to follow dark theme
  const allElements = homepage.querySelectorAll('*');
  let modifiedCount = 0;
  
  allElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const bgColor = computedStyle.backgroundColor;
    const textColor = computedStyle.color;
    
    // Detect any white/light backgrounds and force them dark
    const isWhiteBg = bgColor === 'rgb(255, 255, 255)' || 
                      bgColor === 'rgba(255, 255, 255, 1)' ||
                      bgColor === 'rgb(249, 250, 251)' || 
                      bgColor === 'rgb(243, 244, 246)' || 
                      bgColor === 'rgb(229, 231, 235)' ||
                      bgColor === 'rgb(209, 213, 219)' ||
                      bgColor === 'rgba(255, 255, 255, 0.8)' ||
                      bgColor === 'rgba(249, 250, 251, 0.8)' ||
                      bgColor.includes('255, 255, 255') ||
                      bgColor.includes('249, 250, 251') ||
                      bgColor.includes('243, 244, 246');
    
    if (isWhiteBg) {
      element.style.setProperty('background', 'rgba(255, 255, 255, 0.03)', 'important');
      element.style.setProperty('background-color', 'rgba(255, 255, 255, 0.03)', 'important');
      element.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.12)', 'important');
      element.style.setProperty('backdrop-filter', 'blur(24px)', 'important');
      element.style.setProperty('box-shadow', '0 8px 32px rgba(0, 0, 0, 0.37)', 'important');
      modifiedCount++;
    }
    
    // Force any black text to be white
    const isBlackText = textColor === 'rgb(0, 0, 0)' || 
                        textColor === 'rgba(0, 0, 0, 1)' ||
                        textColor === '#000000' || 
                        textColor === 'rgb(17, 24, 39)' ||
                        textColor === 'rgb(55, 65, 81)';
                        
    if (isBlackText) {
      element.style.setProperty('color', '#ffffff', 'important');
    }
  });
  
  // Force section backgrounds absolutely
  const sections = homepage.querySelectorAll('section, div[class*="section"], .noise-bg');
  sections.forEach(section => {
    section.style.setProperty('background', '#000000', 'important');
    section.style.setProperty('background-color', '#000000', 'important');
    section.style.setProperty('color', '#ffffff', 'important');
  });
  
  // TARGET VERY SPECIFIC BUTTON AND CARD PATTERNS
  const buttons = homepage.querySelectorAll('button, .btn, [role="button"]');
  buttons.forEach(button => {
    const bg = window.getComputedStyle(button).backgroundColor;
    if (bg.includes('255, 255, 255') || bg.includes('249, 250, 251')) {
      button.style.setProperty('background', 'rgba(255, 255, 255, 0.03)', 'important');
      button.style.setProperty('background-color', 'rgba(255, 255, 255, 0.03)', 'important');
      button.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.12)', 'important');
      button.style.setProperty('color', '#ffffff', 'important');
    }
  });
  
  // TARGET CARDS WITH EXTREME SPECIFICITY
  const cardSelectors = [
    'div.overflow-hidden', 'a.overflow-hidden',
    'div.rounded-xl', 'a.rounded-xl', 
    'div.rounded-2xl', 'a.rounded-2xl',
    'div.border', 'a.border',
    'div.shadow-md', 'a.shadow-md',
    '.guide-item', '.sample-item', '.resource-card',
    'a.group', 'div.group'
  ];
  
  cardSelectors.forEach(selector => {
    const elements = homepage.querySelectorAll(selector);
    elements.forEach(element => {
      element.style.setProperty('background', 'rgba(255, 255, 255, 0.03)', 'important');
      element.style.setProperty('background-color', 'rgba(255, 255, 255, 0.03)', 'important');
      element.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.12)', 'important');
      element.style.setProperty('backdrop-filter', 'blur(24px)', 'important');
      element.style.setProperty('color', '#ffffff', 'important');
    });
  });
  
  console.log(`ULTIMATE NUCLEAR styling applied - modified ${modifiedCount} white elements`);
}

// Auto-run the function
forceStyling();