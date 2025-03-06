import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface EmojiPickerProps {
    onEmojiClick: (emoji: string) => void; 
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiClick }) => {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <div>
            <button onClick={() => setShowPicker(!showPicker)}>
                😁
            </button>
            {showPicker && (
                <Picker
                    onEmojiClick={(emojiObject) => {
                        onEmojiClick(emojiObject.emoji); 
                        setShowPicker(false);
                    }}
                />
            )}
        </div>
    );
};

export default EmojiPicker;