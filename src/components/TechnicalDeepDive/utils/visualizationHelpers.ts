// Helper functions for data visualization and animations

export interface AnimationFrame {
  timestamp: number;
  state: any;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }>;
}

// AST visualization helpers
export const renderASTNode = (node: any, depth: number = 0): string => {
  if (!node) return '';

  const indent = '  '.repeat(depth);
  let output = `${indent}${node.type}`;

  if (node.value) {
    output += `: "${node.value}"`;
  }

  if (node.dataType) {
    output += ` (${node.dataType})`;
  }

  output += '\n';

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      output += renderASTNode(child, depth + 1);
    }
  }

  return output;
};

export const flattenAST = (node: any, flat: any[] = []): any[] => {
  if (!node) return flat;

  flat.push({
    type: node.type,
    value: node.value,
    dataType: node.dataType,
    line: node.line,
    children: node.children?.length || 0
  });

  if (node.children) {
    for (const child of node.children) {
      flattenAST(child, flat);
    }
  }

  return flat;
};

// Performance chart data generation
export const generatePerformanceData = (metrics: { [key: string]: number }): ChartData => {
  const labels = Object.keys(metrics);
  const data = Object.values(metrics);

  return {
    labels,
    datasets: [{
      label: 'Performance Metrics',
      data,
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2
    }]
  };
};

// Animation frame management
export class AnimationManager {
  private animations: Map<string, AnimationFrame> = new Map();
  private animationFrameId: number | null = null;

  addAnimation(id: string, duration: number, updateFn: (progress: number) => void): void {
    const startTime = performance.now();

    this.animations.set(id, {
      timestamp: startTime,
      state: { duration, updateFn }
    });
  }

  removeAnimation(id: string): void {
    this.animations.delete(id);
  }

