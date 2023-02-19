import React from 'react';
import { useDispatch, useStore } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { chooseName,
        chooseSpecies
        } from '../../redux/slices/rootSlice';
import { Input } from '../sharedComponents/Input';
import { serverCalls } from '../../api';
import { useGetData } from '../../custom-hooks';

interface VillagerFormProps {
    id?:string;
    data?:{}
}

export const VillagerForm = (props:VillagerFormProps) => {

    const dispatch = useDispatch();
    let { villagerData, getData } = useGetData();
    const store = useStore()
    const { register, handleSubmit } = useForm({ })

    const onSubmit = async (data:any, event:any) => {

        if(props.id!){
            await serverCalls.update(props.id!, data)
            console.log(`Updated:${data} ${props.id}`)
            window.location.reload()
            event.target.reset();
        } else {
            dispatch(chooseName(data.name))
            dispatch(chooseSpecies(data.species))
            await serverCalls.create(store.getState())
            window.location.reload()
        }
    }

    return (
        <div>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name">Name</label>
                    <Input {...register('name')} name="name" placeholder='Enter Name' />
                </div>
                <div>
                    <label htmlFor="species">Species</label>
                    <Input {...register('species')} name="species" placeholder="Enter Species"/>
                </div>
                <Button type='submit'>Submit</Button>
            </form>
        </div>
    )
}