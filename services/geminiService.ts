import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Tu es le "Coach Énergie", un assistant expert dédié aux apporteurs d'affaires du réseau "Système de Parrainage National - Énergie Renouvelable".
Ta mission est d'aider les parrains à convaincre des propriétaires de maisons individuelles d'installer des solutions écologiques (Panneaux solaires, Pompes à chaleur, Isolation).

Tes capacités :
1. Rédiger des messages d'approche (SMS, Email, Scripts téléphoniques) professionnels et conviviaux.
2. Expliquer simplement des concepts techniques (ex: kWc, COP, RGE, MaPrimeRénov').
3. Aider à traiter les objections courantes (ex: "C'est trop cher", "Je n'ai pas confiance", "Je verrai plus tard").
4. Calculer des estimations rapides de rentabilité ou d'économies.

Ton ton doit être :
- Encouragent et motivant pour le parrain.
- Professionnel, clair et honnête.
- Orienté vers l'action (aider à obtenir un rendez-vous).

Informations clés sur le programme :
- Panneaux solaires : 500€ à 1200€ de commission.
- Pompe à chaleur : 300€ à 800€ de commission.
- Isolation : 400€ à 600€ de commission.
- L'entreprise s'occupe de tout une fois le lead transmis (technique, admin, travaux).
`;

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.warn("API_KEY is missing from environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const sendMessageToCoach = async (
  message: string, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // We use a chat model for conversation
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history
    });

    const response = await chat.sendMessage({ message });
    return response.text || "Désolé, je n'ai pas pu générer de réponse pour le moment.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Une erreur est survenue lors de la communication avec le Coach Énergie. Vérifiez votre clé API.";
  }
};