import { createSlice } from '@reduxjs/toolkit';

export interface VillagerState {
    name: string,
    species: string
}

const initialState: VillagerState = {
    name: '',
    species: ''
};

const rootSlice = createSlice({
    name: "root",
    initialState,
    reducers: {
        chooseName: (state, action) => { state.name = action.payload },
        chooseSpecies: (state, action) => { state.species = action.payload }
    }
})

// Export Reducer
export const reducer = rootSlice.reducer;
export const {
    chooseName,
    chooseSpecies
} = rootSlice.actions;