import React, {useState} from 'react';
import { DataGrid, GridColDef, GridSelectionModel, GridToolbarFilterButton } from '@mui/x-data-grid';
import { serverCalls } from '../../api';
import { useGetData, useGetData2 } from '../../custom-hooks';
import { Button,Dialog,
        DialogActions,
        DialogContent,
        DialogContentText,
        DialogTitle } from '@mui/material'; 
import { VillagerForm } from '../../components/VillagerForm';
import CloseIcon from '@mui/icons-material/Close';
import { chooseName,
        chooseSpecies
        } from '../../redux/slices/rootSlice';
import { useDispatch, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const columns: GridColDef[] = [
    {
        field: 'image',
        headerName: 'Image',
        width: 300,
        renderCell: (params) => <img src={params.value} height='250' width='250' />
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 100,
    },
    {
        field: 'species',
        headerName: 'Species',
        width: 100,
    },
    {
        field: 'gender',
        headerName: 'Gender',
        width: 100,
    },
    {
        field: 'birthday',
        headerName: 'Birthday',
        width: 150,
    },
    {
        field: 'personality',
        headerName: 'Personality',
        width: 100,
    },
    {
        field: 'hobby',
        headerName: 'Hobby',
        width: 100,
    },
    {
        field: 'phrase',
        headerName: 'Phrase',
        width: 100,
    },
    { 
        field: 'id', 
        headerName: 'Villager ID', 
        width: 300 
    },
];


export const DataTable =  () => {
    let { villagerData, getData } = useGetData();
    let [open, setOpen] = useState(false);
    let [error, setError] = useState(false);
    let [gridData, setData] = useState<GridSelectionModel>([])
    let [pageSize, setPageSize] = React.useState<number>(5);

    console.log(villagerData)

    // if a villager isnt selected, show error message
    let handleOpen = () => {
        if (gridData[0]) {
            setOpen(true)
        } else {
            setError(true)
        }
    }

    let handleClose = () => {
        setOpen(false)
        setError(false)
    }

    // if a villager isnt selected, show error message
    let deleteData = () => {
        if (gridData[0]) {
            serverCalls.delete(`${gridData[0]}`)
            getData()
        } else {
            setError(true)
        }
        
    }

    if (localStorage.getItem('myAuth') == 'true') {
        return (
            <div style={{ height: 800, width: '100%' }}>
                <h2>My Villager Collection</h2>
                <DataGrid 
                    rows={villagerData}
                    getRowHeight={() => 'auto'} 
                    columns={columns} 
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    checkboxSelection 
                    onSelectionModelChange = {(newSelectionModel) => {setData(newSelectionModel);}}
                    {...villagerData}  
                />

                <Button onClick={handleOpen}>Update</Button>
                <Button variant="contained" color="error" onClick={deleteData}>Delete</Button>

                {/*Dialog Pop Up begin */}
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Update A Villager</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Villager ID: {gridData[0]}</DialogContentText>
                        <VillagerForm id={`${gridData[0]}`}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick = {handleClose} color="primary">Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={error} onClose={handleClose} aria-labelledby="form-dialog-error">
                    <DialogActions>
                        <CloseIcon onClick={handleClose} color="primary" />
                    </DialogActions>
                    <DialogTitle id="form-dialog-error">Please select a villager to make changes.</DialogTitle>
                </Dialog>
            </div>
        );
    } else {
        return(
            <div>
                <h3>Please Sign In to View Your Villager Collection</h3>
            </div>
            )
    };
}


const columns2: GridColDef[] = [
    {
        field: 'image',
        headerName: 'Image',
        width: 300,
        renderCell: (params) => <img src={params.value} height='250' width='250' />
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 100,
    },
    {
        field: 'species',
        headerName: 'Species',
        width: 100,
    },
    {
        field: 'gender',
        headerName: 'Gender',
        width: 100,
    },
    {
        field: 'birthday',
        headerName: 'Birthday',
        width: 150,
    },
    {
        field: 'personality',
        headerName: 'Personality',
        width: 100,
    },
    {
        field: 'hobby',
        headerName: 'Hobby',
        width: 100,
    },
    {
        field: 'phrase',
        headerName: 'Phrase',
        width: 100,
    }
];

// show all villagers from the third party api
export const DataTable2 =  () => {
    let { villagerData, getData } = useGetData2();
    let [error, setError] = useState(false);
    let [rowData, setRowData] = useState<any>([]);
    let [pageSize, setPageSize] = useState<number>(25);
    const navigate = useNavigate();

    // filter only the data we need
    let villagerInfo:any = [];
    Object.keys(villagerData).forEach(key => {
        let value = villagerData[key];
        const villager: { [key: string]: any } = {};
        villager.name = value.name['name-USen'];
        villager.species = value.species;
        villager.gender = value.gender;
        villager.birthday = value['birthday-string'];
        villager.personality = value.personality;
        villager.hobby = value.hobby;
        villager.phrase = value['catch-phrase'];
        villager.image = value.image_uri;
        villagerInfo.push(villager)
    })

    let handleClose = () => {
        setError(false)
    }

    const dispatch = useDispatch();
    const store = useStore();

    // if a villager isnt selected, show error message
    const addVillager = async () => {
        console.log(rowData)
        // add all selected villagers
        if (rowData.length > 0) {
            rowData.forEach(async (villager: any) => {
                dispatch(chooseName(villager.name));
                dispatch(chooseSpecies(villager.species));
                await serverCalls.create(store.getState());
            })
            await navigate('/dashboard');
        } else {
            setError(true)
        }
    }

    if (localStorage.getItem('myAuth') == 'true') {
        return (
            <div style={{ height: 800, width: '100%' }}>
                    <h2>Animal Crossing Villager List</h2>
                    <DataGrid 
                        rows={villagerInfo} 
                        getRowId={(row) => row.name}
                        getRowHeight={() => 'auto'}
                        columns={columns2} 
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[25, 50, 100]}
                        pagination
                        components={{ Toolbar: GridToolbarFilterButton }}
                        checkboxSelection 
                        onSelectionModelChange={(ids) => {
                            const selectedIDs = new Set(ids);
                            const selectedRows = villagerInfo.filter((row: any) =>
                                selectedIDs.has(row.name)
                            );
                            setRowData(selectedRows)
                        }}
                        {...villagerInfo}  
                    />

                    <Button variant="contained" color="success" onClick={addVillager}>Add Villager</Button>

                    <Dialog open={error} onClose={handleClose} aria-labelledby="form-dialog-error">
                        <DialogActions>
                            <CloseIcon onClick={handleClose} color="primary" />
                        </DialogActions>
                        <DialogTitle id="form-dialog-error">Please select a villager to add.</DialogTitle>
                    </Dialog>
            </div>
        );
    } else {
        return(
            <div>
                <h3>Please Sign In to Browse Villagers</h3>
            </div>
        )
    };
}