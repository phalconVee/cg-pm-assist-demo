import React from 'react';

const ChatLoader: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-3">
        <img src="/lovable-uploads/08ba415d-6139-4502-8c64-0edc68429d26.png" alt="AI Assistant" className="h-8 w-8 rounded-full flex-shrink-0" />
        <div className="flex items-center">
          <div className="loader"></div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          .loader { 
            animation: rotate 1s infinite; 
            height: 25px; 
            width: 25px; 
          }   
          .loader:before, 
          .loader:after { 
            border-radius: 50%; 
            content: ""; 
            display: block; 
            height: 10px; 
            width: 10px; 
          } 
          .loader:before { 
            animation: ball1 1s infinite; 
            background-color: #fff; 
            box-shadow: 15px 0 0 #236cff; 
            margin-bottom: 5px; 
          } 
          .loader:after { 
            animation: ball2 1s infinite; 
            background-color: #236cff; 
            box-shadow: 15px 0 0 #fff; 
          }   
          @keyframes rotate { 
            0% { transform: rotate(0deg) scale(0.8) } 
            50% { transform: rotate(360deg) scale(1.2) } 
            100% { transform: rotate(720deg) scale(0.8) } 
          }   
          @keyframes ball1 { 
            0% { box-shadow: 15px 0 0 #236cff; } 
            50% { box-shadow: 0 0 0 #236cff; margin-bottom: 0; transform: translate(7.5px, 7.5px); } 
            100% { box-shadow: 15px 0 0 #236cff; margin-bottom: 5px; } 
          }   
          @keyframes ball2 { 
            0% { box-shadow: 15px 0 0 #fff; } 
            50% { box-shadow: 0 0 0 #fff; margin-top: -10px; transform: translate(7.5px, 7.5px); } 
            100% { box-shadow: 15px 0 0 #fff; margin-top: 0; } 
          } 
        `
      }} />
    </div>
  );
};

export default ChatLoader;