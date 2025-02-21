import React from "react";

const EmojiBox = ({ emojis }) => {
    // Si es un string, lo convierte en array para manejar múltiples emojis
    const emojiList = Array.isArray(emojis) ? emojis : [emojis];

    return (
        <div className="w-[128px] h-[48px] flex justify-center items-center rounded-lg text-2xl">
            {emojiList.map((emoji, index) => (
                <span key={index} className="mx-1">{emoji}</span>
            ))}
        </div>
    );
};

export default EmojiBox;
