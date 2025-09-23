// import  './styles/ViewLoader.css';

const VideoLoader = () => {
    return (
        <div className="video-loader-container">
            <video
                className="loader-video"
                autoPlay  // Start playing automatically
                loop      // Loop the video continuously
                muted     // Mute the video (required for autoplay in most browsers)
                playsInline // Prevents fullscreen on mobile devices
            >
                {/* 2. Set the video source from the import */}
                <source src='../../../public/Robot_Transcribes_Invoice_Details.mp4' type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <p>Please wait while AI transcribes your invoice...</p>
        </div>
    );
};

export default VideoLoader;