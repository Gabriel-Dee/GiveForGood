import styles from "../style";
import React, { useState} from "react";
import { Buffer } from "buffer";
import { Web3Storage, getFilesFromPath, File } from 'web3.storage'

const Forms = () => {

  const [userDetails, setUserDetails] = useState({
    firstName:'',
    lastName:'',
    reason:'',
    amount:0,
    comments:''
  });

  const [cid, setCid] = useState('')

  const [loading, setLoading] = useState(false)

  const getAccessToken = () => {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY1MEU3NjRFMEM4NjAwQ2Q5QTQ1MTZENzJGMTFEOTM3NjViMjIyOTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njk1MDU4OTc4OTYsIm5hbWUiOiJtYWx1bHUifQ.tbHFCYkW0UH97BDcByYgOeznM8vsZSXbVuZolNooa8A';
  }

  const makeStorageClient = () => {
    return new Web3Storage({token:getAccessToken()})
  }

  const makeFileObjects = (userDetails) => {
    const obj = { 
      firstname: userDetails.firstName ,
      lastname: userDetails.lastName ,
      reason: userDetails.reason,
      amount: userDetails.amount,
      comments: userDetails.comments
    }
    const buffer = Buffer.from(JSON.stringify(obj))
    const files = [new File([buffer], `${userDetails.firstName} ${userDetails.lastName}`)]
    return files;
  }

  const storeFiles = async(files) => {
    const client = makeStorageClient()
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    return cid
  }

  const retrieveFiles = async(cid) => {
    const client = makeStorageClient()
    const res = await client.get(cid)
    if (!res.ok) {
      console.log(`failed to get ${cid} - [${res.status}] ${res.body}`)
    }
    const files = await res.files()
    for (const file of files) {
      const text = await file.text()
      const obj = JSON.parse(text)
      const data = {
        firstname: obj.firstname,
        lastname: obj.lastname,
        reason: obj.reason,
        amount: obj.amount,
        comments: obj.comments
      }
      console.log("Retrieved Data:", data)
    }
  }

    return (
      <section className={`${styles.container}`}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <input type="text" value={userDetails.firstName} onChange={e => setUserDetails({...userDetails, firstName:e.target.value})} required/>
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" value={userDetails.lastName} onChange={e => setUserDetails({...userDetails, lastName:e.target.value})} required/>
          </div>
          <div>
            <label>Reason</label>
            <input type="text" value={userDetails.reason} onChange={e => setUserDetails({...userDetails, reason:e.target.value})} required/>
          </div>
          <div>
            <label>Amount</label>
            <input type="number" value={userDetails.amount} onChange={e => setUserDetails({...userDetails, amount:e.target.value})} required/>
          </div>
          <div>
            <label>Comments</label>
            <textarea value={userDetails.comments} onChange={e => setUserDetails({...userDetails, comments:e.target.value})} required/>
          </div>
          <div>
            <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
          </div>
        </form>
        <div>
          <button onClick={() => retrieveFiles(cid)}>Retrieve Data</button>
        </div>
      </section>
    )
  
}
export default Forms