const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const languageSelect = document.getElementById("language-select");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

let currentLang = 'en-IN';
let selectedVoice = null;

// Load voices for speech synthesis
function loadVoices() {
  const voices = speechSynthesis.getVoices();
  const langCode = currentLang.toLowerCase();

  // Try finding a voice that matches the language
  selectedVoice = voices.find(voice => voice.lang.toLowerCase() === langCode);

  // If exact match not found, fallback to voice with same language prefix
  if (!selectedVoice) {
    selectedVoice = voices.find(voice => voice.lang.toLowerCase().startsWith(langCode.split('-')[0]));
  }

  // Fallback to first voice
  if (!selectedVoice && voices.length > 0) {
    selectedVoice = voices[0];
  }
}

// Load voices after they're available
window.speechSynthesis.onvoiceschanged = loadVoices;

// Append message to chat
function appendMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender;
  msgDiv.innerText = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send user message
window.sendMessage = function () {
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage(message, "user");
  userInput.value = "";

  setTimeout(() => {
    const botReply = getBotReply(message);
    appendMessage(botReply, "bot");
    speak(botReply);
  }, 500);
}

// Static bot replies per language
function getBotReply(input) {
  const lang = currentLang.split('-')[0];
  const lower = input.toLowerCase();

  switch (lang) {
    case 'en':
      if (lower.includes("hello")) return "Hello and very Good Morning Sir/Ma'am, May I speak with you?";
      if(lower.includes("yes")) return " My name is Veena and I am an Executive calling on behalf of ValuEnable Life Insurance Co. Ltd, this is a service call with regards to your life insurance policy. Is this the right time to speak to you regarding the renewal of your policy?";
      if (lower.includes("today")) return "When would be a convenient time to call you again to provide the information about your policy with us? Please can you give a time and date?";
      if(lower.includes("no")) return " May I know your relationship with Vaishnavi? Do you handle Vaishnavi's life insurance policy number 111122223333? Are you aware of the details of this policy? " ;
      if(lower.includes("busy")) return "It will take just 2 minutes of your time. Can we discuss it right now or should I reschedule your call at a better time?";
      if (lower.includes("ok")) return "Let me start by confirming your policy details. Your policy is ValuEnable Life insurance policy number is 111122223333, started on 1 Feburary 2020, and you've paid 1 lakh so far. The premium of 2 lakhs due on 1 August 2024 is still pending, and your policy is currently in “Discontinuance” status, with no life insurance cover. Could you please let me know why you haven’t been able to pay the premium? ";
      if (lower.includes("financial"||"interest")) return " I would like to inform you that the due date for renewal premium payment for your policy was on 1 August 2024, the grace period for your policy is over due to non-payment of the regular premium and you are losing the benefit of your plan. Would you like to know what your policy's benefits you could get if you resume paying premiums? ";
      if (lower.includes("right"||"contin"||"not read")) return "Sir, you will get maximum Allocation in the Invested Fund i. e % of Premium which will boost up your investment. Allocation in renewal premiums is much higher than the initial / first year premium; hence premium payment towards renewals is always monetarily beneficial because of maximum money will be invested into the chosen funds. Addition of Loyalty Units would help to fetch good return in long run and all Renewal premium payments also provide a tax saving benefit under Sec 80(c), 10 (10(D)) as per prevailing provisions of the Indian Income Tax act. Does this help you make a more informed decision about your policy? ";
      
      if (lower.includes("day")) return "Thank you sir/maam, I will arrange your call back at the given time. ";
      return "Sorry, I didn't understand that.";
    case 'hi':
      if (lower.includes("नमस्ते") || lower.includes("हैलो")) return "नमस्ते! मैं आपकी मदद कैसे कर सकती हूँ?";
      return "माफ़ कीजिए, मैं समझ नहीं पाई।";
    case 'ta':
      if (lower.includes("வணக்கம்")) return "வணக்கம்! எப்படி உதவ வேண்டும்?";
      return "மன்னிக்கவும், எனக்கு புரியவில்லை.";
    case 'gu':
      if (lower.includes("હાય") || lower.includes("નમસ્તે")) return "હાય! હું કેવી રીતે મદદ કરી શકું?";
      return "માફ કરશો, હું સમજી શકી નહીં.";
    default:
      return "Language not supported.";
  }
}

// Speak with selected voice
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLang;
  if (selectedVoice) utterance.voice = selectedVoice;
  speechSynthesis.speak(utterance);
}

// Start voice input
window.startVoice = function () {
  recognition.lang = currentLang;
  recognition.start();

  recognition.onresult = (event) => {
    const voiceInput = event.results[0][0].transcript;
    userInput.value = voiceInput;
    sendMessage();
  };

  recognition.onerror = (event) => {
    alert("Voice recognition error: " + event.error);
  };
}

// Change language
window.changeLanguage = function () {
  currentLang = languageSelect.value;
  loadVoices();
}

// Initial voice load
loadVoices();