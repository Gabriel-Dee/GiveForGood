import styles from "../style";
// import { retrieveFiles } from './Forms.jsx'
import React, { useState, useEffect} from "react";
import {
    createColumnHelper,
    // flexRender,
    // getCoreRowModel,
    // useReactTable,
  } from '@tanstack/react-table'
import { Web3Storage } from 'web3.storage'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveSelectedUser } from "../state/userData/userDataSlice";

const columnHelper = createColumnHelper()

const columns = [
  columnHelper.accessor('firstname', {
    header: () => 'First Name',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('lastname', {
    header: () => 'Last Name',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('reason', {
    header: () => 'Reason',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('amount', {
    header: () => 'Amount',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('comments', {
    header: () => 'Comments',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  ]

const Table = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [data, setData] = useState('')
    const rerender = React.useReducer(() => ({}), {})[1]
    // const table = useReactTable({
    //   data,
    //   columns,
    //   getCoreRowModel: getCoreRowModel(),
    // })

    useEffect(() => {
        fetchFunction();
    }, [])

  

  const getAccessToken = () => {
    // console.log(process.env.WEB3STORAGE_TOKEN)
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY1MEU3NjRFMEM4NjAwQ2Q5QTQ1MTZENzJGMTFEOTM3NjViMjIyOTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njk1MDU4OTc4OTYsIm5hbWUiOiJtYWx1bHUifQ.tbHFCYkW0UH97BDcByYgOeznM8vsZSXbVuZolNooa8A';
  }

  const makeStorageClient = () => {
    return new Web3Storage({token:getAccessToken()})
  }



  const listUsers = async() => {
    const client = makeStorageClient();
    const listItems = []
    for await (const upload of client.list()) {
        listItems.push({
            firstname:upload.firstname,
            lastname:upload.lastname,
            reason:upload.reason,
            amount:upload.amount,
            comments:upload.comments,
            createdAt:new Date(upload.created).toString()
        })
      }
      setData(listItems)
  }

    const fetchFunction =  async() => {  
       const users = await listUsers()
    }


    const handleData = (x) => {
        dispatch(saveSelectedUser(x))
        // console.log(x.row.original)
    }
  
    return (
      <section className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow w-full`}>
        <div className="flex-1 flex flex-col bg-black-gradient-2">
        <h2 className={styles.heading2}>Applicants for Fund.</h2>
        <div className="p-2 w-full flex flex-col items-center">
        <table cellPadding={20} border={10} className="border border-black">
          <thead>
            <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Comments</th>
                <th>CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr className="border border-black hover:cursor-pointer" key={item.createdAt} onClick={() =>{ 
                      handleData(item)
                      navigate("/user")
                  }
                      }>
                <td>{item.firstname}</td>
                <td>{item.lastname}</td>
                <td>{item.reason}</td>
                <td>{item.amount}</td>
                <td>{item.comments}</td>
                <td>{item.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-4" />
        <button onClick={() => rerender()} className="border p-2">
          Rerender
        </button>
      </div>
      </div>
      </section>
    )
  
  // return (
  //   <section className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow w-full`}>
  //     <div className="flex-1 flex flex-col bg-black-gradient-2">
  //     <h2 className={styles.heading2}>Applicants for Fund.</h2>
  //     <div className="p-2 w-full flex flex-col items-center">
  //     <table cellPadding={20} border={10} className="border border-black">
  //       <thead>
  //         {table.getHeaderGroups().map(headerGroup => (
  //           <tr  className="border border-black" key={headerGroup.id}>
  //             {headerGroup.headers.map(header => (
  //               <th key={header.id}>
  //                 {header.isPlaceholder
  //                   ? null
  //                   : flexRender(
  //                       header.column.columnDef.header,
  //                       header.getContext()
  //                     )}
  //               </th>
  //             ))}
  //           </tr>
  //         ))}
  //       </thead>
  //       <tbody>
  //         {table.getRowModel().rows.map(row => (
  //           <tr className="border border-black hover:cursor-pointer" key={row.id}>
  //             {row.getVisibleCells().map(cell => (
  //               <td onClick={() =>{ 
  //                   handleData(cell.getContext())
  //                   navigate("/user")
  //               }
  //                   } key={cell.id}>
  //                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //               </td>
  //             ))}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //     <div className="h-4" />
  //     <button onClick={() => rerender()} className="border p-2">
  //       Rerender
  //     </button>
  //   </div>
  //       <form >
        
  //         {/* <button onClick={handleGenerate} className={`py-4 mt-3 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none ${styles} rounded-[10px] `}>Generate</button> */}
        
  //       </form>
  //   </div>
    
  //   </section>
  // )
}

export default Table