import { useState } from "react"

export default function ProfileEditor() {
    const [name, setName] = useState("Arnas");

    return(
        <>
        <p>Name:{name}</p>
        <input value={name} type="text" onChange={(e) => setName(e.target.value)}/>
        </>
    )
}