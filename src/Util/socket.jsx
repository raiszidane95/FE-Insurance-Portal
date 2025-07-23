// utils/socket.ts
import { useEffect } from "react";
import { io } from "socket.io-client";

// const socket = io(`${import.meta.env.VITE_BASE_URL}`, {
const socket = io({
    path: import.meta.env.VITE_SOCKET
});

socket.on("connection", () => {
    console.log("Connected to socket.io server");
});

socket.on("disconnect", () => {
    console.log("Disconnected from socket.io server");
});

export const useQueueSocket = (fetchData) => {
    useEffect(() => {
        socket.on("antrianUpdate", () => {
            fetchData();
        });

        return () => {
            socket.off("antrianUpdate");
        };
    }, [fetchData]);
};

export const useQueueSocketGizi = (fetchData) => {
    useEffect(() => {
        socket.on("orderUpdate", () => {
            fetchData();
        });

        return () => {
            socket.off("orderUpdate");
        };
    }, [fetchData]);
};

export const useQueueSocketwithAuth = (fetchData, currentNoReg) => {
    useEffect(() => {
        const handleAntrianUpdate = (data) => {
            if (data && data.No_MR == currentNoReg) {
                fetchData();
            }
        };

        socket.on("antrianUpdate", handleAntrianUpdate);

        return () => {
            socket.off("antrianUpdate", handleAntrianUpdate);
        };
    }, [fetchData, currentNoReg]);
};

export const useSocketDapur = (onUpdate, waktuMakan) => {
  useEffect(() => {
    const eventName = `dapurUpdate-${waktuMakan}`;
    const handler = () => {
      onUpdate();
    };

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [onUpdate, waktuMakan]);
};

export default socket;