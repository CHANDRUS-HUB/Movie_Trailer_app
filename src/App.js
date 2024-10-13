import './App.css';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';

function App() {
    const [video, setVideo] = useState("");  // Initialize video with an empty string
    const [videoURL, setVideoURL] = useState("");  // Video URL state
    const [error, setError] = useState(null);  // Error state

    const API_KEY = "AIzaSyDCRYJ5vADVXyRxvQEyXOtzeqPF9ZXhpuM";  // Replace with your YouTube API key

    // Function to search for a movie trailer using the YouTube API
    async function handleSearch() {
        if (!video.trim()) {
            setError("Please enter a movie name.");  // Display error if input is empty
            return;
        }
        
        try {
            const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    part: "snippet",
                    q: `${video} trailer`,  // Search query, movie name + trailer
                    type: "video",
                    key: API_KEY,
                    maxResults: 1,  // Limit to the first result
                }
            });

            // Extract the video ID from the API response
            if (res.data.items.length > 0) {
                const videoId = res.data.items[0].id.videoId;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                setVideoURL(videoUrl);  // Set the video URL
                setError(null);  // Clear any previous errors
            } else {
                setError("Trailer not found. Try another movie.");  // If no trailer is found
                setVideoURL(null);
            }

        } catch (err) {
            setError("Error fetching trailer. Please try again.");  // Catch any API errors
            setVideoURL(null);
        }
    }

    return (
        <>
            <div className="App">
                <h2 className='header'>Movie Trailer App</h2>

                <div className="search-box">
                    <label>Search Any Movies & Shows:</label>
                    <input
                        type="text"
                        onChange={(e) => setVideo(e.target.value)}  // Update movie name as user types
                    />
                    <button onClick={handleSearch}>
                        Search
                    </button>
                </div>

                {/* Display error message if there's an issue */}
                {error && <div style={{ color: 'red' }}>{error}</div>}

                {/* Display video if URL is available */}
                {videoURL && <ReactPlayer url={videoURL} controls={true} />}
            </div>
        </>
    );
}

export default App;
