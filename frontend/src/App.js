import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Components from './Components';

const { 
  MainScreen, 
  ProfileCard, 
  BottomNavigation, 
  MatchModal, 
  ProfileModal, 
  MessagesScreen, 
  SettingsScreen, 
  LikesScreen,
  ChatScreen
} = Components;

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'Emma',
    age: 25,
    distance: 2,
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      'https://images.unsplash.com/photo-1544005313-94dcc0286df2',
      'https://images.pexels.com/photos/5616021/pexels-photo-5616021.jpeg'
    ],
    bio: 'Love to travel and explore new places. Coffee enthusiast ☕',
    interests: ['Travel', 'Photography', 'Coffee'],
    job: 'Graphic Designer',
    school: 'Art Institute'
  },
  {
    id: 2,
    name: 'Alex',
    age: 28,
    distance: 5,
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      'https://images.pexels.com/photos/1223649/pexels-photo-1223649.jpeg',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773'
    ],
    bio: 'Adventure seeker and yoga lover. Let\'s explore the world together! 🌍',
    interests: ['Yoga', 'Hiking', 'Sailing'],
    job: 'Software Engineer',
    school: 'MIT'
  },
  {
    id: 3,
    name: 'Maya',
    age: 24,
    distance: 3,
    images: [
      'https://images.unsplash.com/photo-1588479843425-2f1c68899617',
      'https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg',
      'https://images.unsplash.com/photo-1616863496857-01ffd220265e'
    ],
    bio: 'Fitness enthusiast and foodie. Looking for someone to share adventures with! 💪',
    interests: ['Fitness', 'Cooking', 'Dancing'],
    job: 'Personal Trainer',
    school: 'State University'
  },
  {
    id: 4,
    name: 'Jake',
    age: 26,
    distance: 4,
    images: [
      'https://images.pexels.com/photos/3811111/pexels-photo-3811111.jpeg',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846',
      'https://images.pexels.com/photos/32742563/pexels-photo-32742563.jpeg'
    ],
    bio: 'Musician and artist. Always up for deep conversations and live music 🎵',
    interests: ['Music', 'Art', 'Photography'],
    job: 'Music Producer',
    school: 'Berklee'
  },
  {
    id: 5,
    name: 'Sophia',
    age: 27,
    distance: 1,
    images: [
      'https://images.unsplash.com/photo-1544005313-94dcc0286df2',
      'https://images.pexels.com/photos/5616021/pexels-photo-5616021.jpeg',
      'https://images.unsplash.com/photo-1588479843425-2f1c68899617'
    ],
    bio: 'Travel blogger and nature lover. Seeking genuine connections ✨',
    interests: ['Writing', 'Travel', 'Nature'],
    job: 'Content Creator',
    school: 'Columbia'
  }
];

const mockMatches = [
  {
    id: 1,
    user: mockUsers[0],
    messages: [
      { id: 1, text: 'Hey! Love your travel photos!', sender: 'them', timestamp: '2:30 PM' },
      { id: 2, text: 'Thank you! Where\'s your favorite place you\'ve traveled to?', sender: 'me', timestamp: '2:32 PM' },
      { id: 3, text: 'Definitely Japan! The culture and food are amazing', sender: 'them', timestamp: '2:35 PM' }
    ],
    lastMessage: 'Definitely Japan! The culture and food are amazing',
    lastMessageTime: '2:35 PM',
    isOnline: true
  },
  {
    id: 2,
    user: mockUsers[1],
    messages: [
      { id: 1, text: 'Hi there! I see you\'re into yoga too', sender: 'them', timestamp: '1:15 PM' },
      { id: 2, text: 'Yes! Do you have a favorite studio?', sender: 'me', timestamp: '1:20 PM' }
    ],
    lastMessage: 'Yes! Do you have a favorite studio?',
    lastMessageTime: '1:20 PM',
    isOnline: false
  }
];

function App() {
  const [currentView, setCurrentView] = useState('discover');
  const [users, setUsers] = useState(mockUsers);
  const [matches, setMatches] = useState(mockMatches);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [likes, setLikes] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSwipe = (direction, user) => {
    if (direction === 'right') {
      // Simulate match (50% chance)
      if (Math.random() > 0.5) {
        setMatchedUser(user);
        setShowMatch(true);
        setMatches(prev => [...prev, {
          id: Date.now(),
          user,
          messages: [],
          lastMessage: null,
          lastMessageTime: null,
          isOnline: Math.random() > 0.5
        }]);
      }
      setLikes(prev => [...prev, user]);
    }
    
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
    } else {
      // Reset or load more users
      setCurrentUserIndex(0);
    }
  };

  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setShowProfile(true);
  };

  const handleChatClick = (match) => {
    setSelectedChat(match);
    setCurrentView('chat');
  };

  const handleSendMessage = (message) => {
    if (selectedChat) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMatches(prev => prev.map(match => 
        match.id === selectedChat.id 
          ? {
              ...match,
              messages: [...match.messages, newMessage],
              lastMessage: message,
              lastMessageTime: newMessage.timestamp
            }
          : match
      ));
      
      setSelectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: message,
        lastMessageTime: newMessage.timestamp
      }));
    }
  };

  const currentUser = users[currentUserIndex];

  return (
    <div className="App">
      <BrowserRouter>
        <div className="tinder-app">
          {currentView === 'discover' && (
            <MainScreen 
              user={currentUser}
              onSwipe={handleSwipe}
              onProfileClick={handleProfileClick}
            />
          )}
          
          {currentView === 'likes' && (
            <LikesScreen 
              likes={likes}
              onProfileClick={handleProfileClick}
            />
          )}
          
          {currentView === 'messages' && (
            <MessagesScreen 
              matches={matches}
              onChatClick={handleChatClick}
            />
          )}
          
          {currentView === 'profile' && (
            <SettingsScreen />
          )}
          
          {currentView === 'chat' && selectedChat && (
            <ChatScreen 
              match={selectedChat}
              onBack={() => setCurrentView('messages')}
              onSendMessage={handleSendMessage}
            />
          )}
          
          {currentView !== 'chat' && (
            <BottomNavigation 
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          )}
          
          {showMatch && matchedUser && (
            <MatchModal 
              user={matchedUser}
              onClose={() => setShowMatch(false)}
              onSendMessage={() => {
                setShowMatch(false);
                setCurrentView('messages');
              }}
            />
          )}
          
          {showProfile && selectedUser && (
            <ProfileModal 
              user={selectedUser}
              onClose={() => setShowProfile(false)}
            />
          )}
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;