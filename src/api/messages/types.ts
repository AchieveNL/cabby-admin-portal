export interface MinimalUser {
  id: string;
  status: UserStatus;
  role: UserRole;
  email: string;
  profile: {
    fullName: string;
    profilePhoto: string;
  };
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
  REJECTED = 'REJECTED',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserConversationResponse {
  lastMessage: {
    id: string;
    content: string;
    createdAt: Date;
    sender: {
      id: string;
      profile: {
        fullName: string;
        profilePhoto: string;
      };
    };
    recipient: {
      id: string;
      profile: {
        fullName: string;
        profilePhoto: string;
      };
    };
  };
  otherUser: {
    id: string;
    profile: {
      fullName: string;
      profilePhoto: string;
    };
  };
}
