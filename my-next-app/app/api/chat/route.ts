import { NextRequest, NextResponse } from 'next/server';

// Message interface
interface Message {
  id: string;
  text: string;
  sender: 'doctor' | 'patient';
  timestamp: string;
}

// Sample responses based on medical issues
const doctorResponses: Record<string, string[]> = {
  headache: [
    "I understand you're experiencing headaches. How long have you been having them?",
    "Headaches can often be related to stress or dehydration. Have you been drinking enough water?",
    "It sounds like a tension headache. Try staying hydrated and avoid long screen time.",
    "I recommend taking a break from screens and trying some relaxation techniques.",
    "Over-the-counter pain relief might help, but let me know if the headaches persist.",
    "Are you experiencing any nausea or sensitivity to light with these headaches?",
  ],
  backpain: [
    "I see you're having back pain. Can you describe the type of pain you're feeling?",
    "Back pain can improve with gentle stretching and proper sitting posture.",
    "It might be muscle strain. Please maintain good posture and avoid lifting heavy weights.",
    "Try applying heat to the affected area and avoid sudden movements.",
    "If the pain continues, we might need to consider physical therapy options.",
    "How long have you been experiencing this back pain?",
  ],
  fever: [
    "I understand you have a fever. How high is your temperature?",
    "For fever, make sure to rest well and stay hydrated.",
    "Monitor your temperature regularly and take prescribed medication if needed.",
    "Fever is often a sign of infection. Get plenty of rest and fluids.",
    "Are you experiencing any other symptoms along with the fever?",
    "Make sure to keep yourself hydrated and take proper rest.",
  ],
  cough: [
    "I see you have a cough. How long has it been bothering you?",
    "A persistent cough might need some cough syrup or home remedies like honey.",
    "Make sure to stay hydrated and avoid cold beverages.",
    "If the cough continues for more than a week, we should investigate further.",
    "Are you experiencing any chest pain or difficulty breathing with the cough?",
  ],
  general: [
    "Thank you for sharing this information. Let me know if you have any specific concerns.",
    "I understand your concern. We'll work together to address this issue.",
    "That's helpful information. Please continue to share any symptoms you're experiencing.",
    "I appreciate you detailing this. Let's monitor the situation closely.",
    "Can you tell me more about what you're experiencing?",
  ]
};

// Store conversations with sample data
let conversations: Record<string, Message[]> = {
  headache: [
    {
      id: '1',
      text: "Hello! I'm Dr. Meera Joshi. I see you're experiencing headaches. Can you tell me when they started?",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: '2',
      text: "Hi Doctor, I've been having mild headaches for the last 3 days, especially in the evenings.",
      sender: 'patient',
      timestamp: new Date(Date.now() - 250000).toISOString(),
    },
    {
      id: '3',
      text: "I see. Do you also experience nausea, dizziness, or sensitivity to light during these headaches?",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 200000).toISOString(),
    },
    {
      id: '4',
      text: "No nausea, but sometimes I feel a bit dizzy when I stand up quickly.",
      sender: 'patient',
      timestamp: new Date(Date.now() - 150000).toISOString(),
    },
    {
      id: '5',
      text: "Thank you for that information. It sounds like it could be tension headaches. Let me suggest some remedies.",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 100000).toISOString(),
    },
    {
      id: '6',
      text: "Ohk Doctor",
      sender: 'patient',
      timestamp: new Date(Date.now() - 150000).toISOString(),
    },
    {
      id: '7',
      text: "Take medicine like paracetamol ibuprofen, acetaminophen, and aspirin for tension headaches. Also, ensure you stay hydrated and take breaks from screens.",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 100000).toISOString(),
    },
    {
      id: '8',
      text: "Thank you so much Doctor",
      sender: 'patient',
      timestamp: new Date(Date.now() - 150000).toISOString(),
    },
    {
      id: '9',
      text: "You're welcome! If the headaches persist or worsen, please reach out again for further evaluation.",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 100000).toISOString(),
    }
  ],
  
  fever: [
    {
      id: '1',
      text: "Hello! I'm Dr. Sunita Sharma. I understand you're running a fever. Can you tell me your temperature?",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: '2',
      text: "Hi Doctor, my temperature is 101.5°F. I've had it since yesterday morning.",
      sender: 'patient',
      timestamp: new Date(Date.now() - 250000).toISOString(),
    },
    {
      id: '3',
      text: "I see. Are you experiencing any other symptoms like cough, cold, body aches, or fatigue?",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 200000).toISOString(),
    },
    {
      id: '4',
      text: "Yes, I have body aches and feel very tired. No cough or cold though.",
      sender: 'patient',
      timestamp: new Date(Date.now() - 150000).toISOString(),
    },
    {
      id: '5',
      text: "Thank you for the details. It sounds like a viral fever. Make sure to rest well, stay hydrated, and monitor your temperature.",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 100000).toISOString(),
    }
  ],
  
  general: [
    {
      id: '1',
      text: "Hello! Thank you for connecting with me today. How can I help you?",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: '2',
      text: "Hi Doctor, I'm not feeling well and wanted to consult about my symptoms.",
      sender: 'patient',
      timestamp: new Date(Date.now() - 250000).toISOString(),
    },
    {
      id: '3',
      text: "I understand. Please describe your symptoms and how long you've been experiencing them.",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 200000).toISOString(),
    },
    {
      id: '4',
      text: "I've been feeling tired and have some body pain for the last couple of days.",
      sender: 'patient',
      timestamp: new Date(Date.now() - 150000).toISOString(),
    },
    {
      id: '5',
      text: "Thank you for sharing. Let's discuss this further to understand your condition better.",
      sender: 'doctor',
      timestamp: new Date(Date.now() - 100000).toISOString(),
    }
  ]
};