  start(): void {
    if (this.animationFrameId) return;

    const animate = (currentTime: number) => {
      let hasActiveAnimations = false;

      for (const [id, frame] of this.animations.entries()) {
        const { duration, updateFn } = frame.state;
        const elapsed = currentTime - frame.timestamp;
        const progress = Math.min(elapsed / duration, 1);

        updateFn(progress);

        if (progress < 1) {
          hasActiveAnimations = true;
        } else {
          this.animations.delete(id);
        }
      }

      if (hasActiveAnimations) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.animationFrameId = null;
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.animations.clear();
  }
}

// SVG diagram generation
export const generatePipelineDiagram = (
  stages: Array<{ name: string; color: string }>,
  width: number = 800,
  height: number = 400
): string => {
  const stageWidth = width / (stages.length + 1);
  const centerY = height / 2;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Draw connections
  for (let i = 0; i < stages.length - 1; i++) {
    const startX = stageWidth * (i + 1) + 30;
    const endX = stageWidth * (i + 2) - 30;
    const y = centerY;

    svg += `<line x1="${startX}" y1="${y}" x2="${endX}" y2="${y}" stroke="rgba(99, 102, 241, 0.3)" stroke-width="2" stroke-dasharray="5,5" />`;

    // Arrow
    svg += `<polygon points="${endX - 35},${y - 5} ${endX - 30},${y} ${endX - 35},${y + 5}" fill="rgba(99, 102, 241, 0.5)" />`;
  }

  // Draw stage boxes
  stages.forEach((stage, index) => {
    const x = stageWidth * (index + 1) - 50;
    const y = centerY - 30;

    svg += `<rect x="${x}" y="${y}" width="100" height="60" rx="8" fill="rgba(255, 255, 255, 0.02)" stroke="${stage.color}" stroke-width="2" />`;
    svg += `<text x="${x + 50}" y="${y + 35}" text-anchor="middle" fill="#e8e8f0" font-size="14" font-weight="500">${stage.name}</text>`;
  });

  svg += '</svg>';
  return svg;
};

// Network diagram generation
export const generateNetworkDiagram = (
  nodes: Array<{ id: string; label: string; x: number; y: number; type: string }>,
  connections: Array<{ from: string; to: string }>,
  width: number = 600,
  height: number = 400
): string => {
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Draw connections
  connections.forEach((conn) => {
    const fromNode = nodes.find(n => n.id === conn.from);
    const toNode = nodes.find(n => n.id === conn.to);

    if (fromNode && toNode) {
      svg += `<line x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}" stroke="rgba(99, 102, 241, 0.3)" stroke-width="2" />`;

      // Arrow
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
      const arrowLength = 15;
      const arrowAngle = Math.PI / 6;

      const arrowX = toNode.x - 40 * Math.cos(angle);
      const arrowY = toNode.y - 40 * Math.sin(angle);

      svg += `<polygon points="${arrowX},${arrowY} ${arrowX - arrowLength * Math.cos(angle - arrowAngle)},${arrowY - arrowLength * Math.sin(angle - arrowAngle)} ${arrowX - arrowLength * Math.cos(angle + arrowAngle)},${arrowY - arrowLength * Math.sin(angle + arrowAngle)}" fill="rgba(99, 102, 241, 0.5)" />`;
    }
  });

  // Draw nodes
  nodes.forEach((node) => {
    const nodeColor = getNodeColor(node.type);
    const nodeRadius = 25;

    svg += `<circle cx="${node.x}" cy="${node.y}" r="${nodeRadius}" fill="${nodeColor}" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2" />`;
    svg += `<text x="${node.x}" y="${node.y + nodeRadius + 15}" text-anchor="middle" fill="#e8e8f0" font-size="12" font-weight="500">${node.label}</text>`;
  });

  svg += '</svg>';
  return svg;
};

// Token visualization
export const visualizeTokens = (tokens: Array<{ type: string; value: string; line: number; column: number }>): string => {
  const tokenColors: { [key: string]: string } = {
    'KEYWORD': '#8b5cf6',
    'IDENTIFIER': '#6366f1',
    'STRING': '#ef4444',
    'NUMBER': '#10b981',
    'OPERATOR': '#f59e0b',
    'ASSIGNMENT': '#f59e0b',
    'COMMENT': '#6b7280',
    'NEWLINE': '#d1d5db',
    'EOF': '#ef4444'
  };

  const container = document.createElement('div');
  container.style.fontFamily = 'Fira Code, monospace';
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.6';

  tokens.forEach((token) => {
    const tokenElement = document.createElement('span');
    tokenElement.style.color = tokenColors[token.type] || '#d1d5db';
    tokenElement.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
    tokenElement.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    tokenElement.style.borderRadius = '4px';
    tokenElement.style.padding = '2px 4px';
    tokenElement.style.margin = '2px';
    tokenElement.style.display = 'inline-block';
    tokenElement.style.fontWeight = '500';
    tokenElement.style.fontSize = '12px';
    tokenElement.style.textTransform = 'uppercase';

    tokenElement.textContent = token.value === '\n' ? '\\n' : token.value;

    container.appendChild(tokenElement);
  });

  return container.innerHTML;
};

// Performance metrics formatting
export const formatMetric = (value: number, type: string): string => {
  switch (type) {
    case 'bytes':
      return formatBytes(value);
    case 'time':
      return formatTime(value);
    case 'percentage':
      return `${(value * 100).toFixed(1)}%`;
    case 'number':
      return formatNumber(value);
    default:
      return value.toString();
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`;
  } else if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(1)}s`;
  } else {
    return `${(milliseconds / 60000).toFixed(1)}m`;
  }
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1
  }).format(num);
};

// Color helpers
function getNodeColor(type: string): string {
  const colors: { [key: string]: string } = {
    'frontend': '#6366f1',
    'lexer': '#8b5cf6',
    'parser': '#ec4899',
    'interpreter': '#f59e0b',
    'debug': '#10b981',
    'storage': '#06b6d4'
  };

  return colors[type] || '#6b7280';
}

// Data processing utilities
export const calculateComplexity = (data: number[]): {
  min: number;
  max: number;
  mean: number;
  median: number;
  standardDeviation: number;
} => {
  if (data.length === 0) {
    return { min: 0, max: 0, mean: 0, median: 0, standardDeviation: 0 };
  }

  const sorted = [...data].sort((a, b) => a - b);
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
  const standardDeviation = Math.sqrt(avgSquaredDiff);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean,
    median,
    standardDeviation
  };
};

// Export all utilities
export default {
  renderASTNode,
  flattenAST,
  generatePerformanceData,
  AnimationManager,
  generatePipelineDiagram,
  generateNetworkDiagram,
  visualizeTokens,
  formatMetric,
  formatBytes,
  formatTime,
  formatNumber,
  calculateComplexity
};