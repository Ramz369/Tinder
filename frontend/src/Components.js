import React, { useState, useEffect } from 'react';

// Main Screen Component
const MainScreen = ({ user, onSwipe, onProfileClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(dragOffset.x) > 100) {
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      onSwipe(direction, user);
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(dragOffset.x) > 100) {
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      onSwipe(direction, user);
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = 1 - Math.abs(dragOffset.x) * 0.002;

  if (!user) {
    return (
      <div className="main-screen">
        <div className="header">
          <div className="logo">🔥</div>
          <div className="title">tinder</div>
        </div>
        <div className="no-more-cards">
          <h2>No more profiles to show</h2>
          <p>Check back later for new people</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-screen">
      <div className="header">
        <div className="logo">🔥</div>
        <div className="title">tinder</div>
        <div className="profile-icon" onClick={() => onProfileClick(user)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </div>
      
      <div className="card-container">
        <div 
          className="profile-card"
          style={{
            transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
            opacity: opacity,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="card-image-container">
            <img 
              src={user.images[currentImageIndex]} 
              alt={user.name}
              className="card-image"
            />
            
            {/* Image indicators */}
            <div className="image-indicators">
              {user.images.map((_, index) => (
                <div 
                  key={index}
                  className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
            
            {/* Swipe indicators */}
            {dragOffset.x > 50 && (
              <div className="swipe-indicator like">LIKE</div>
            )}
            {dragOffset.x < -50 && (
              <div className="swipe-indicator nope">NOPE</div>
            )}
          </div>
          
          <div className="card-info">
            <div className="card-header">
              <h2>{user.name}, {user.age}</h2>
              <div className="distance">📍 {user.distance} km away</div>
            </div>
            
            {user.bio && (
              <p className="bio">{user.bio}</p>
            )}
            
            {user.interests && (
              <div className="interests">
                {user.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">{interest}</span>
                ))}
              </div>
            )}
            
            {(user.job || user.school) && (
              <div className="details">
                {user.job && <div className="detail">💼 {user.job}</div>}
                {user.school && <div className="detail">🎓 {user.school}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="action-btn reject"
          onClick={() => onSwipe('left', user)}
        >
          ✕
        </button>
        <button 
          className="action-btn super-like"
          onClick={() => onSwipe('super', user)}
        >
          ⭐
        </button>
        <button 
          className="action-btn like"
          onClick={() => onSwipe('right', user)}
        >
          ❤️
        </button>
      </div>
    </div>
  );
};

// Profile Card Component
const ProfileCard = ({ user, onSwipe }) => {
  return (
    <div className="profile-card">
      <div className="card-image-container">
        <img src={user.images[0]} alt={user.name} className="card-image" />
      </div>
      <div className="card-info">
        <h3>{user.name}, {user.age}</h3>
        <p>{user.distance} km away</p>
      </div>
    </div>
  );
};

// Match Modal Component
const MatchModal = ({ user, onClose, onSendMessage }) => {
  return (
    <div className="match-modal-overlay">
      <div className="match-modal">
        <div className="match-header">
          <h1>It's a Match!</h1>
          <p>You and {user.name} liked each other</p>
        </div>
        
        <div className="match-images">
          <div className="match-image">
            <img src="https://images.unsplash.com/photo-1544005313-94dcc0286df2" alt="You" />
          </div>
          <div className="match-heart">❤️</div>
          <div className="match-image">
            <img src={user.images[0]} alt={user.name} />
          </div>
        </div>
        
        <div className="match-actions">
          <button className="send-message-btn" onClick={onSendMessage}>
            Send Message
          </button>
          <button className="keep-swiping-btn" onClick={onClose}>
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile Modal Component
const ProfileModal = ({ user, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="profile-modal-header">
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="profile-modal-images">
          <img 
            src={user.images[currentImageIndex]} 
            alt={user.name}
            className="profile-modal-image"
          />
          
          <div className="profile-image-indicators">
            {user.images.map((_, index) => (
              <div 
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="profile-modal-info">
          <div className="profile-modal-header-info">
            <h2>{user.name}, {user.age}</h2>
            <div className="distance">📍 {user.distance} km away</div>
          </div>
          
          {user.bio && (
            <div className="profile-modal-section">
              <h3>About {user.name}</h3>
              <p>{user.bio}</p>
            </div>
          )}
          
          {user.interests && (
            <div className="profile-modal-section">
              <h3>Interests</h3>
              <div className="interests">
                {user.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">{interest}</span>
                ))}
              </div>
            </div>
          )}
          
          {(user.job || user.school) && (
            <div className="profile-modal-section">
              <h3>Details</h3>
              {user.job && <div className="detail">💼 {user.job}</div>}
              {user.school && <div className="detail">🎓 {user.school}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Messages Screen Component
const MessagesScreen = ({ matches, onChatClick }) => {
  return (
    <div className="messages-screen">
      <div className="messages-header">
        <h1>Messages</h1>
      </div>
      
      <div className="matches-list">
        {matches.length === 0 ? (
          <div className="no-matches">
            <h2>No matches yet</h2>
            <p>Start swiping to find your matches!</p>
          </div>
        ) : (
          matches.map(match => (
            <div 
              key={match.id} 
              className="match-item"
              onClick={() => onChatClick(match)}
            >
              <div className="match-avatar">
                <img src={match.user.images[0]} alt={match.user.name} />
                {match.isOnline && <div className="online-indicator"></div>}
              </div>
              <div className="match-info">
                <h3>{match.user.name}</h3>
                <p className="last-message">
                  {match.lastMessage || 'Start a conversation'}
                </p>
              </div>
              <div className="match-time">
                {match.lastMessageTime && (
                  <span>{match.lastMessageTime}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Chat Screen Component
const ChatScreen = ({ match, onBack, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>‹</button>
        <div className="chat-user-info">
          <img src={match.user.images[0]} alt={match.user.name} />
          <div>
            <h3>{match.user.name}</h3>
            {match.isOnline && <span className="online-status">Online</span>}
          </div>
        </div>
      </div>
      
      <div className="chat-messages">
        {match.messages.length === 0 ? (
          <div className="chat-empty">
            <img src={match.user.images[0]} alt={match.user.name} />
            <h3>You matched with {match.user.name}!</h3>
            <p>Start the conversation</p>
          </div>
        ) : (
          match.messages.map(msg => (
            <div 
              key={msg.id} 
              className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}
            >
              <div className="message-bubble">
                {msg.text}
              </div>
              <div className="message-time">{msg.timestamp}</div>
            </div>
          ))
        )}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} disabled={!message.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

// Likes Screen Component
const LikesScreen = ({ likes, onProfileClick }) => {
  return (
    <div className="likes-screen">
      <div className="likes-header">
        <h1>Likes</h1>
        <p>People who liked you</p>
      </div>
      
      <div className="likes-grid">
        {likes.length === 0 ? (
          <div className="no-likes">
            <h2>No likes yet</h2>
            <p>Keep swiping to get more likes!</p>
          </div>
        ) : (
          likes.map(user => (
            <div 
              key={user.id} 
              className="like-card"
              onClick={() => onProfileClick(user)}
            >
              <img src={user.images[0]} alt={user.name} />
              <div className="like-card-info">
                <h3>{user.name}</h3>
                <p>{user.age} years old</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Settings Screen Component
const SettingsScreen = () => {
  return (
    <div className="settings-screen">
      <div className="settings-header">
        <h1>Profile</h1>
      </div>
      
      <div className="profile-section">
        <div className="profile-image-section">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94dcc0286df2" 
            alt="Profile" 
            className="profile-image"
          />
          <button className="edit-photos-btn">Edit Photos</button>
        </div>
        
        <div className="profile-info-section">
          <div className="info-item">
            <label>Name</label>
            <input type="text" defaultValue="Sarah" />
          </div>
          
          <div className="info-item">
            <label>Age</label>
            <input type="number" defaultValue="25" />
          </div>
          
          <div className="info-item">
            <label>Bio</label>
            <textarea 
              defaultValue="Love to travel and explore new places. Coffee enthusiast ☕"
              rows="3"
            />
          </div>
          
          <div className="info-item">
            <label>Job</label>
            <input type="text" defaultValue="Graphic Designer" />
          </div>
          
          <div className="info-item">
            <label>School</label>
            <input type="text" defaultValue="Art Institute" />
          </div>
        </div>
        
        <div className="settings-actions">
          <button className="save-btn">Save Changes</button>
          <button className="logout-btn">Log Out</button>
        </div>
      </div>
    </div>
  );
};

// Bottom Navigation Component
const BottomNavigation = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'discover', icon: '🔥', label: 'Discover' },
    { id: 'likes', icon: '⭐', label: 'Likes' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <div className="bottom-navigation">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${currentView === item.id ? 'active' : ''}`}
          onClick={() => onViewChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const Components = {
  MainScreen,
  ProfileCard,
  BottomNavigation,
  MatchModal,
  ProfileModal,
  MessagesScreen,
  SettingsScreen,
  LikesScreen,
  ChatScreen
};

export default Components;