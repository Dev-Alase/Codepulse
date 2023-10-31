// EditorPage.js
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [editingPermission, setEditingPermission] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Use wss protocol for secure WebSocket connection
        socketRef.current = await initSocket('wss://codesynchub.me/Codepulse');
        socketRef.current.on('connect_error', (err) => handleErrors(err));
        socketRef.current.on('connect_failed', (err) => handleErrors(err));

        function handleErrors(e) {
          console.log('socket error', e);
          toast.error('Socket connection failed, try again later.');
          reactNavigator('/');
        }

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.username,
          editingPermission,
        });

        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, username, socketId, editingPermission }) => {
            if (username !== location.state?.username) {
              toast.success(`${username} joined the room.`);
              console.log(`${username} joined`);
            }
            setClients(clients);
            setEditingPermission(editingPermission);
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
          }
        );

        socketRef.current.on(
          ACTIONS.DISCONNECTED,
          ({ socketId, username }) => {
            toast.success(`${username} left the room.`);
            setClients((prev) => {
              return prev.filter(
                (client) => client.socketId !== socketId
              );
            });
          });
      } catch (error) {
        console.error("Error initializing socket:", error);
        // Handle the error (e.g., redirect to the home page)
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="editor-page">
      <aside className="sidebar">
        <div className="logo">
          <img className="logo-image" src="/icon.png" alt="logo" />
        </div>
        <h3>Connected Users</h3>
        <div className="clients-list">
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username} />
          ))}
        </div>
        <button className="btn copy-btn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leave-btn" onClick={leaveRoom}>
          Leave
        </button>
      </aside>
      <div className="editor-wrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
          readOnly={!editingPermission}
        />
      </div>
    </div>
  );
};

export default EditorPage;
