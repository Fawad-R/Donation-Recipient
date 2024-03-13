import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'

const FetchDonor = (props) => {
    let [state, updateState] = useState([])
    // let [state2,updateState2]=useState()
    console.log('props', props)
    // let propsName=props.name;
    // propsName=propsName.trim();
    // console.log('propsName',propsName);
    let fetchUser = async () => {
        console.log('fetch');
        let val = await axios.get(`/receipients/${props.id}`)
        console.log('Donor', val.data);
        updateState(val.data)
        // console.log('state.email',state.email);
        // console.log('propsName2',state[propsName]);
    }
    useEffect(() => {
        fetchUser();
    }, [])
    return (
        state.length !== 0 ?
            <small>
                Donor: {state.firstName} {state.lastName}
            </small>
            : ''
    )
}

export default FetchDonor