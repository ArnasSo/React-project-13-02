import { useState } from "react";

export default function TwoStateExample() {
    const [realName, setRealName] = useState("Arnas");
    const [draftName, setDraftName] = useState(realName);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            <p>Name: {realName}</p>
            {isEditing ? (
                <div>
                <input 
                value={draftName} 
                type="text" 
                onChange={(e) => setDraftName(e.target.value)} />
                <button onClick={() => {
                    setIsEditing(false);
                    setRealName(draftName);
                }}>Save</button>
                <button onClick={() => {
                    setIsEditing(false);
                }}>Cancel</button>
                </div>
            ) : (
                <button onClick={() => {
                    setIsEditing(true);
                    setDraftName(realName);
                }}>
                    Edit
                </button>
            )}
        </>
    )
}