const languages = ["tamil", "hindi", "telugu", "malayalam", "kannada", "punjabi", "bengali", "marathi", "english"];

const detectLanguage = (text) => {
  const lowercaseText = text.toLowerCase();
  
  for (const lang of languages) {
    if (lowercaseText.includes(lang)) {
      return lang;
    }
  }
  
  if (lowercaseText.includes("all languages") || lowercaseText.includes("any")) {
    return "all";
  }
  
  return "all"; // Default to all if not explicitly stated
};

const getSearchQueriesForLanguage = (language) => {
  const queries = {
    "tamil": ["tamil hits", "ARR tamil", "Anirudh tamil"],
    "hindi": ["bollywood hits", "Arijit Singh", "hindi pop"],
    "telugu": ["telugu hits", "DSP telugu", "thaman telugu"],
    "malayalam": ["malayalam hits", "malayalam pop"],
    "kannada": ["kannada hits"],
    "punjabi": ["punjabi hits", "Diljit Dosanjh", "AP Dhillon"],
    "english": ["pop hits", "top 50 global"],
    "bengali": ["bengali hits"],
    "marathi": ["marathi hits"]
  };
  
  if (language === "all") {
    // Return a mix of popular queries
    return [
      "tamil hits", "bollywood hits", "telugu hits", "punjabi hits", "pop hits"
    ];
  }
  
  return queries[language] || ["hits"];
};

module.exports = {
  detectLanguage,
  getSearchQueriesForLanguage
};
