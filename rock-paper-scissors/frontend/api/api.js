////////////////////////////////////////////////////////////////////////////
//Server connecting
////////////////////////////////////////////////////////////////////////////

import axios from "axios";

import { SERVER_ADDRESS } from "@/cosntant/constant";

export const getMessagesByRoomId = async (_roomId) => {
    const api_url = SERVER_ADDRESS + '/api/user/history/' + _roomId;

    try{
        const response = await axios.get(api_url);
        return response.data;
    } catch(error) {
        console.log('checkRoomStatus Error:', error);
    }
};

export const checkRoomStatus = async (_roomId) => {

    const api_url = SERVER_ADDRESS + '/api/admin/check/room/' + _roomId;
    try {
        const response = await axios.get(api_url);
        return response.data;
    } catch (error) {
        console.log('checkRoomStatus Error:', error);
    }
};

export const sendMessageByRoomId = async (_roomId, _address, _stickerType) => {

    const api_url = SERVER_ADDRESS + '/api/user/history/sendMessage';
    try {
        const inputParam = {
            roomId: _roomId,
            walletAddress: _address,
            stickerType: _stickerType
        };

        const response = await axios.post(api_url, inputParam);
        return response.data;
    } catch (error) {
        console.log('checkRoomStatus Error:', error);
    }
};

export const getGameTokenByAddress = async (_roomId, _address) => {

    const api_url = SERVER_ADDRESS + '/api/user/gameToken/get';
    try {
        const inputParam = {
            roomId: _roomId,
            walletAddress: _address
        };

        const response = await axios.post(api_url, inputParam);
        return response.data;
    } catch (error) {
        console.log('getGameTokenByAddress Error:', error);
    }
};

export const finishGameByWinner = async (_roomId, _address) => {

    const api_url = SERVER_ADDRESS + '/api/admin/room/delete';
    try {
        const inputParam = {
            roomId: _roomId,
            walletAddress: _address
        };

        const response = await axios.post(api_url, inputParam);
        return response.data;
    } catch (error) {
        console.log('finishGameByWinner Error:', error);
    }
};

export const getRooms = async () => {
    const api_url = SERVER_ADDRESS + '/api/admin/rooms';

    try{
        const response = await axios.post(api_url, {});
        return response.data;
    } catch(error) {
        console.log('getRooms Error:', error);
    }
};

export const createRoom = async (_address) => {
    const api_url = SERVER_ADDRESS + '/api/admin/createRoom';

    try{
        const response = await axios.post(api_url, {walletAddress: _address});
        return response.data;
    } catch(error) {
        console.log('createRoom Error:', error);
    }
};

export const registerUser = async (_address, _count) => {
    const api_url = SERVER_ADDRESS + '/api/user/register';

    const inputParam = {
        walletAddress: _address,
        stickerCount: _count
    }
    try{
        const response = await axios.post(api_url, inputParam);
        return response.data;
    } catch(error) {
        console.log('registerUser Error:', error);
    }
};

export const updateUser = async (_address, _count) => {
    const api_url = SERVER_ADDRESS + '/api/user/update';

    const inputParam = {
        walletAddress: _address,
        count: _count
    }
    try{
        const response = await axios.post(api_url, inputParam);
        return response.data;
    } catch(error) {
        console.log('updateUser Error:', error);
    }
};

export const getUser = async (_address) => {
    const api_url = SERVER_ADDRESS + '/api/user/info';

    const inputParam = {
        walletAddress: _address
    };

    try{
        const response = await axios.post(api_url, inputParam);
        return response.data;
    } catch(error) {
        console.log('getUser Error:', error);
    }
};

export const gameTokenBuy = async (_rock, _scissors, _paper, _address, _room) => {
    const api_url = SERVER_ADDRESS + '/api/user/gameToken/buy';

    const inputParam = {
        rock: _rock,
        scissors: _scissors,
        paper: _paper,
        walletAddress: _address,
        roomId: _room
    };

    try{
        const response = await axios.post(api_url, inputParam);
        return response.data;
    } catch(error) {
        console.log('gameTokenBuy Error:', error);
    }
};

export const gameTokenGet = async (_address, _room) => {
    const api_url = SERVER_ADDRESS + '/api/user/gameToken/get';

    const inputParam = {
        walletAddress: _address,
        roomId: _room
    };

    try{
        const response = await axios.post(api_url, inputParam);
        return response.data;
    } catch(error) {
        console.log('gameTokenGet Error:', error);
    }
};