// SeaLevelRiseChart Button Positioning Constants
// DO NOT MODIFY THESE VALUES WITHOUT EXPLICIT APPROVAL

export const BUTTON_POSITIONS = {
  // Main controls container
  CONTAINER: {
    left: '100%',
    top: '-150px',
    height: '200px'
  },
  
  // Select Parameter Image
  SELECT_PARAMETER: {
    left: '6px',
    top: '-120px',
    width: '400px',
    height: '200px'
  },
  
  // Temperature buttons
  TEMP_2C: {
    left: '140px',
    top: '120px',
    width: '80px',
    height: '80px'
  },
  
  TEMP_4C: {
    left: '240px',
    top: '160px',
    width: '80px',
    height: '80px'
  },
  
  // Year buttons
  YEAR_2050: {
    left: '140px',
    top: '-20px',
    width: '120px',
    height: '120px'
  },
  
  YEAR_2100: {
    left: '260px',
    top: '0px',
    width: '120px',
    height: '120px'
  }
};

// Chart dimensions
export const CHART_DIMENSIONS = {
  container: {
    width: '100%',
    height: '400px'
  },
  chartArea: {
    height: '350px'
  }
};

// Global sea level rise predictions
export const GLOBAL_SEA_LEVEL_RISE = {
  '2050': {
    '2': 0.22,
    '4': 0.22
  },
  '2100': {
    '2': 0.47,
    '4': 0.63
  }
}; 