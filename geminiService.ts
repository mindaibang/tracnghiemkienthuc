
import { GoogleGenAI, Type } from "@google/genai";
import { QuizConfig, Question, Flashcard, Language, Mode } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateContent(config: QuizConfig): Promise<{ questions?: Question[], flashcards?: Flashcard[] }> {
  const { dataSource, isUrl, mode, language, numberOfQuestions, difficulty } = config;
  const isFlashcard = mode === Mode.FLASHCARD;

  const systemInstruction = `
    Bạn là hệ thống AI tạo nội dung cho ứng dụng "Trắc nghiệm kiến thức".
    NGUYÊN TẮC BẮT BUỘC:
    1. CHỈ sử dụng nội dung từ dữ liệu người dùng cung cấp. TUYỆT ĐỐI KHÔNG tự bổ sung kiến thức bên ngoài hoặc suy diễn ngoài tài liệu.
    2. Nếu nội dung không đủ để tạo số lượng yêu cầu, hãy tự điều chỉnh số lượng thực tế dựa trên tài liệu nhưng không vượt quá ${numberOfQuestions}.
    3. Ngôn ngữ: ${language === Language.VI ? 'Tiếng Việt (VI)' : 'English (EN)'}. Toàn bộ nội dung trả về phải sử dụng ngôn ngữ này.
    4. Đối với QUIZ (Practice/Exam): 
       - easy: nhận biết, nhớ thông tin.
       - medium: hiểu, giải thích.
       - hard: tổng hợp, suy luận từ nội dung.
    5. Đối với FLASHCARD:
       - Tập trung vào các khái niệm, định nghĩa, sự kiện, số liệu quan trọng.
       - Ngắn gọn, dễ nhớ.
    6. Định dạng trả về: JSON array các object.
  `;

  const prompt = isFlashcard ? `
    DỮ LIỆU ĐẦU VÀO: ${isUrl ? `WEBSITE_URL: ${dataSource}` : `DOCUMENT_TEXT: ${dataSource}`}
    THAM SỐ:
    - TAB: flashcard
    - LANGUAGE: ${language}
    - NUMBER_OF_CARDS: ${numberOfQuestions}
    - DIFFICULTY: ${difficulty}

    Hãy tạo danh sách các Flashcard (Front/Back) bám sát nội dung tài liệu.
  ` : `
    DỮ LIỆU ĐẦU VÀO: ${isUrl ? `WEBSITE_URL: ${dataSource}` : `DOCUMENT_TEXT: ${dataSource}`}
    THAM SỐ:
    - TAB: quiz
    - MODE: ${mode}
    - LANGUAGE: ${language}
    - NUMBER_OF_QUESTIONS: ${numberOfQuestions}
    - DIFFICULTY: ${difficulty}

    Hãy tạo danh sách câu hỏi trắc nghiệm (4 lựa chọn A-B-C-D) bám sát nội dung tài liệu.
  `;

  const responseSchema = isFlashcard ? {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        front: { type: Type.STRING },
        back: { type: Type.STRING }
      },
      required: ["id", "front", "back"]
    }
  } : {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        text: { type: Type.STRING },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING }
            },
            required: ["id", "text"]
          }
        },
        correctAnswer: { type: Type.STRING },
        explanation: { type: Type.STRING }
      },
      required: ["id", "text", "options", "correctAnswer", "explanation"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
        tools: isUrl ? [{ googleSearch: {} }] : []
      }
    });

    const data = JSON.parse(response.text || "[]");
    return isFlashcard ? { flashcards: data as Flashcard[] } : { questions: data as Question[] };
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error(language === Language.VI 
      ? "Không thể tạo nội dung từ tài liệu này. Vui lòng kiểm tra lại nguồn dữ liệu hoặc thử nội dung khác." 
      : "Could not generate content from this document. Please check the source or try different content.");
  }
}
