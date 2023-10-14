import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, List, Avatar } from 'antd';
import { useCurrentUser } from '@/api/messages/hooks';
import { getConversations } from '@/api/messages/messages';
import { UserConversationResponse } from '@/api/messages/types';

const Messages: React.FC = () => {
  const { data: user } = useCurrentUser();
  const [conversations, setConversations] = useState<
    UserConversationResponse[]
  >([]);
  const currentUserId = user?.id;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (currentUserId) {
          const conv = await getConversations();
          setConversations(conv);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  return (
    <div style={{ padding: '15px' }}>
      <h1>Messages</h1>
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={conversations}
          renderItem={(conversation) => (
            <List.Item key={conversation.lastMessage.id}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      conversation.lastMessage.sender.profile?.profilePhoto ||
                      'path/to/default/photo.jpg'
                    }
                  />
                }
                title={
                  <Link
                    href={`/dashboard/messages/${conversation.otherUser.id}`}
                  >
                    Chat with{' '}
                    {conversation.lastMessage.sender.profile?.fullName ||
                      'Unknown User'}
                  </Link>
                }
                description={conversation.lastMessage.content}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Messages;
