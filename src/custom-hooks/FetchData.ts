import React, { useState, useEffect } from 'react';
import { serverCalls, serverCalls2 } from '../api';

export const useGetData = () => {
    const [villagerData, setData] = useState<any>([]);

    async function handleDataFetch(){
        const result = await serverCalls.get();
        setData(result)
    }

    // Introducing the useEffect Hook to add our data to react State
    useEffect( () => {
        handleDataFetch();
    }, [])

    return {villagerData, getData:handleDataFetch}
}


// custom hook to fetch data from third party api
export const useGetData2 = () => {
    const [villagerData, setData] = useState<any>([]);

    async function handleDataFetch(){
        const result = await serverCalls2.get();
        setData(result)
    }

    // Introducing the useEffect Hook to add our data to react State
    useEffect( () => {
        handleDataFetch();
    }, [])

    return {villagerData, getData:handleDataFetch}
}