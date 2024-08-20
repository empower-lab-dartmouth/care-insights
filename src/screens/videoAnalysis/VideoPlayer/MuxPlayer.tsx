import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import MuxPlayer from '@mux/mux-player-react';
import { partnerAuth } from '../../../state/partner-firebase';

const createMuxPlaybackTokenUrl = import.meta.env.VITE_CREATE_MUX_TOKEN_URL;
const muxPlaybackId = import.meta.env.VITE_MUX_PLAYBACK_TOKEN;

function PlayMux() {
    const [playbackId, setPlaybackId] = useState<string>('');
    const [playbackToken, setPlaybackToken] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            const caregiverEmail = 'bbee-at-oakwoodmanor@memcara.com';
            const caregiverPassword = 'fabulous';
            const userCred = await signInWithEmailAndPassword(partnerAuth, caregiverEmail, caregiverPassword);
            const userToken = await userCred.user.getIdTokenResult();

            const method = 'POST';
            const data = { muxPlaybackId };
            const options = {
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": `${userToken.token}`
                })
            };
            const jsonData = JSON.stringify(data);
            const response = await fetch(createMuxPlaybackTokenUrl, {
                method,
                body: jsonData,
                ...options
            });
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            const [, muxPlaybackToken] = await response.json();
            setPlaybackId(muxPlaybackId);
            setPlaybackToken(muxPlaybackToken);

            await signOut(partnerAuth);
        }
        fetchData();
    }, []);

    return (
        <div>
            <div style={{ width: '500px', height: 'auto' }}>
                token {playbackToken}
                playback id {playbackId}
                <MuxPlayer
                    playbackId={playbackId}
                    tokens={{
                        playback: playbackToken
                    }}
                    streamType="on-demand"
                />
            </div>
        </div>
    );

}

export default PlayMux;
