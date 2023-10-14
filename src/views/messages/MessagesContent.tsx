import { FC, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Input,
  Button,
  List,
  Avatar,
  Spin,
  Divider,
  Typography,
  Card,
} from 'antd';
import { useCurrentUser, useUserById } from '@/api/messages/hooks';
import {
  Message,
  getMessages,
  sendMessageToSupabase,
} from '@/api/supabase/messages';
import { supabase } from '@/api/supabase/supabaseClient';
import { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Payload {
  new: Message;
}

const MessagesContent: FC = () => {
  const router = useRouter();
  const recipientId = router.query.userId as string;

  const { data: currentUser, loading: fetchCurrentUserLoading } =
    useCurrentUser();
  const { data: recipient, loading: fetchRecipientUserLoading } =
    useUserById(recipientId);
  const currentUserId = currentUser?.id || '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages(currentUserId, recipientId);
        setMessages(fetchedMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();
  }, [currentUserId, recipientId]);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const messageSubscription = supabase
      .channel('any')
      .on(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`,
        { event: '*', schema: 'public', table: 'message' },
        (payload: Payload) => {
          const newMessage = payload.new;
          if (
            newMessage &&
            ((newMessage.senderId === currentUserId &&
              newMessage.recipientId === recipientId) ||
              (newMessage.senderId === recipientId &&
                newMessage.recipientId === currentUserId))
          ) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        },
      )
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
    };
  }, [currentUserId, recipientId]);

  const sendMessage = async () => {
    try {
      await sendMessageToSupabase(currentUserId, recipientId, input);
      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const isLoading = fetchCurrentUserLoading || fetchRecipientUserLoading;

  if (isLoading) return <Spin />;

  return (
    <Card bordered={false}>
      <div
        style={{
          margin: '16px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="mr-1">
            <Button type="text" onClick={() => router.back()}>
              <ArrowLeftOutlined rev={undefined} />
            </Button>
          </div>
          <Avatar src={recipient?.profile?.profilePhoto} size={48}>
            {recipient?.profile?.fullName[0]}
          </Avatar>
          <div
            style={{
              marginLeft: '12px',
            }}
          >
            <Title
              level={4}
              style={{
                margin: 0,
              }}
            >
              {recipient?.profile?.fullName ?? "User's Name"}
            </Title>
          </div>
        </div>

        <Divider />

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '16px',
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(msg: Message, index) => (
              <List.Item
                style={{
                  borderRadius: '5px',
                  marginBottom: '8px',
                }}
                ref={index === messages.length - 1 ? messagesEndRef : null}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        msg.senderId === currentUserId
                          ? currentUser?.profile?.profilePhoto
                          : recipient?.profile?.profilePhoto
                      }
                    >
                      {msg.senderId[0]}
                    </Avatar>
                  }
                  title={
                    msg.senderId === currentUserId
                      ? currentUser?.profile?.fullName
                      : recipient?.profile?.fullName
                  }
                  description={msg.content}
                />
              </List.Item>
            )}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid #ccc',
            paddingTop: '10px',
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={sendMessage}
            style={{
              flex: 1,
              marginRight: '10px',
              borderRadius: '20px',
            }}
            placeholder="Type a message"
          />
          <Button onClick={sendMessage} type="primary" shape="round">
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

// CSS-in-JS Stylin

export default MessagesContent;