// Get appropriate doctor response based on context
function getDoctorResponse(issue: string, patientMessage: string, conversationHistory: Message[] = []): string {
    const responses = doctorResponses[issue] || doctorResponses.general;
  
  // Simple context matching
  const messageLower = patientMessage.toLowerCase();
  
  if (issue === 'headache') {
    // Check for medication-related queries
    if (messageLower.includes('medicine') || messageLower.includes('pill') || messageLower.includes('tablet') || 
        messageLower.includes('paracetamol') || messageLower.includes('ibuprofen') || 
        messageLower.includes('acetaminophen') || messageLower.includes('aspirin')) {
      return "For tension headaches, over-the-counter pain relievers like paracetamol, ibuprofen, acetaminophen, or aspirin can help. Always follow the recommended dosage and take with food if possible.";
    }
    
    // Check for dizziness mentions
    if (messageLower.includes('dizzy') || messageLower.includes('dizziness') || 
        (messageLower.includes('stand') && messageLower.includes('up'))) {
      return "Dizziness when standing up quickly could indicate postural hypotension. Rise slowly from sitting positions, stay well-hydrated, and consider checking your blood pressure.";
    }
    
    // Check for timing patterns
    if (messageLower.includes('evening') || messageLower.includes('night') || 
        messageLower.includes('end of day') || messageLower.includes('after work')) {
      return "Evening headaches often result from accumulated stress, eye strain, or poor posture during the day. Try taking short breaks every hour, practice shoulder rolls, and ensure proper lighting.";
    }
    
    // Check for gratitude expressions
    if (messageLower.includes('thank') || messageLower.includes('thanks') || 
        messageLower.includes('appreciate') || messageLower.includes('grateful')) {
      return "You're welcome! Remember to monitor your headache patterns and reach out if symptoms persist or change. Rest well and stay hydrated!";
    }
    
    // Check for acknowledgments
    if (messageLower.includes('ok') || messageLower.includes('okay') || 
        messageLower.includes('ohk') || messageLower.includes('alright') || 
        messageLower.includes('understand')) {
      return "Great! For quick relief, you can take paracetamol or ibuprofen as needed. Also try applying a cool compress to your forehead and resting in a quiet room.";
    }
    
    // Check for hydration mentions
    if (messageLower.includes('hydration') || messageLower.includes('hydrated') || 
        messageLower.includes('water') || messageLower.includes('drink')) {
      return "Proper hydration is essential - aim for 2-3 liters of water daily. Dehydration is a common headache trigger, so keep a water bottle handy throughout the day.";
    }
    
    // Check for screen-related issues
    if (messageLower.includes('screen') || messageLower.includes('computer') || 
        messageLower.includes('phone') || messageLower.includes('digital') || 
        messageLower.includes('device')) {
      return "Digital eye strain can cause headaches. Adjust your screen brightness, increase text size, use blue light filters, and follow the 20-20-20 rule to reduce eye fatigue.";
    }
    
    // Check for stress mentions
    if (messageLower.includes('stress') || messageLower.includes('tense') || 
        messageLower.includes('anxious') || messageLower.includes('worried')) {
      return "Stress is a common headache trigger. Try deep breathing exercises, progressive muscle relaxation, or a short walk to help manage stress levels.";
    }
  }
  
  if (issue === 'fever') {
    if (messageLower.includes('body') && messageLower.includes('ache')) {
      return "Body aches with fever are common with viral infections. Rest and hydration are key to recovery.";
    }
    if (messageLower.includes('temperature') || messageLower.includes('101') || messageLower.includes('102')) {
      return "With that temperature, it's important to monitor it regularly. If it goes above 102°F, please let me know immediately.";
    }
    if (messageLower.includes('chill') || messageLower.includes('sweating')) {
      return "Chills and sweating are common with fever. Make sure to change damp clothes and maintain comfortable room temperature.";
    }
  }
  
  // Return random response if no specific context matches
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const issue = searchParams.get('issue') || 'general';
    
    console.log('🔍 GET /api/chat - Issue:', issue);
    
    // Return conversations for the specified issue
    const messages = conversations[issue] || [];
    
    console.log('✅ Returning messages:', messages.length);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📨 POST /api/chat - Received request');
    
    const body = await request.json();
    const { text, sender, issue = 'general' } = body;

    console.log('📝 Request body:', { text, sender, issue });

    if (!text || !sender) {
      console.warn('⚠️ Missing text or sender');
      return NextResponse.json(
        { error: 'Message text and sender are required' },
        { status: 400 }
      );
    }

    // Initialize conversation if it doesn't exist
    if (!conversations[issue]) {
      console.log('🆕 Creating new conversation for issue:', issue);
      conversations[issue] = [];
    }

    // Add patient message
    const patientMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: sender as 'patient' | 'doctor',
      timestamp: new Date().toISOString(),
    };

    console.log('➕ Adding patient message');
    conversations[issue].push(patientMessage);

    // Generate contextual doctor response
const doctorResponseText = getDoctorResponse(issue, text, conversations[issue]);
    const doctorReply: Message = {
      id: (Date.now() + 1).toString(),
      text: doctorResponseText,
      sender: 'doctor',
      timestamp: new Date().toISOString(),
    };

    console.log('➕ Adding doctor reply');
    
    // Add slight delay to simulate real response time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    conversations[issue].push(doctorReply);

    const responseData = {
      success: true,
      data: [patientMessage, doctorReply],
      issue: issue
    };

    console.log('✅ POST Response successful');
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}