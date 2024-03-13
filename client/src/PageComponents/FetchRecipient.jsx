import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'

const FetchRecipient = (props) => {
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
                Receipient: {state.name}
            </small>
            : ''
    )
}

export default FetchRecipient