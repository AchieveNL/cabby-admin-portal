import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  senderId: string;
  recipientId: string;
  content: string;
}

export const getMessages = async (
  userId1: string,
  userId2: string,
): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('message')
      .select('*')
      .ilike('senderId', userId1)
      .or(
        `senderId.ilike.${userId2};recipientId.ilike.${userId1},recipientId.ilike.${userId2}`,
      );

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
