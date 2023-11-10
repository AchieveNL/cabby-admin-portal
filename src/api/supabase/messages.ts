import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  senderId: string;
  recipientId: string;
  content: string;
}

export const getMessages = async (
  currentUserId: string,
  recipientId: string,
): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('message')
      .select('*')
      .or(`senderId.eq.${currentUserId},recipientId.eq.${currentUserId}`)
      .or(`senderId.eq.${recipientId},recipientId.eq.${recipientId}`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching messages:');
    throw error;
  }
};

export const sendMessageToSupabase = async (
  senderId: string,
  recipientId: string,
  content: string,
) => {
  try {
    const { data, error } = await supabase
      .from('message')
      .insert([{ id: uuidv4(), senderId, recipientId, content }]);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message to Supabase:');
    throw error;
  }
};

export interface Conversation {
  partnerId: string;
  partnerName: string;
}
