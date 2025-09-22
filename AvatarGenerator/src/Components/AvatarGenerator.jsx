import React, { useState } from "react";
import "./AvatarGenerator.css";
import { FaRobot } from "react-icons/fa";
function AvatarGenerator() {
  const [svgXMLText, setSVGXMLText] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [sprite, setSprite] = useState("avataaars");
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000));
  const [flipStatus, setFlipStatus] = useState(false);
  const [avatarFormat, setAvatarFormat] = useState("svg");
  const [avatarSize, setAvatarSize] = useState(256);
  const [loading, setLoading] = useState(false);

  const genAvatar = async (sprite, format, seed, flipStatus, avatarSize) => {
    setAvatarURL("");
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.dicebear.com/9.x/${sprite}/${format}?seed=${seed}&flip=${flipStatus}&size=${avatarSize}`
        //${sprite} → the avatar style
        /*${seed} → the randomizing input (usually a string, like a username or ID).
         Different seeds produce different variations of the same style. */
      );
      if (format === "svg") {
        //DiceBear API returns the avatar as raw SVG markup, not JSON or binary.
        /*.json() → parses the body as JSON. But DiceBear doesn’t return JSON here.
      .blob() or .arrayBuffer() → used when fetching binary data (like PNG, JPG).
      .text() → reads the body as a string. Since the API response is SVG XML text, this is the correct choice. */
        const data = await res.text();
        setSVGXMLText(data);
        /* converting the raw SVG string into a Base64-encoded Data URL.
      encodeURIComponent(data) → encodes special characters in the SVG string (like <, >, quotes) into safe UTF-8.
      unescape(...) → converts the UTF-8 escape codes back into raw bytes.
      btoa(...) → encodes those bytes into Base64.
      data:image/svg+xml;base64,... → creates a valid data URI that browsers understand as an image source. */
        setAvatarURL(
          `data:image/svg+xml;base64,${btoa(
            unescape(encodeURIComponent(data))
          )}`
        );
      } else {
        /*These formats are binary images.
        They are not text; if you tried res.text() on a PNG, you’d get garbled characters.
        Browsers need them as blobs or ArrayBuffers. */
        const data = await res.blob(); //reads the response as binary data.
        const Imgurl = URL.createObjectURL(data); //→ creates a temporary URL that the <img> tag can use.
        setAvatarURL(Imgurl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="avatar-app">
      <h1 className="title">
        <FaRobot style={{ marginRight: "8px" }} /> Avatar Generator with
        Dicebear and React
      </h1>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="avatar-style">Style (Sprite)</label>
          <select
            id="avatar-style"
            value={sprite}
            onChange={(e) => setSprite(e.target.value)}
          >
            <option value="avataaars">avataaars</option>
            <option value="bottts">bottts</option>
            <option value="identicon">identicon</option>
            <option value="personas">personas</option>
            <option value="pixel-art">pixel-art</option>
            <option value="lorelei">lorelei</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="avatar-seed">Seed</label>
          <input
            id="avatar-seed"
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar-flip">Flip Status</label>
          <select
            id="avatar-flip"
            value={flipStatus}
            onChange={(e) => setFlipStatus(e.target.value === "true")}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="avatar-format">File Type</label>
          <select
            id="avatar-format"
            value={avatarFormat}
            onChange={(e) => setAvatarFormat(e.target.value)}
          >
            <option value="png">PNG</option>
            <option value="svg">SVG</option>
            <option value="jpg">JPG</option>
            <option value="webp">WEBP</option>
            <option value="avif">AVIF</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="avatar-size">Avatar Size (px)</label>
          <select
            id="avatar-size"
            value={avatarSize}
            onChange={(e) => setAvatarSize(Number(e.target.value))}
          >
            <option value="16">16px</option>
            <option value="32">32px</option>
            <option value="64">64px</option>
            <option value="128">128px</option>
            <option value="256">256px</option>
          </select>
        </div>
      </div>
      <button
        className="generate-btn"
        onClick={() => {
          genAvatar(sprite, avatarFormat, seed, flipStatus, avatarSize);
        }}
        disabled={loading}
      >
        Generate
      </button>
      {avatarURL && (
        <div className="preview">
          <img
            src={avatarURL}
            alt={sprite}
            style={{ width: "300px", height: "300px" }}
          />
          <a href={avatarURL} download={`${sprite}.${avatarFormat}`}>
            Download
          </a>
        </div>
      )}
    </div>
  );
}

export default AvatarGenerator;
