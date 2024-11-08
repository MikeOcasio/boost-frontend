const getEmbedUrl = (url) => {
  // Check if it's a YouTube URL
  if (url.includes("youtu.be")) {
    return url.replace("youtu.be", "www.youtube.com/embed");
  }
  if (url.includes("youtube.com") && url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  // Check if it's a Twitch URL
  if (url.includes("twitch.tv")) {
    const videoId = url.split("/").pop();
    return `https://player.twitch.tv/?video=${videoId}&parent=ravenboost.com`;
  }

  // If it's a direct MP4 URL
  if (url.endsWith(".mp4")) {
    return url;
  }

  // Fallback for unsupported formats
  return null;
};

export const EmbededFrame = ({ url, title }) => {
  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) null;

  // Direct MP4 URLs use a <video> tag, others use <iframe>
  if (embedUrl?.endsWith(".mp4")) {
    return (
      <div className="flex flex-col items-center gap-2 min-w-[49%] h-full flex-1">
        <video
          controls
          src={embedUrl}
          title={title}
          className="rounded-lg w-full h-[315px] bg-white/10"
        />

        <p className="text-sm text-center text-white/80 font-semibold bg-white/10 rounded-md px-2 py-1 w-full">
          {title}
        </p>
      </div>
    );
  }

  return (
    embedUrl && (
      <div className="flex flex-col items-center gap-2 min-w-[49%] h-full flex-1">
        <iframe
          src={embedUrl}
          autoPlay={false}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          scrolling="no"
          className="rounded-lg w-full h-[315px]"
        />

        <p className="text-sm text-center text-white/80 font-semibold bg-white/10 rounded-md px-2 py-1 w-full">
          {title}
        </p>
      </div>
    )
  );
};
