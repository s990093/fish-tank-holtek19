import React from "react";

const VideoStream: React.FC = () => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Aquarium Live Stream</h2>
      <video width="320" height="240" controls className="mt-2 w-full">
        <source src="http://your-esp8266-stream-url" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoStream;
