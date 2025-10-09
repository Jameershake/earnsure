import fs from 'fs';
import fetch from 'node-fetch';

// Configuration
const CONFIG = {
  inputFile: 'public/locales/en/translation.json',
  outputFolder: 'public/locales',
  languages: [
    { code: 'hi', name: 'Hindi' },
    { code: 'te', name: 'Telugu' }
  ],
  delayBetweenRequests: 100 // milliseconds to avoid rate limiting
};

// Sleep function to add delay between requests
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to translate a single text using Google Translate API
async function translateText(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  try {
    await sleep(CONFIG.delayBetweenRequests); // Prevent rate limiting
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const translatedText = data[0][0][0];
    
    return translatedText;
  } catch (error) {
    console.error(`   ❌ Error translating "${text}": ${error.message}`);
    return text; // Return original text if translation fails
  }
}

// Function to recursively translate entire JSON object
async function translateObject(obj, targetLang, path = '') {
  // If it's a string, translate it
  if (typeof obj === 'string') {
    const translated = await translateText(obj, targetLang);
    console.log(`   ✓ ${path}: "${obj}" → "${translated}"`);
    return translated;
  }
  
  // If it's an object, translate all its values recursively
  if (typeof obj === 'object' && obj !== null) {
    const result = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
      const newPath = path ? `${path}.${key}` : key;
      result[key] = await translateObject(obj[key], targetLang, newPath);
    }
    
    return result;
  }
  
  // For other types (numbers, booleans, null), return as-is
  return obj;
}

// Main translation function
async function translateToLanguage(englishData, language) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 Translating to ${language.name} (${language.code})...`);
  console.log('='.repeat(60));
  
  const startTime = Date.now();
  
  try {
    const translated = await translateObject(englishData, language.code);
    
    // Create output directory if it doesn't exist
    const outputDir = `${CONFIG.outputFolder}/${language.code}`;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write translated JSON to file
    const outputPath = `${outputDir}/translation.json`;
    fs.writeFileSync(
      outputPath,
      JSON.stringify(translated, null, 2),
      'utf-8'
    );
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ ${language.name} translation completed in ${duration}s`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
  } catch (error) {
    console.error(`\n❌ Failed to translate to ${language.name}:`, error.message);
    return false;
  }
}

// Helper function to count total translation keys
function countKeys(obj) {
  let count = 0;
  
  function traverse(o) {
    for (const key in o) {
      if (typeof o[key] === 'string') {
        count++;
      } else if (typeof o[key] === 'object' && o[key] !== null) {
        traverse(o[key]);
      }
    }
  }
  
  traverse(obj);
  return count;
}

// Main execution function
async function main() {
  console.clear();
  console.log('\n' + '='.repeat(60));
  console.log('🌍 EarnSure Automatic Translation Script');
  console.log('='.repeat(60));
  
  // Check if input file exists
  if (!fs.existsSync(CONFIG.inputFile)) {
    console.error(`\n❌ Error: Input file not found: ${CONFIG.inputFile}`);
    console.log('\n💡 Please create the English translation file first at:');
    console.log(`   ${CONFIG.inputFile}`);
    process.exit(1);
  }
  
  // Read English translation file
  let englishData;
  try {
    const fileContent = fs.readFileSync(CONFIG.inputFile, 'utf-8');
    englishData = JSON.parse(fileContent);
    console.log(`\n✓ Loaded English translation file`);
    console.log(`  Total translation keys: ${countKeys(englishData)}`);
  } catch (error) {
    console.error(`\n❌ Error reading input file: ${error.message}`);
    process.exit(1);
  }
  
  // Translate to each target language
  const results = [];
  for (const language of CONFIG.languages) {
    const success = await translateToLanguage(englishData, language);
    results.push({ language: language.name, success });
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Translation Summary');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.language}: ${result.success ? 'Success' : 'Failed'}`);
  });
  
  console.log('\n🎉 All translations completed!');
  console.log('='.repeat(60) + '\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
