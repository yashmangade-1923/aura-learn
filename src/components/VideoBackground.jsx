import { useState, useRef, useEffect } from 'react';

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Array of all video paths from the public folder
const allVideos = [
  '/videos/v1.mp4',
  '/videos/v2.mp4',
  '/videos/v3.mp4',
  '/videos/v4.mp4',
  '/videos/v.mp4',
  '/videos/genrate_this_first_again_but_t.mp4',
  '/videos/generate_the_nd_idea_video.mp4'
];

const VideoBackground = () => {
  // Initialize playlist with a shuffled array
  const [playlist, setPlaylist] = useState(() => shuffleArray(allVideos));
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= playlist.length) {
        // Reshuffle when all videos have been played
        setPlaylist(shuffleArray(allVideos));
        return 0; // start from the beginning of the new shuffled playlist
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    // When the currentVideoIndex or playlist changes, play the new video
    if (videoRef.current) {
      videoRef.current.load(); // Load the new source
      videoRef.current.play().catch(error => {
        console.error("Auto-play was prevented:", error);
      });
    }
  }, [currentVideoIndex, playlist]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      overflow: 'hidden',
      backgroundColor: '#05050f'
    }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Ensures the video covers the entire screen without losing aspect ratio/quality
          pointerEvents: 'none'
        }}
      >
        <source src={playlist[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Optional: Add an overlay to ensure text remains readable */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(5, 5, 15, 0.6)' // Adjust opacity (0.6) for darkness
      }}></div>
    </div>
  );
};

export default VideoBackground;
